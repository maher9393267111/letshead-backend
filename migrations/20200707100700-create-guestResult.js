'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('GuestResults', {
            resultUID: {
                type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false, primaryKey: true
            }, answerIDs: {
                type: Sequelize.STRING, allowNull: false,
            }, sizeIDs: {
                type: Sequelize.STRING, allowNull: false,
            }, postcode: {
                type: Sequelize.STRING, allowNull: true,
            }, productID: {
                type: Sequelize.INTEGER, allowNull: true, references: {
                    model: 'Products', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            }, lastPage: {
                type: Sequelize.STRING, allowNull: true,
            }, addons: {
                type: Sequelize.JSON, allowNull: true,
            }, event: {
                type: Sequelize.JSON, allowNull: true,
            }, address: {
                type: Sequelize.JSON, allowNull: true,
            }, payment: {
                type: Sequelize.JSON, allowNull: true,
            }, expiredAt: {
                type: Sequelize.DATEONLY, allowNull: false, // defaultValue: Sequelize.literal('DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY)'),
            }, createdAt: {
                type: 'TIMESTAMP', defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), allowNull: false
            }, updatedAt: {
                type: 'TIMESTAMP', defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), allowNull: false
            },

        });
    }, down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('GuestResults');
    }
};
