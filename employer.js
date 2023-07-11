const {Employer}=require('./model')
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
        const employer = await Employer.findByPk(request.params.id);
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
        const employer = await Employer.findAll();
        if (employer) {
            response.json(employer);
        } else {
            response.status(404).json({ error: 'Работодатели не найдены' });
        }
    } catch (error) {
        console.error('Ошибка при получении информации о работодателе:', error);
        response.status(500).json({ error: 'Ошибка при получении информации о работодателе' });
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
        const employer = await Employer.findByPk(request.params.id);
        if (employer) {
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

module.exports={
    createEmployer,
    getEmployer,
    getEmployers,
    updateEmployer,
    deleteEmployer
}