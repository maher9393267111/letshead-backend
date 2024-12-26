'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
            }, name: {
                type: Sequelize.STRING, allowNull: false,
            },

            username: {
                type: Sequelize.STRING, allowNull: false, unique: true,
            }, password: {
                type: Sequelize.STRING, allowNull: false,
            }, email: {
                type: Sequelize.STRING, allowNull: false, unique: true,
            },
            dialCode: {
                type: Sequelize.STRING, allowNull: false,
            }, accountType: {
                type: Sequelize.INTEGER, defaultValue: 0, allowNull: false,
            }, isActive: {
                type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true,
            }, hasProfile: {
                type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false,
            }, role: {
                type: Sequelize.ENUM("basic", "supervisor", "admin"), defaultValue: 'basic', allowNull: false,
            }, socketID: {
                type: Sequelize.STRING,
            }, onlineDate: {
                type: 'TIMESTAMP', defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), allowNull: false,
            },

            isOnline: {
                type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false
            },

            createdAt: {
                type: 'TIMESTAMP', defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), allowNull: false
            }, updatedAt: {
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
                allowNull: false
            },
            deletedAt: {
                type: Sequelize.DATE, allowNull: true,
            },
        });
    }, down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Users');
    }
};
