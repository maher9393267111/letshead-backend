'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Options', {
            key: {
                allowNull: false, primaryKey: true, type: Sequelize.STRING
            }, value: {
                type: Sequelize.TEXT, allowNull: false,
            }, isActive: {
                type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false,
            },

            createdAt: {
                type: 'TIMESTAMP', defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), allowNull: false
            }, updatedAt: {
                type: 'TIMESTAMP', defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), allowNull: false,
            }, deletedAt: {
                type: Sequelize.DATE, allowNull: true,
            },
        });
    }, down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Options');
    }
};
