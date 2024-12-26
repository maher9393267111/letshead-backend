'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('AvailableWorks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            userID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Users', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },
            startDate: {
                type: Sequelize.DATEONLY, allowNull: false,
            },
            endDate: {
                type: Sequelize.DATEONLY, allowNull: false,
            },

            isActive: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false,
            },

            createdAt: {
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                allowNull: false
            },

            updatedAt: {
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
                allowNull: false
            },
            deletedAt: {
                type: Sequelize.DATE, allowNull: true,
            },

        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('AvailableWorks');
    }
};
