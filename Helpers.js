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
module.exports = {
    verifyToken,
    checkPermissions,
    generateResetCode,
    checkPermission
};
