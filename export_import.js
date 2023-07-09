const { exportStudentInfoToPDF } = require("./Helpers");
const fs = require('fs');

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

module.exports = {
    exportPdf
};
