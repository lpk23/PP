const jwt = require('jsonwebtoken');
const { User, Role, UserRole } = require('./model');
require('dotenv').config();

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
        req.userRoles = decoded.roles; // Добавляем список прав в объект запроса

        next();
    });
}


async function checkPermissions(token, requiredPermission) {
    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (decoded && decoded.userId) {
            // Получение информации о пользователе из базы данных
            const user = await User.findOne({
                where: { id: decoded.userId },
                include: [{ model: Role, through: UserRole, as: 'roles' }]
            });

            if (user && user.roles && user.roles.some(role => role.roleName === requiredPermission)) {
                return "OK";
            }
        }
    } catch (error) {
        console.error('Ошибка при проверке прав доступа:', error);
    }

    return null;
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





module.exports = {
    verifyToken,
    checkPermissions,
    generateResetCode
};
