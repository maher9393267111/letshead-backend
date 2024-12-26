'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('ImageOrders', {
            id: {
                allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
            }, orderID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Orders', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            }, imageTypeID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'ImageTypes', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            }, image: {
                type: Sequelize.TEXT, allowNull: false,
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
        await queryInterface.dropTable('ImageOrders');
    }
};
