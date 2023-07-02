const { Graduate } = require('./model');
const {checkPermissions}=require('./Helpers')
// Функция создания нового выпускника
async function createGraduate(request, response) {
    try {
        const permission = 'ManageGraduates';

        const hasPermission = await checkPermissions(request.headers['authorization'], permission);
        if (hasPermission === 'OK') {
            const graduate = await Graduate.create(request.body);

            response.json(graduate);
        } else {
            response.status(403).json({ error: 'Отсутствуют права доступа' });
        }
    } catch (error) {
        console.error('Ошибка при создании выпускника:', error);
        response.status(500).json({ error: 'Ошибка при создании выпускника' });
    }
}




async function getAllGraduates(request, response) {
    try {
        const permission = ['ViewGraduates', 'ViewGraduateDetails', 'ManageGraduates'];

        let hasPermission;

        // Проверка разрешения 'ManageGraduates'
        hasPermission = await checkPermissions(request.headers['authorization'], permission[2]);
        if (hasPermission === 'OK') {
            let offset = 0;
            if (request.query.offset) {
                offset = parseInt(request.query.offset);
            }

            const graduates = await Graduate.findAll({
                offset,
                limit: 100
            });
            response.json(graduates);
            return;
        }

        // Проверка разрешения 'ViewGraduateDetails'
        hasPermission = await checkPermissions(request.headers['authorization'], permission[1]);
        if (hasPermission === 'OK') {
            let offset = 0;
            if (request.query.offset) {
                offset = parseInt(request.query.offset);
            }

            const graduates = await Graduate.findAll({
                offset,
                limit: 100
            });
            response.json(graduates);
            return;
        }

        // Проверка разрешения 'ViewGraduates'
        hasPermission = await checkPermissions(request.headers['authorization'], permission[0]);
        if (hasPermission === 'OK') {
            let offset = 0;
            if (request.query.offset) {
                offset = parseInt(request.query.offset);
            }

            const graduates = await Graduate.findAll({
                attributes: { exclude: ['email','phone','snils','address'] },
                offset,
                limit: 100
            });
            response.json(graduates);
            return;
        }

        response.status(403).json({ error: 'Отсутствуют права доступа' });
    } catch (error) {
        console.error('Ошибка при получении списка выпускников:', error);
        response.status(500).json({ error: 'Ошибка при получении списка выпускников' });
    }
}

// Функция получения выпускника по идентификатору
async function getGraduateById(request, response) {
    try {
        const permission = ['ViewGraduates', 'ViewGraduateDetails', 'ManageGraduates'];
        const token = request.headers['authorization'];

        let hasPermission = null;

        // Проверка разрешения 'ManageGraduates'
        hasPermission = await checkPermissions(token, permission[2]);
        if (hasPermission === 'OK') {
            const graduate = await Graduate.findByPk(request.params.id);
            if (graduate) {
                response.json(graduate);
                return;
            } else {
                response.status(404).json({ error: 'Выпускник не найден' });
                return;
            }
        }

        // Проверка разрешения 'ViewGraduateDetails'
        hasPermission = await checkPermissions(token, permission[1]);
        if (hasPermission === 'OK') {
            const graduate = await Graduate.findByPk(request.params.id);
            if (graduate) {
                response.json(graduate);
                return;
            } else {
                response.status(404).json({ error: 'Выпускник не найден' });
                return;
            }
        }

        // Проверка разрешения 'ViewGraduates'
        hasPermission = await checkPermissions(token, permission[0]);
        if (hasPermission === 'OK') {
            const graduate = await Graduate.findByPk(request.params.id, {
                attributes: { exclude: ['email', 'phone', 'snils', 'address'] },
            });
            if (graduate) {
                response.json(graduate);
                return;
            } else {
                response.status(404).json({ error: 'Выпускник не найден' });
                return;
            }
        }

        response.status(403).json({ error: 'У вас нет разрешения на доступ к выпускнику' });
    } catch (error) {
        console.error('Ошибка при получении выпускника:', error);
        response.status(500).json({ error: 'Ошибка при получении выпускника' });
    }
}



// Функция обновления данных выпускника по идентификатору
async function updateGraduateById(request, response) {
    try {
        const permission = 'ManageGraduates';

        const hasPermission = await checkPermissions(request.headers['authorization'], permission);
        if (hasPermission === 'OK') {
            const graduate = await Graduate.findByPk(request.params.id);
            if (graduate) {
                await graduate.update(request.body);
                return response.json(graduate);
            } else {
                return response.status(404).json({ error: 'Выпускник не найден' });
            }
        }
        return response.status(403).json({ error: 'У вас нет разрешения на доступ к выпускнику' });
    } catch (error) {
        console.error('Ошибка при обновлении данных выпускника:', error);
        return response.status(500).json({ error: 'Ошибка при обновлении данных выпускника' });
    }
}

async function deleteGraduateById(request, response) {
    try {
        const permission = 'ManageGraduates';

        const hasPermission = await checkPermissions(request.headers['authorization'], permission);
        if (hasPermission === 'OK') {
            const graduate = await Graduate.findByPk(request.params.id);
            if (graduate) {
                await graduate.destroy();
                return response.json(graduate);
            } else {
                return response.status(404).json({ error: 'Выпускник не найден' });
            }
        }
        return response.status(403).json({ error: 'У вас нет разрешения на доступ к выпускнику' });
    } catch (error) {
        console.error('Ошибка при удалении выпускника:', error);
        return response.status(500).json({ error: 'Ошибка при удалении выпускника' });
    }
}


module.exports={
    createGraduate,
    getAllGraduates,
    getGraduateById,
    updateGraduateById,
    deleteGraduateById
}
