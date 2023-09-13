const { exportStudentInfoToPDF} = require("./Helpers");
const {Graduate,TrainingDirection}=require('./model')
const {parse} = require('csv-parse');
const fs = require('fs');
const puppeteer = require('puppeteer');

async function exportPdf(req, res) {
    const studentIds = req.body.id;
    let students = [];

    if (Array.isArray(studentIds)) {
        // Если передан массив идентификаторов студентов, получаем информацию для каждого студента
        for (const studentId of studentIds) {
            const student = await Graduate.findByPk(studentId);
            if (student) {
                students.push(student);
            }
        }
    } else if (studentIds === 'all') {
        // Если передано значение 'all', получаем информацию для всех студентов
        students = await Graduate.findAll();
    } else {
        // Если передан только один идентификатор студента, получаем информацию для этого студента
        const student = await Graduate.findByPk(studentIds);
        if (student) {
            students.push(student);
        }
    }

    if (students.length === 0) {
        // Студенты не найдены
        res.status(404).json({ error: 'Студенты не найдены' });
        return;
    }

    const filePath = `./graduates/graduates.pdf`;

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        for (const student of students) {
            const studentFilePath = `./graduates/graduate_${student.id}.pdf`;
            await exportStudentInfoToPDF(student.id, studentFilePath);
        }

        await browser.close();

        if (students.length === 1) {
            // Если только один студент, отправляем его PDF-файл в ответ на запрос
            const fileStream = fs.createReadStream(`./graduates/graduate_${students[0].id}.pdf`);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=graduate_${students[0].id}.pdf`);
            fileStream.pipe(res);
            fileStream.on('end', () => {
                fs.unlinkSync(`./graduates/graduate_${students[0].id}.pdf`); // Удаляем временный PDF-файл после отправки
            });
        } else {
            // объединение одиночных pdf файлов в один файл
            const mergePDFs = require('easy-pdf-merge');
            const pdfFiles = students.map((student) => `./graduates/graduate_${student.id}.pdf`);
            mergePDFs(pdfFiles, filePath, (err) => {
                if (err) {
                    console.error('Ошибка при объединении PDF-файлов:', err);
                    res.status(500).json({ error: 'Ошибка при экспорте сведений о студентах в PDF' });
                    return;
                }

                // Удаления файлов
                pdfFiles.forEach((file) => fs.unlinkSync(file));

                // Отправка файла
                const fileStream = fs.createReadStream(filePath);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=graduates.pdf`);
                fileStream.pipe(res);
                fileStream.on('end', () => {
                    fs.unlinkSync(filePath);
                });
            });
        }
    } catch (error) {
        console.error('Ошибка при экспорте сведений о студентах в PDF:', error);
        res.status(500).json({ error: 'Ошибка при экспорте сведений о студентах в PDF' });
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
                    data={
                            snils:snils,
                            fullName: graduate.fullName,
                            gender: graduate.gender,
                            phone: graduate.phone,
                            trainingDirectionName: graduate.trainingDirectionName
                        }
                    failedImports.push(data)
                    console.log(`Значение СНИЛС ${snils} содержит недопустимые символы. Пропускаю импорт выпускника.`);
                    continue;
                }

                // Проверка существования записи по snils
                const existingGraduate = await Graduate.findOne({
                    where: { snils: snils },
                });

                if (existingGraduate) {
                    data={
                        snils:snils,
                        fullName: graduate.fullName,
                        gender: graduate.gender,
                        phone: graduate.phone,
                        trainingDirectionName: graduate.trainingDirectionName
                    }
                    existingGraduates.push(data);
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
                    data={
                        snils:snils,
                        fullName: graduate.fullName,
                        gender: graduate.gender,
                        phone: graduate.phone,
                        trainingDirectionName: graduate.trainingDirectionName
                    }
                    newGraduates.push(data);
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
