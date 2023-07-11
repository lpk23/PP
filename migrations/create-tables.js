'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('roles', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            roleName: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
        // Добавление значений в таблицу roles
        const rolesData = [
            {
                roleName: 'ViewGraduates',
            },
            {
                roleName: 'ViewGraduateDetails',
            },
            {
                roleName: 'ManageGraduates',
            },
            {
                roleName: 'ExportToPDF',
            },
            {
                roleName: 'ImportData',
            },
            {
                roleName: 'DeleteOwnAccount',
            },
            {
                roleName: 'ManageOtherAccounts',
            },
            {
                roleName: 'ManageTrainingDirection'
            },
            {
                roleName: 'ManageJobHistory'
            },
            {
                roleName: 'ManageEmployers'
            }
        ];

        await queryInterface.bulkInsert('roles', rolesData, {});
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            resetCode: {
                type: Sequelize.STRING(6),
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
        await queryInterface.createTable('training_direction', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            code: {
                type: Sequelize.STRING(10),
                allowNull: true,
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
        await queryInterface.createTable('graduates', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            fullName: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            dateOfBirth: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            gender: {
                type: Sequelize.STRING(10),
                allowNull: true,
            },
            citizenship: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },
            address: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            phone: {
                type: Sequelize.STRING(20),
                allowNull: true,
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            snils: {
                type: Sequelize.BIGINT(20),
                allowNull: true,
            },
            trainingDirectionId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'training_direction',
                    key: 'id',
                },
            },
            profile: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            educationForm: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },
            graduationYear: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.createTable('employers', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            okved: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            inn: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            regionname: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.createTable('job_history', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            graduateId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'graduates',
                    key: 'id',
                },
            },
            employerId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'employers',
                    key: 'id',
                },
            },
            jobType: {
                type: Sequelize.STRING(50),
                allowNull: true,
                defaultValue: 'безработный',
            },
            startDate: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            endDate: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            employmentBook: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            position: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            selfEmploymentActivity: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            militaryServiceLocation: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
        await queryInterface.createTable('user_roles', {
            userId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            roleId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                references: {
                    model: 'roles',
                    key: 'id',
                },
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('user_roles');
        await queryInterface.dropTable('job_history');
        await queryInterface.dropTable('graduates');
        await queryInterface.dropTable('employers');
        await queryInterface.dropTable('training_direction');
        await queryInterface.dropTable('users');
        await queryInterface.dropTable('roles');
    },
};
