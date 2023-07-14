const {Employer, JobHistory}=require('./model')
const { literal } = require('sequelize');
// Создание нового работодателя
async function createEmployer(request, response) {
    try {
        const employer = await Employer.create(request.body);
        response.json(employer);
    } catch (error) {
        console.error('Ошибка при создании работодателя:', error);
        response.status(500).json({ error: 'Ошибка при создании работодателя' });
    }
}

// Получение информации о работодателе по ID
async function getEmployer(request, response) {
    try {
        const employerId = request.params.id;

        const employer = await Employer.findByPk(employerId);
        if (employer) {
            response.json(employer);
        } else {
            response.status(404).json({ error: 'Работодатель не найден' });
        }
    } catch (error) {
        console.error('Ошибка при получении информации о работодателе:', error);
        response.status(500).json({ error: 'Ошибка при получении информации о работодателе' });
    }
}

// Получение информации о работодателях
async function getEmployers(request, response) {
    try {
        const offset = parseInt(request.query.offset) || 0;
        const limit = 50;

        const employers = await Employer.findAll({
            offset,
            limit: limit + 1,
        });

        const hasNext = employers.length > limit;
        const employersToSend = hasNext ? employers.slice(0, limit) : employers;

        const responseData = {
            employers: employersToSend,
            next: hasNext ? offset + limit : null,
            prev:  offset-limit,
        };

        response.json(responseData);
    } catch (error) {
        console.error('Ошибка при получении информации о работодателях:', error);
        response.status(500).json({ error: 'Ошибка при получении информации о работодателях' });
    }
}

// Обновление информации о работодателе
async function updateEmployer(request, response) {
    try {
        const employer = await Employer.findByPk(request.params.id);
        if (employer) {
            await employer.update(request.body);
            response.json(employer);
        } else {
            response.status(404).json({ error: 'Работодатель не найден' });
        }
    } catch (error) {
        console.error('Ошибка при обновлении информации о работодателе:', error);
        response.status(500).json({ error: 'Ошибка при обновлении информации о работодателе' });
    }
}

// Удаление работодателя
async function deleteEmployer(request, response) {
    try {
        const employerId=request.params.id
        const employer = await Employer.findByPk(employerId);
        if (employer) {
            await JobHistory.destroy({where:{employerId}})
            await employer.destroy();
            response.json({ message: 'Работодатель успешно удален' });
        } else {
            response.status(404).json({ error: 'Работодатель не найден' });
        }
    } catch (error) {
        console.error('Ошибка при удалении работодателя:', error);
        response.status(500).json({ error: 'Ошибка при удалении работодателя' });
    }
}
async function searchEmployers(request, response) {
    try {
        const attribute = request.query.attribute;
        const value = request.query.value;

        const employers = await Employer.findAll({
            where: literal(`"employers"."${attribute}"::text ILIKE '%${value}%'`),
        });

        response.json(employers);
    } catch (error) {
        console.error('Ошибка при поиске работодателей:', error);
        response.status(500).json({ error: 'Ошибка при поиске работодателей' });
    }
}




module.exports={
    createEmployer,
    getEmployer,
    getEmployers,
    updateEmployer,
    deleteEmployer,
    searchEmployers
}