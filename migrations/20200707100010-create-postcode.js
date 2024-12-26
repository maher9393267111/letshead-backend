'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Postcodes', {
            id: {
                allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
            }, name: {
                type: Sequelize.STRING, allowNull: false, unique: true,
            },
            cityID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Cities',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            type: {
                type: Sequelize.INTEGER, allowNull: false, defaultValue: 0,
            },
            isActive: {
                type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false,
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
        await queryInterface.dropTable('Postcodes');
    }
};
