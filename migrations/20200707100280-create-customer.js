'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Customers', {
            id: {
                allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
            }, title: {
                type: Sequelize.INTEGER, allowNull: true,
            },
            userID: {
                type: Sequelize.INTEGER, allowNull: false, unique: true, references: {
                    model: 'Users', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },
            mobile: {
                type: Sequelize.STRING, allowNull: true,
            }, phone: {
                type: Sequelize.STRING, allowNull: true,
            }, addressLine1: {
                type: Sequelize.STRING, allowNull: false,
            },

            addressLine2: {
                type: Sequelize.STRING, allowNull: true,
            },

            city: {
                type: Sequelize.STRING, allowNull: false,
            },
            postcode: {
                type: Sequelize.STRING, allowNull: false,
            },
            installLine1: {
                type: Sequelize.STRING, allowNull: true,
            },

            installLine2: {
                type: Sequelize.STRING, allowNull: true,
            },

            installCity: {
                type: Sequelize.STRING, allowNull: true,
            },

            installPostcode: {
                type: Sequelize.STRING, allowNull: true,
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
        await queryInterface.dropTable('Customers');
    }
};
