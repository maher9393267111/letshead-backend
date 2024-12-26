'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Contacts', {
            id: {
                allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
            }, name: {
                type: Sequelize.STRING, allowNull: false,
            },

            phone: {
                type: Sequelize.STRING, allowNull: false,
            },

            email: {
                type: Sequelize.STRING, allowNull: false,
            },

            address: {
                type: Sequelize.STRING,
            }, postcode: {
                type: Sequelize.STRING,
            }, body: {
                type: Sequelize.TEXT,
            }, subjectID: {
                type: Sequelize.INTEGER, allowNull: true, references: {
                    model: 'Subjects', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            }, isActive: {
                type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false,
            }, createdAt: {
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
        await queryInterface.dropTable('Contacts');
    }
};
