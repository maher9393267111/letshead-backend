'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('AddonOrders', {
            id: {
                allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
            },

            orderID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Orders', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },

            addonID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Addons', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },

            price: {
                type: Sequelize.INTEGER, allowNull: false,
            },

            amount: {
                type: Sequelize.INTEGER, allowNull: false,
            },

            total: {
                type: Sequelize.INTEGER, allowNull: false,
            },

            createdAt: {
                type: 'TIMESTAMP', defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), allowNull: false
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
    }, down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('AddonOrders');
    }
};
