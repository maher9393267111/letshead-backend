'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Profiles', {
            id: {
                allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER,
            }, userID: {
                type: Sequelize.INTEGER, allowNull: false, unique: true, references: {
                    model: 'Users', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            }, houseNumber: {
                type: Sequelize.STRING, allowNull: true,
            }, image: {
                type: Sequelize.TEXT, allowNull: false
            }, companyName: {
                type: Sequelize.STRING, allowNull: false,
            }, companyGasNumber: {
                type: Sequelize.INTEGER, allowNull: false,
            },

            companyLicenseNumber: {
                type: Sequelize.INTEGER, allowNull: false,
            }, companyAddress1: {
                type: Sequelize.STRING, allowNull: false,
            },

            companyAddress2: {
                type: Sequelize.STRING, allowNull: true,
            },

            companyCity: {
                type: Sequelize.STRING, allowNull: false,
            },

            companyPostcode: {
                type: Sequelize.STRING, allowNull: false,
            }, isLimitedCompany: {
                type: Sequelize.BOOLEAN, defaultValue: true
            }, isVatRegistered: {
                type: Sequelize.BOOLEAN, defaultValue: true
            }, companyNumber: {
                type: Sequelize.INTEGER, allowNull: true,
            }, vatNumber: {
                type: Sequelize.INTEGER, allowNull: true,
            }, isActive: {
                type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false,
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
        await queryInterface.dropTable('Profiles');
    }
};
