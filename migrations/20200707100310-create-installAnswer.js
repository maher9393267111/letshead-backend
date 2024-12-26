'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('InstallAnswers', {
            id: {
                allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
            }, orderID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Orders', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            }, installQuestionID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'InstallQuestions', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            }, multiChoiceAnswer: {
                type: Sequelize.INTEGER, allowNull: false, defaultValue: 0,
            }, shortAnswer: {
                type: Sequelize.TEXT, allowNull: true,
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
        await queryInterface.dropTable('InstallAnswers');
    }
};
