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
    },
    employerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
}, {
    tableName: 'job_history' // добавьте это поле, указывающее имя таблицы
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
}, {
    tableName: 'training_direction' // добавьте это поле, указывающее имя таблицы
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
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    trainingDirectionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    profile: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    educationForm: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    graduationYear: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'graduates' // добавьте это поле, указывающее имя таблицы
});

// Определение модели для таблицы "employers"
const Employer = sequelize.define('employers', {
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
    okved: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    inn: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    regionname: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
}, {
    tableName: 'employers' // добавьте это поле, указывающее имя таблицы
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
}, {
    tableName: 'roles' // добавьте это поле, указывающее имя таблицы
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
}, {
    tableName: 'users' // добавьте это поле, указывающее имя таблицы
});

// Определение модели для таблицы "user_roles"
const UserRole = sequelize.define('user_roles', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    roleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
}, {
    tableName: 'user_roles' // добавьте это поле, указывающее имя таблицы
});

// Установка связей между моделями
Graduate.hasMany(JobHistory, { foreignKey: 'graduateId' });
JobHistory.belongsTo(Graduate, { foreignKey: 'graduateId' });

JobHistory.belongsTo(Employer, { foreignKey: 'employerId' });
Employer.hasMany(JobHistory, { foreignKey: 'employerId' });

Graduate.belongsTo(TrainingDirection, { foreignKey: 'trainingDirectionId' });
TrainingDirection.hasMany(Graduate, { foreignKey: 'trainingDirectionId' });

User.belongsToMany(Role, { through: UserRole, foreignKey: 'userId' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'roleId' });

module.exports = {
    JobHistory,
    Graduate,
    Role,
    User,
    UserRole,
    TrainingDirection,
    Employer,
    sequelize
};
