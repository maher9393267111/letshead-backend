'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('EmailOrders', {
            id: {
                allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
            }, userID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Users', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            }, orderID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Orders', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            }, templateID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'EmailTemplates', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            }, mailTitle: {
                type: Sequelize.STRING, allowNull: false,
            }, mailContent: {
                type: Sequelize.TEXT, allowNull: true,
            }, createdAt: {
                type: 'TIMESTAMP', defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), allowNull: false
            }, updatedAt: {
                type: 'TIMESTAMP', defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), allowNull: false
            }, deletedAt: {
                type: Sequelize.DATE, allowNull: true,
            },

        });
    }, down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('EmailOrders');
    }
};
