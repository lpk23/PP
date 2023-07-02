const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Создание подключения к базе данных
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
});

// Определение модели для таблицы "job_history"
const JobHistory = sequelize.define('job_history', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    graduateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'graduates',
            key: 'id',
        },
    },
    jobType: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'безработный',
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    employmentBook: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    organizationName: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    okved: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    inn: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    registrationRegion: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    position: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    selfEmploymentActivity: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    militaryServiceLocation: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
});

// Определение модели для таблицы "training_direction"
const TrainingDirection = sequelize.define('training_direction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    code: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
});

// Определение модели для таблицы "graduates"
const Graduate = sequelize.define('graduates', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    fullName: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    gender: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    citizenship: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    snils: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    trainingDirectionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'training_direction',
            key: 'id',
        },
    },
    educationForm: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    graduationYear: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});

// Определение модели для таблицы "roles"
const Role = sequelize.define('roles', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    roleName: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
});

// Определение модели для таблицы "users"
const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    resetCode: {
        type: DataTypes.STRING(6), // Длина кода сброса пароля
        allowNull: true,
    },
});



// Определение модели для таблицы "user_roles"
const UserRole = sequelize.define('user_roles', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    roleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'roles',
            key: 'id',
        },
    },
});

// Установка связей между моделями
Graduate.hasMany(JobHistory, { foreignKey: 'graduateId' });
JobHistory.belongsTo(Graduate, { foreignKey: 'graduateId' });

Graduate.belongsTo(TrainingDirection, { foreignKey: 'trainingDirectionId' });
TrainingDirection.hasMany(Graduate, { foreignKey: 'trainingDirectionId' });

User.belongsToMany(Role, { through: UserRole, foreignKey: 'userId' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'roleId' });

/*// Синхронизация моделей с базой данных
sequelize.sync()
    .then(() => {
        console.log('Модели синхронизированы с базой данных.');
    })
    .catch((error) => {
        console.error('Ошибка при синхронизации моделей:', error);
    });*/

module.exports = {
    JobHistory,
    Graduate,
    Role,
    User,
    UserRole,
    TrainingDirection,
};
