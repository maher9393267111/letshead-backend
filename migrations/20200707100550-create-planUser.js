'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('PlanUsers', {
            id: {
                allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
            }, userID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Users', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },planServiceID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'PlanServices', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            }, price: {
                type: Sequelize.INTEGER, allowNull: false,
            }, discount: {
                type: Sequelize.INTEGER, allowNull: true,
            }, startedAt: {
                type: Sequelize.DATEONLY, allowNull: false,
            }, expireAt: {
                type: Sequelize.DATEONLY, allowNull: true,
            }, status: {
                type: Sequelize.INTEGER, defaultValue: 0, allowNull: false,
            }, createdAt: {
                type: 'TIMESTAMP', defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), allowNull: false
            }, updatedAt: {
                type: 'TIMESTAMP', defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), allowNull: false
            }, deletedAt: {
                type: Sequelize.DATE, allowNull: true,
            },

        });
    }, down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('PlanUsers');
    }
};
