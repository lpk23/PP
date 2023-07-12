const { exportStudentInfoToPDF} = require("./Helpers");
const {Graduate,TrainingDirection}=require('./model')
const {parse} = require('csv-parse');

const fs = require('fs');
const {BIGINT} = require("sequelize");

async function exportPdf(req, res) {
    const graduateId = req.params.id;
    const filePath = `./graduates/graduate_${graduateId}.pdf`;

    try {
        await exportStudentInfoToPDF(graduateId, filePath);

        const fileStream = fs.createReadStream(filePath);

        // Устанавливаем заголовки для скачивания файла
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=graduate_${graduateId}.pdf`);

        fileStream.pipe(res);

        // Удаляем файл после завершения передачи
        fileStream.on('close', () => {
            fs.unlinkSync(filePath);
        });
    } catch (error) {
        console.error('Ошибка при экспорте сведений о выпускнике в PDF:', error);
        res.status(500).json({ error: 'Ошибка при экспорте сведений о выпускнике в PDF' });
    }
}

async function importFile(req, res) {
    try {
        console.log(req);
        if (!req.files || !req.files.csv) {
            res.status(400).json({ error: 'CSV файл не найден' });
            return;
        }

        const csvFile = req.files.csv;

        // Сохранение загруженного файла во временную папку
        const filePath = './tmp/' + Date.now() + '-' + csvFile.name;
        await csvFile.mv(filePath);

        // Чтение CSV файла и импорт данных
        const csvData = fs.readFileSync(filePath, 'utf-8');

        const records = await new Promise((resolve, reject) => {
            parse(csvData, { delimiter: ';' }, (err, output) => {
                if (err) reject(err);
                resolve(output);
            });
        });

        const headers = records[0];
        const newGraduates = [];
        const existingGraduates = [];
        const failedImports = []; // Список неудачных импортов

        for (let i = 1; i < records.length; i++) {
            const row = records[i];
            const graduate = {};

            for (let j = 0; j < headers.length; j++) {
                const header = headers[j].trim();
                const value = row[j] ? row[j].trim() : '';
                graduate[header] = value;
            }

            const snils = graduate.snils;

            if (snils) {
                // Проверка, что СНИЛС состоит только из цифр
                if (!/^\d+$/.test(snils)) {
                    failedImports.push(snils)
                    console.log(`Значение СНИЛС ${snils} содержит недопустимые символы. Пропускаю импорт выпускника.`);
                    continue;
                }

                // Проверка существования записи по snils
                const existingGraduate = await Graduate.findOne({
                    where: { snils: snils },
                });

                if (existingGraduate) {
                    existingGraduates.push(snils);
                    console.log(`Запись выпускника с SNILS ${snils} уже существует в базе данных. Пропускаю импорт.`);
                    continue; // Пропускаем импорт, если запись уже существует
                }

                try {
                    // Поиск или создание TrainingDirection
                    const [trainingDirection, created] = await TrainingDirection.findOrCreate({
                        where: {
                            code: graduate.trainingDirectionCode,
                            name: graduate.trainingDirectionName,
                        },
                    });

                    // Создание выпускника в базе данных
                    const createdGraduate = await Graduate.create({
                        ...graduate,
                        trainingDirectionId: trainingDirection.id,
                    });

                    newGraduates.push(snils);
                    console.log('Создан выпускник:', createdGraduate.toJSON());
                } catch (error) {
                    failedImports.push(snils); // Добавление СНИЛСа в список неудачных импортов
                    console.error('Ошибка при импорте выпускника:', error);
                }
            } else {
                console.log('Значение СНИЛС не определено. Пропускаю импорт выпускника.');
            }
        }

        console.log('Импорт данных завершен');

        // Отправка успешного ответа с списком новых, существующих и неудачных импортов
        fs.unlinkSync(filePath);
        res.json({ message: 'Импорт успешно выполнен', newGraduates, existingGraduates, failedImports });
    } catch (error) {
        console.error('Ошибка при импорте:', error);
        res.status(500).json({ error: 'Ошибка при импорте' });
    }
}




module.exports = {
    exportPdf,
    importFile
};
