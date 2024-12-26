'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('AddressOrders', {
            id: {
                allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
            },

            orderID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Orders', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },

            installLine1: {
                type: Sequelize.STRING, allowNull: false,
            },

            installLine2: {
                type: Sequelize.STRING, allowNull: true,
            },

            installCity: {
                type: Sequelize.STRING, allowNull: false,
            },

            installPostcode: {
                type: Sequelize.STRING, allowNull: false,
            },

            isSameInstall: {
                type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false,
            },

            addressLine1: {
                type: Sequelize.STRING, allowNull: true,
            },

            addressLine2: {
                type: Sequelize.STRING, allowNull: true,
            },

            city: {
                type: Sequelize.STRING, allowNull: true,
            },

            postcode: {
                type: Sequelize.STRING, allowNull: true,
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
        await queryInterface.dropTable('AddressOrders');
    }
};
