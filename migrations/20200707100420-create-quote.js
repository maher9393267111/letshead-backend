'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Quotes', {
            id: {
                allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
            },
            uuid: {
                type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false,
            },
            productID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Products', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            }, productTotalPrice: {
                type: Sequelize.INTEGER, allowNull: false, defaultValue: 0,
            }, subPostcode: {
                type: Sequelize.STRING, allowNull: false
            }, postcodePrice: {
                type: Sequelize.INTEGER, allowNull: false, defaultValue: 0,
            }, status: {
                type: Sequelize.INTEGER, defaultValue: 0, allowNull: false,
            }, name: {
                type: Sequelize.STRING, allowNull: false,
            }, email: {
                type: Sequelize.STRING, allowNull: false,
            }, phoneNumber: {
                type: Sequelize.STRING, allowNull: false,
            }, expiredAt: {
                type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), allowNull: false
            }, createdAt: {
                type: 'TIMESTAMP', defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), allowNull: false
            }, updatedAt: {
                type: 'TIMESTAMP', defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), allowNull: false
            },
            deletedAt: {
                type: Sequelize.DATE, allowNull: true,
            },
        });
    }, down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Quotes');
    }
};
