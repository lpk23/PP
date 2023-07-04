const { TrainingDirection } = require('./model');

// Функция создания нового направления обучения
async function createTrainingDirection(request, response) {
    try {
        const { code, name } = request.body;

        const existingTrainingDirection = await TrainingDirection.findOne({
            where: { code, name }
        });

        if (existingTrainingDirection) {
            return response.status(400).json({ error: 'Запись уже существует' });
        }

        const trainingDirection = await TrainingDirection.create({ code, name });
        response.json(trainingDirection);
    } catch (error) {
        console.error('Ошибка при создании направления обучения:', error);
        response.status(500).json({ error: 'Ошибка при создании направления обучения' });
    }
}


// Функция получения всех направлений обучения
async function getAllTrainingDirections(request, response) {
    try {
        const trainingDirections = await TrainingDirection.findAll();
        response.json(trainingDirections);
    } catch (error) {
        console.error('Ошибка при получении направлений обучения:', error);
        response.status(500).json({ error: 'Ошибка при получении направлений обучения' });
    }
}

// Функция получения одного направления обучения по идентификатору
async function getTrainingDirectionById(request, response) {
    try {
        const { id } = request.params;
        const trainingDirection = await TrainingDirection.findByPk(id);

        if (trainingDirection) {
            response.json(trainingDirection);
        } else {
            response.status(404).json({ error: 'Направление обучения не найдено' });
        }
    } catch (error) {
        console.error('Ошибка при получении направления обучения:', error);
        response.status(500).json({ error: 'Ошибка при получении направления обучения' });
    }
}

// Функция обновления направления обучения
async function updateTrainingDirection(request, response) {
    try {
        const { id } = request.params;
        const updatedTrainingDirection = await TrainingDirection.update(request.body, {
            where: { id },
        });
        response.json(updatedTrainingDirection);
    } catch (error) {
        console.error('Ошибка при обновлении направления обучения:', error);
        response.status(500).json({ error: 'Ошибка при обновлении направления обучения' });
    }
}

// Функция удаления направления обучения
async function deleteTrainingDirection(request, response) {
    try {
        const { id } = request.params;
        await TrainingDirection.destroy({ where: { id } });
        response.json({ message: 'Направление обучения успешно удалено' });
    } catch (error) {
        console.error('Ошибка при удалении направления обучения:', error);
        response.status(500).json({ error: 'Ошибка при удалении направления обучения' });
    }
}

module.exports = {
    createTrainingDirection,
    getAllTrainingDirections,
    getTrainingDirectionById,
    updateTrainingDirection,
    deleteTrainingDirection,
};
