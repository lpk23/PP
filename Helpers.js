const jwt = require('jsonwebtoken');
const { User, Role, UserRole, Graduate, JobHistory,TrainingDirection, Employer} = require('./model');
require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Отсутствует токен авторизации' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Срок действия токена истек' });
            }
            return res.status(401).json({ error: 'Недействительный токен авторизации' });
        }

        req.userId = decoded.userId;

        next();
    });
}

function checkPermission(requiredPermissions) {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization; // Получение токена из заголовков запроса

            // Проверка наличия токена
            if (!token) {
                return res.status(401).json({ message: 'Токен отсутствует' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

            // Проверка наличия идентификатора пользователя в раскодированном токене
            if (decoded && decoded.userId) {
                // Получение информации о пользователе из базы данных
                const user = await User.findOne({
                    where: { id: decoded.userId },
                    include: [{ model: Role, through: UserRole, as: 'roles' }]
                });

                // Проверка наличия пользователя и требуемых прав доступа
                if (user && user.roles) {
                    const passedPermissions = user.roles
                        .filter(role => requiredPermissions.includes(role.roleName))
                        .map(role => role.roleName);

                    if (passedPermissions.length >0) {
                        // Все требуемые права доступа пройдены
                        req.passedPermissions = passedPermissions; // Добавление прошедших прав в тело запроса
                        next(); // Переход к следующему обработчику
                    } else {
                        // Не все требуемые права доступа пройдены
                        return res.status(403).json({ message: 'Недостаточно прав доступа' });
                    }
                } else {
                    // Пользователь не имеет ролей или требуемых прав доступа
                    return res.status(403).json({ message: 'Недостаточно прав доступа' });
                }
            } else {
                // Идентификатор пользователя отсутствует в раскодированном токене
                return res.status(401).json({ message: 'Некорректный токен' });
            }
        } catch (error) {
            // Ошибка при проверке прав доступа
            console.error('Ошибка при проверке прав доступа:', error);
            return res.status(500).json({ message: 'Ошибка при проверке прав доступа' });
        }
    };
}


// Функция для генерации случайного кода сброса пароля
function generateResetCode() {
    const length = parseInt(process.env.RESET_CODE_LENGTH) || 6; // Длина кода (по умолчанию 6)
    const characters = '0123456789'; // Допустимые символы

    let resetCode = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        resetCode += characters[randomIndex];
    }

    return resetCode;
}


async function exportStudentInfoToPDF(studentId, filePath) {
    try {
        const student = await Graduate.findByPk(studentId, {
            include: [
                {
                    model: TrainingDirection,
                    attributes: ['id', 'code', 'name'],
                },
            ],
            attributes: { exclude: ['trainingDirectionId'] },
        });

        if (!student) {
            response.status(500).json({ error: 'Ошибка' });
            return;
        }

        const templatePath = './template.html';
        const template = await fs.promises.readFile(templatePath, 'utf8');

        const compiledTemplate = template.replace('{{fullName}}', student.fullName)
            .replace('{{dateOfBirth}}', formatDate(student.dateOfBirth))
            .replace('{{gender}}', student.gender)
            .replace('{{citizenship}}', student.citizenship)
            .replace('{{address}}', student.address)
            .replace('{{phone}}', student.phone)
            .replace('{{email}}', student.email)
            .replace('{{snils}}', student.snils)
            .replace('{{educationForm}}', student.educationForm)
            .replace('{{graduationYear}}', student.graduationYear);

        let jobHistoriesHtml = '';
        const job = await JobHistory.findAll({
            where: { graduateId: studentId },
            order: [['startDate', 'ASC']],
            include:[Employer]
        });


        job.forEach((jobHistory) => {
            let jobHistoryHtml = '';
            if (jobHistory.jobType === 'выпустник') {
                jobHistoryHtml = `
                    <li>${formatDate(jobHistory.startDate)} Завершение обучения по направлению подготовки ${student.training_direction.code} ${student.training_direction.name}</li>
                `;
            }
            if (jobHistory.jobType === 'работающий') {
                jobHistoryHtml = `
                    <li>${formatDate(jobHistory.startDate)} Трудоустройство в ${jobHistory.employer.name}, должность ${jobHistory.position}</li>
                `;
            }
            if (jobHistory.jobType === 'безработный') {
                jobHistoryHtml = `
                    <li>${formatDate(jobHistory.startDate)} Безработный, поставлен на учёт</li>
                `;
            }
            if (jobHistory.jobType === 'самозанятый') {
                jobHistoryHtml = `
                    <li>${formatDate(jobHistory.startDate)} Самозанятый, род деятельности - ${jobHistory.selfEmploymentActivity}</li>
                `;
            }
            if (jobHistory.jobType === 'служба в ВС') {
                jobHistoryHtml = `
                    <li>${formatDate(jobHistory.startDate)} Служба в ВС РФ, в/ч ${jobHistory.militaryServiceLocation}, ${jobHistory.position}</li>
                `;
            }
            jobHistoriesHtml += jobHistoryHtml;
        });

        const finalHtml = compiledTemplate.replace('{{jobHistories}}', jobHistoriesHtml);

        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

        await page.pdf({ path: filePath, format: 'A4' });

        await browser.close();

        console.log(`Сведения о студенте успешно экспортированы в PDF по пути: ${filePath}`);
    } catch (error) {
        console.error('Ошибка при экспорте сведений о студенте в PDF:', error);
    }
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('ru-RU');
}

const permission = {
    ViewGraduates: 'ViewGraduates',
    ViewGraduateDetails: 'ViewGraduateDetails',
    ManageGraduates: 'ManageGraduates',
    ExportToPDF: 'ExportToPDF',
    ImportData: 'ImportData',
    DeleteOwnAccount: 'DeleteOwnAccount',
    ManageOtherAccounts: 'ManageOtherAccounts',
    ManageTrainingDirection: 'ManageTrainingDirection',
    ManageJobHistory: 'ManageJobHistory',
    ManageEmployers:'ManageEmployers'
};



module.exports = {
    verifyToken,
    generateResetCode,
    checkPermission,
    permission,
    exportStudentInfoToPDF
};
