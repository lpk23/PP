const { User, UserRole, Role } = require('./model');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { Op } = require('sequelize');
const {generateResetCode}=require('./Helpers')

function login(request, response) {
    if (!request.body) return response.sendStatus(400);

    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({ error: 'Не указано email или пароль' });
        }

        User.findOne({ where: { email } })
            .then(async (user) => {
                if (!user) {
                    return response.status(404).json({ error: 'Пользователь не найден' });
                }

                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) {
                    return response.status(401).json({ error: 'Неверный пароль' });
                }

                const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '30h' });
                response.json({ token });
            })
            .catch((error) => {
                console.error('Ошибка при авторизации пользователя:', error);
                response.sendStatus(500);
            });
    } catch (error) {
        console.error('Ошибка при авторизации пользователя:', error);
        response.sendStatus(500);
    }
}


async function register(request, response) {
    if (!request.body) return response.sendStatus(400);

    try {
        const { name, email, password } = request.body;
        if (!email || !password) {
            return response.status(400).json({ error: 'Не указано email или пароль' });
        }

        User.findOne({ where: { email } })
            .then(async (existingUser) => {
                if (existingUser) {
                    return response.status(409).json({ error: 'Пользователь с таким email уже существует' });
                }

                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = await User.create({ name, email, password: hashedPassword });

                // Получение ролей с нужными правами
                const roles = await Role.findAll({
                    where: {
                        roleName: {
                            [Op.in]: [
                                'ViewGraduates',
                                'ViewGraduateDetails',
                                'ExportToPDF',
                                'ViewEmployers',
                                'ViewEmployerDetails',
                                'DeleteOwnAccount',
                            ],
                        },
                    },
                });

                // Присвоение ролей пользователю
                await newUser.setRoles(roles);

                response.json({ status: 'OK' });
            })
            .catch((error) => {
                console.error('Ошибка при создании пользователя:', error);
                response.sendStatus(500);
            });
    } catch (error) {
        console.error('Ошибка при создании пользователя:', error);
        response.sendStatus(500);
    }
}

function getUsers(request, response) {
    const token = request.headers['authorization'];
    // Проверяем наличие токена авторизации
    if (!token) {
        return response.status(401).json({ error: 'Отсутствует токен авторизации' });
    }

    User.findAll({
        include: {
            model: Role,
            through: { attributes: [] } // Исключаем атрибуты связи из результата
        }
    })
        .then((users) => {
            // Преобразуем результат в нужный формат с правами пользователя
            const formattedUsers = users.map((user) => {
                const userRoles = user.roles.map((role) => role.roleName);
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    roles: userRoles
                };
            });

            response.json(formattedUsers);
        })
        .catch((error) => {
            console.error('Ошибка при получении пользователей:', error);
            response.sendStatus(500);
        });
}

async function deleteOwnAccount(req, res) {
    try {
        const token = req.headers['authorization'];
        const userId = req.userId;

        // Проверяем наличие токена авторизации
        if (!token) {
            return res.status(401).json({ error: 'Отсутствует токен авторизации' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        await UserRole.destroy({ where: { userId } });
        await user.destroy();
        res.json({ message: 'Аккаунт успешно удален' });
    } catch (error) {
        console.error('Ошибка при удалении аккаунта:', error);
        res.sendStatus(500);
    }
}

async function deleteOtherAccount(req, res) {
    try {
        const token = req.headers['authorization'];
        const { id } = req.params;

        // Проверяем наличие токена авторизации
        if (!token) {
            return res.status(401).json({ error: 'Отсутствует токен авторизации' });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        await UserRole.destroy({ where: { userId: id } });
        await user.destroy();
        res.json({ message: 'Аккаунт успешно удален' });
    } catch (error) {
        console.error('Ошибка при удалении аккаунта:', error);
        res.sendStatus(500);
    }
}


async function getAccount(req, res) {
    try {
        const userId = req.userId;

        User.findByPk(userId, {
            include: {
                model: Role,
                attributes: ['roleName'],
                through: { attributes: [] },
            },
        })
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ error: 'Пользователь не найден' });
                }

                const userData = {
                    email: user.email,
                    roles: user.roles.map((role) => role.roleName),
                };

                res.json(userData);
            })
            .catch((error) => {
                console.error('Ошибка при получении информации об аккаунте:', error);
                res.sendStatus(500);
            });
    } catch (error) {
        console.error('Ошибка при получении информации об аккаунте:', error);
        res.sendStatus(500);
    }
}

function verifyResetCode(request, response) {
    if (!request.body) return response.sendStatus(400);

    try {
        const { email, resetCode } = request.body;
        if (!email || !resetCode) {
            return response.status(400).json({ error: 'Не указан email или код сброса' });
        }

        User.findOne({ where: { email } })
            .then(async (user) => {
                if (!user) {
                    return response.status(404).json({ error: 'Пользователь с таким email не найден' });
                }

                // Проверка кода сброса пароля
                if (user.resetCode !== resetCode) {
                    return response.status(400).json({ error: 'Неверный код сброса' });
                }

                // Генерация JWT для подтверждения кода
                const token = jwt.sign({ email, resetCode }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

                response.json({ token });
            })
            .catch((error) => {
                console.error('Ошибка при поиске пользователя:', error);
                response.sendStatus(500);
            });
    } catch (error) {
        console.error('Ошибка при проверке кода сброса:', error);
        response.sendStatus(500);
    }
}
async function forgotPassword(request, response) {
    if (!request.body) {
        return response.sendStatus(400);
    }

    try {
        const { email } = request.body;

        if (!email) {
            return response.status(400).json({ error: 'Не указан email' });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return response.status(404).json({ error: 'Пользователь с таким email не найден' });
        }

        // Генерация случайного кода сброса пароля
        const resetCode = generateResetCode();

        // Сохранение кода сброса пароля в базе данных или другом хранилище
        user.resetCode = resetCode;
        await user.save();

        // Отправка кода сброса пароля на электронную почту пользователя
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Сброс пароля',
            text: `Код сброса пароля: ${resetCode}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Ошибка при отправке письма:', error);
                return response.status(500).json({ error: 'Ошибка при отправке письма' });
            }

            console.log('Письмо для сброса пароля отправлено:', info.response);
            response.json({ status: 'OK' });
        });
    } catch (error) {
        console.error('Ошибка при сбросе пароля:', error);
        response.sendStatus(500);
    }
}

function resetPassword(request, response) {
    if (!request.body) return response.sendStatus(400);

    try {
        const { token, newPassword } = request.body;
        if (!token || !newPassword) {
            return response.status(400).json({ error: 'Не указан токен или новый пароль' });
        }

        // Проверка и декодирование JWT
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (error, decoded) => {
            if (error) {
                console.error('Ошибка при декодировании токена:', error);
                return response.status(400).json({ error: 'Неверный токен' });
            }

            const { email, resetCode } = decoded;

            User.findOne({ where: { email } })
                .then(async (user) => {
                    if (!user) {
                        return response.status(404).json({ error: 'Пользователь с таким email не найден' });
                    }

                    // Проверка кода сброса пароля
                    if (user.resetCode !== resetCode) {
                        return response.status(400).json({ error: 'Неверный код сброса' });
                    }

                    // Хеширование нового пароля
                    // Сохранение нового пароля в базе данных или другом хранилище
                    user.password = bcrypt.hashSync(newPassword, 10);
                    user.resetCode = null; // Очистка кода сброса пароля
                    await user.save();

                    response.json({ status: 'OK' });
                })
                .catch((error) => {
                    console.error('Ошибка при поиске пользователя:', error);
                    response.sendStatus(500);
                });
        });
    } catch (error) {
        console.error('Ошибка при сбросе пароля:', error);
        response.sendStatus(500);
    }
}

async function updateUser(request, response) { // TODO: Доработать, и проверить
    try {
        const { name, email } = request.body;
        const userId = request.userId;

        // Найти пользователя по их ID
        const user = await User.findByPk(userId);

        if (!user) {
            return response.status(404).json({ error: 'Пользователь не найден' });
        }

        // Обновление свойств пользователя, если они предоставлены в теле запроса
        if (name) {
            user.name = name;
        }

        if (email) {
            user.email = email;
        }

        await user.save();

        response.json({ status: 'OK', user });
    } catch (error) {
        console.error('Ошибка при обновлении пользователя:', error);
        response.sendStatus(500);
    }
}

async function updateUserRole(request, response) { // TODO: Доработать, и проверить
    try {
        const { userId, roles } = request.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return response.status(404).json({ error: 'Пользователь не найден' });
        }

        const foundRoles = await Role.findAll({
            where: {
                roleName: {
                    [Op.in]: roles,
                },
            },
        });

        await user.setRoles(foundRoles);

        response.json({ status: 'OK', user });
    } catch (error) {
        console.error('Ошибка при обновлении ролей пользователя:', error);
        response.sendStatus(500);
    }
}




module.exports = {
    login,
    register,
    getAccount,
    getUsers,
    deleteOwnAccount,
    deleteOtherAccount,
    verifyResetCode,
    resetPassword,
    forgotPassword,
    updateUser,
    updateUserRole
};
