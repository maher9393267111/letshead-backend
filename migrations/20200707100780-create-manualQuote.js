'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('manualQuotes', {
            id: {
                allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
            }, uuid: {
                type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false,
            }, finalTotal: {
                type: Sequelize.INTEGER, allowNull: false, defaultValue: 0,
            }, discountPrice: {
                type: Sequelize.INTEGER, allowNull: false, defaultValue: 0,
            }, tax: {
                type: Sequelize.INTEGER, allowNull: false, defaultValue: 0,
            }, products: {
                type: Sequelize.JSON, allowNull: false,
            }, postcode: {
                type: Sequelize.STRING, allowNull: false
            }, firstName: {
                type: Sequelize.STRING, allowNull: false,
            }, lastName: {
                type: Sequelize.STRING, allowNull: true,
            }, email: {
                type: Sequelize.STRING, allowNull: false,
            }, phoneNumber: {
                type: Sequelize.STRING, allowNull: false,
            }, expiredAt: {
                type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), allowNull: false
            }, status: {
                type: Sequelize.INTEGER, defaultValue: 0,
            }, createdAt: {
                type: 'TIMESTAMP', defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), allowNull: false
            }, updatedAt: {
                type: 'TIMESTAMP', defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), allowNull: false
            }, deletedAt: {
                type: Sequelize.DATE, allowNull: true,
            },
        });
    }, down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('manualQuotes');
    }
};
