'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('OrderQuestions', {
            id: {
                allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
            },

            orderID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Orders', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },

            questionID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Questions', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            }, answerID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Questions', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
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
        await queryInterface.dropTable('OrderQuestions');
    }
};
