'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('PlanServices', {
            id: {
                allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
            }, name: {
                type: Sequelize.STRING, allowNull: false,
            }, price: {
                type: Sequelize.INTEGER, allowNull: false,
            },discount: {
                type: Sequelize.INTEGER, allowNull: true,
            },isActive: {
                type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false,
            }, createdAt: {
                type: 'TIMESTAMP', defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), allowNull: false
            },
            updatedAt: {
                type: 'TIMESTAMP', defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), allowNull: false
            },
            deletedAt: {
                type: Sequelize.DATE, allowNull: true,
            },

        });
    }, down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('PlanServices');
    }
};
