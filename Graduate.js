const {Graduate,TrainingDirection,JobHistory} = require('./model');

// Функция создания нового выпускника
async function createGraduate(request, response) {
    try {
        // Проверка на пустоту значения fullName
        if (!graduateData.fullName) {
            response.status(400).json({ error: 'Необходимо указать полное имя выпускника' });
            return;
        }
        const graduate = await Graduate.create(request.body);
        response.json(graduate);
    } catch (error) {
        console.error('Ошибка при создании выпускника:', error);
        response.status(500).json({error: 'Ошибка при создании выпускника'});
    }
}


async function getAllGraduates(request, response) {
    try {
        const permission = ['ViewGraduates', 'ViewGraduateDetails', 'ManageGraduates'];
        const passedPermissions = request.passedPermissions; // Получение переданных прав доступа

        let offset = 0;
        if (request.query.offset) {
            offset = parseInt(request.query.offset);
        }

        let graduates;

        if (passedPermissions.includes(permission[2])) {
            // Проверка разрешения 'ManageGraduates'
            graduates = await Graduate.findAll({
                offset,
                limit: 100,
                include: [
                    {
                        model: TrainingDirection,
                        attributes: ['id', 'code', 'name'],
                    },
                    {
                        model: JobHistory,
                        attributes: ['id', 'jobType', 'startDate', 'endDate', 'employmentBook', 'organizationName', 'okved', 'inn', 'registrationRegion', 'position', 'selfEmploymentActivity', 'militaryServiceLocation'],
                    },
                ],
                attributes: { exclude: ['trainingDirectionId'] },
            });
        } else if (passedPermissions.includes(permission[1])) {
            // Проверка разрешения 'ViewGraduateDetails'
            graduates = await Graduate.findAll({ offset, limit: 100 });
        } else if (passedPermissions.includes(permission[0])) {
            // Проверка разрешения 'ViewGraduates'
            graduates = await Graduate.findAll({ attributes: { exclude: ['email', 'phone', 'snils', 'address'] }, offset, limit: 100 });
        } else {
            response.status(403).json({ error: 'Отсутствуют права доступа' });
            return;
        }

        response.json(graduates);
    } catch (error) {
        console.error('Ошибка при получении списка выпускников:', error);
        response.status(500).json({ error: 'Ошибка при получении списка выпускников' });
    }
}

async function getGraduateById(request, response) {
    try {
        const permission = ['ViewGraduates', 'ViewGraduateDetails', 'ManageGraduates'];
        const passedPermissions = request.passedPermissions; // Получение переданных прав доступа

        let graduate;

        if (passedPermissions.includes(permission[2])) {
            // Проверка разрешения 'ManageGraduates'
            graduate = await Graduate.findByPk(request.params.id);
        } else if (passedPermissions.includes(permission[1])) {
            // Проверка разрешения 'ViewGraduateDetails'
            graduate = await Graduate.findByPk(request.params.id);
        } else if (passedPermissions.includes(permission[0])) {
            // Проверка разрешения 'ViewGraduates'
            graduate = await Graduate.findByPk(request.params.id, { attributes: { exclude: ['email', 'phone', 'snils', 'address'] } });
        } else {
            response.status(403).json({ error: 'У вас нет разрешения на доступ к выпускнику' });
            return;
        }

        if (graduate) {
            response.json(graduate);
        } else {
            response.status(404).json({ error: 'Выпускник не найден' });
        }
    } catch (error) {
        console.error('Ошибка при получении выпускника:', error);
        response.status(500).json({ error: 'Ошибка при получении выпускника' });
    }
}



// Функция обновления данных выпускника по идентификатору
async function updateGraduateById(request, response) {
    try {

            const graduate = await Graduate.findByPk(request.params.id);
            if (graduate) {
                await graduate.update(request.body);
                return response.json(graduate);
            } else {
                return response.status(404).json({error: 'Выпускник не найден'});
            }
    } catch (error) {
        console.error('Ошибка при обновлении данных выпускника:', error);
        return response.status(500).json({error: 'Ошибка при обновлении данных выпускника'});
    }
}

async function deleteGraduateById(request, response) {
    try {
            const graduate = await Graduate.findByPk(request.params.id);
            if (graduate) {
                await graduate.destroy();
                return response.json(graduate);
            } else {
                return response.status(404).json({error: 'Выпускник не найден'});
            }
    } catch (error) {
        console.error('Ошибка при удалении выпускника:', error);
        return response.status(500).json({error: 'Ошибка при удалении выпускника'});
    }
}


module.exports = {
    createGraduate,
    getAllGraduates,
    getGraduateById,
    updateGraduateById,
    deleteGraduateById
}
