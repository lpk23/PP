const {Graduate, TrainingDirection, JobHistory, Employer,Op} = require('./model');
const {literal} = require("sequelize");

// Функция создания нового выпускника
async function createGraduate(request, response) {
    try {
        const graduate = await Graduate.create(request.body);
        response.json(graduate);
    } catch (error) {
        console.error('Ошибка при создании выпускника:', error);
        response.status(500).json({error: 'Ошибка при создании выпускника'});
    }
}


async function getAllGraduates(request, response) {
    let graduates;
    try {
        let offset = 0;
        if (request.query.offset) {
            offset = parseInt(request.query.offset);
        }
        const limit = 100;

        graduates = await Graduate.findAll({
            offset,
            limit: limit + 1, // Запрашиваем на одну запись больше
            include: [
                {
                    model: TrainingDirection,
                    attributes: ['id', 'code', 'name'],
                },
                {
                    model: JobHistory,
                    attributes: ['id', 'jobType', 'startDate', 'endDate', 'employmentBook', 'position', 'selfEmploymentActivity', 'militaryServiceLocation'],
                    include: [Employer]
                },
            ],
            attributes: { exclude: ['trainingDirectionId'] },
        });


        const hasNext = graduates.length > limit;

        if (hasNext) {
            graduates.pop();
        }

        const responseObj = {
            graduates,
        };

        if (hasNext) {
            responseObj.next = offset + limit;
        }
        responseObj.prev = offset-limit;
        response.json(responseObj);
    } catch (error) {
        console.error('Ошибка при получении списка выпускников:', error);
        response.status(500).json({ error: 'Ошибка при получении списка выпускников' });
    }
}


async function getGraduateById(request, response) {
    try {
        let graduate;
        graduate = await Graduate.findByPk(request.params.id, {
                limit: 100,
                include: [
                    {
                        model: TrainingDirection,
                        attributes: ['id', 'code', 'name'],
                    },
                    {
                        model: JobHistory,
                        attributes: ['id', 'jobType', 'startDate', 'endDate', 'employmentBook', 'position', 'selfEmploymentActivity', 'militaryServiceLocation'],
                        include: [Employer]
                    },

                ],
                attributes: {exclude: ['trainingDirectionId']},
            });

        if (graduate) {
            response.json(graduate);
        } else {
            response.status(404).json({error: 'Выпускник не найден'});
        }
    } catch (error) {
        console.error('Ошибка при получении выпускника:', error);
        response.status(500).json({error: 'Ошибка при получении выпускника'});
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
        const graduateId = request.params.id;
        const graduate = await Graduate.findByPk(graduateId);
        if (graduate) {
            await JobHistory.destroy({where: {graduateId}});
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

async function searchGraduates(request, response) {
    try {
        const attribute = request.query.attribute;
        const value = request.query.value;
            const type=request.query.type_s;
        if (type === 'no') {
            query = literal(`"graduates"."${attribute}"::text = '${value}'`);
        } else {
            query = literal(`"graduates"."${attribute}"::text ILIKE '%${value}%'`);
        }
        const graduates = await Graduate.findAll({
            where: query,
            include: [
                {
                    model: TrainingDirection,
                    attributes: ['id', 'code', 'name'],
                },
                {
                    model: JobHistory,
                    attributes: ['id', 'jobType', 'startDate', 'endDate', 'employmentBook', 'position', 'selfEmploymentActivity', 'militaryServiceLocation'],
                    include: [Employer]
                },
            ],
            attributes: { exclude: ['trainingDirectionId'] },
        });

        response.json(graduates);
    } catch (error) {
        console.error('Ошибка при поиске выпускников:', error);
        response.status(500).json({ error: 'Ошибка при поиске выпускников' });
    }
}


module.exports = {
    createGraduate,
    getAllGraduates,
    getGraduateById,
    updateGraduateById,
    deleteGraduateById,
    searchGraduates
}
