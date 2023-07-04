const { JobHistory: JobHistory } = require('./model');

// Функция создания записи о рабочем опыте
async function createJobHistory(request, response) {
    try {
        const jobHistory = await JobHistory.create(request.body);
        response.json(jobHistory);
    } catch (error) {
        console.error('Ошибка при создании записи о рабочем опыте:', error);
        response.status(500).json({ error: 'Ошибка при создании записи о рабочем опыте' });
    }
}

// Функция получения всех записей о рабочем опыте
async function getAllJobHistory(request, response) {
    try {
        const jobHistoryList = await JobHistory.findAll();
        response.json(jobHistoryList);
    } catch (error) {
        console.error('Ошибка при получении записей о рабочем опыте:', error);
        response.status(500).json({ error: 'Ошибка при получении записей о рабочем опыте' });
    }
}

// Функция получения записи о рабочем опыте по идентификатору
async function getJobHistoryById(request, response) {
    try {
        const { id } = request.params;
        const jobHistory = await JobHistory.findByPk(id);

        if (jobHistory) {
            response.json(jobHistory);
        } else {
            response.status(404).json({ error: 'Запись о рабочем опыте не найдена' });
        }
    } catch (error) {
        console.error('Ошибка при получении записи о рабочем опыте:', error);
        response.status(500).json({ error: 'Ошибка при получении записи о рабочем опыте' });
    }
}

// Функция обновления записи о рабочем опыте
async function updateJobHistory(request, response) {
    try {
        const { id } = request.params;
        const jobHistory = await JobHistory.findByPk(id);
        if (jobHistory) {
            const updatedJobHistory = await jobHistory.update(request.body);
            response.json(updatedJobHistory);
        } else {
            response.status(404).json({ error: 'Запись о рабочем опыте не найдена' });
        }
    } catch (error) {
        console.error('Ошибка при обновлении записи о рабочем опыте:', error);
        response.status(500).json({ error: 'Ошибка при обновлении записи о рабочем опыте' });
    }
}

// Функция удаления записи о рабочем опыте
async function deleteJobHistory(request, response) {
    try {
        const { id } = request.params;
        const jobHistory = await JobHistory.findByPk(id);

        if (jobHistory) {
            await jobHistory.destroy();
            response.json({ message: 'Запись о рабочем опыте успешно удалена' });
        } else {
            response.status(404).json({ error: 'Запись о рабочем опыте не найдена' });
        }
    } catch (error) {
        console.error('Ошибка при удалении записи о рабочем опыте:', error);
        response.status(500).json({ error: 'Ошибка при удалении записи о рабочем опыте' });
    }
}

module.exports = {
    createJobHistory,
    getAllJobHistory,
    getJobHistoryById,
    updateJobHistory,
    deleteJobHistory
};
