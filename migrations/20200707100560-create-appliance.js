'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Appliances', {
            id: {
                allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
            }, name: {
                type: Sequelize.STRING, allowNull: false,
            }, planUserID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'PlanUsers', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            }, applianceService: {
                type: Sequelize.TINYINT, allowNull: false,
            }, location: {
                type: Sequelize.STRING,
            }, type: {
                type: Sequelize.STRING,
            }, model: {
                type: Sequelize.STRING,
            }, additional: {
                type: Sequelize.STRING,
            },

            warrantyStartedAt: {
                type: Sequelize.DATEONLY, allowNull: false,
            }, warrantyEndedAt: {
                type: Sequelize.DATEONLY, allowNull: false,
            }, createdAt: {
                type: 'TIMESTAMP', defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), allowNull: false
            },

            updatedAt: {
                type: 'TIMESTAMP', defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), allowNull: false
            }, deletedAt: {
                type: Sequelize.DATE, allowNull: true,
            },

        });
    }, down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Appliances');
    }
};
