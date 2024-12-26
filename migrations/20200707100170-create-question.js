'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Questions', {
            id: {
                allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER,
            }, name: {
                type: Sequelize.STRING, allowNull: false,
            }, orderNum: {
                type: Sequelize.INTEGER, allowNull: false,
            }, isShowHelpText: {
                type: Sequelize.BOOLEAN, defaultValue: false,
            },

            isShowHelpVideo: {
                type: Sequelize.BOOLEAN, defaultValue: false,
            },

            helpText: {
                type: Sequelize.STRING, allowNull: true,
            },

            helpVideo: {
                type: Sequelize.STRING, allowNull: true,
            },

            image: {
                type: Sequelize.STRING, allowNull: true,
            },

            parentID: {
                type: Sequelize.INTEGER, allowNull: false, defaultValue: 0,
            },

            destinationID: {
                type: Sequelize.INTEGER, allowNull: false, defaultValue: 0,
            },
            dependenceType: {
                type: Sequelize.INTEGER, allowNull: false, defaultValue: 0,
            },
            dependenceID: {
                type: Sequelize.INTEGER, allowNull: false, defaultValue: 0,
            },
            optStatus: {
                type: Sequelize.TINYINT, allowNull: false, defaultValue: 0,
            },
            isQuestion: {
                type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true
            }, isActive: {
                type: Sequelize.BOOLEAN, defaultValue: true
            }, createdAt: {
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
        await queryInterface.dropTable('Questions');
    }
};
