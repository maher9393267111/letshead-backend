'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Products', {
            id: {
                allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
            }, name: {
                type: Sequelize.STRING, allowNull: false,
            }, manufacturerID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Manufacturers', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },

            fuelTypeID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'FuelTypes', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },

            boilerTypeID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'BoilerTypes', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },

            code: {
                type: Sequelize.STRING,
            }, wattage: {
                type: Sequelize.INTEGER,
            }, warranty: {
                type: Sequelize.INTEGER,
            }, image: {
                type: Sequelize.TEXT,
            }, warrantyImage: {
                type: Sequelize.TEXT,
            },

            isActive: {
                type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false,
            },

            isRecommend: {
                type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false,
            }, subtitle: {
                type: Sequelize.STRING,
            }, description: {
                type: Sequelize.TEXT,
            }, efficiencyRating: {
                type: Sequelize.STRING,
            }, dimension: {
                type: Sequelize.STRING,
            }, flowRate: {
                type: Sequelize.FLOAT,
            }, opt1: {
                type: Sequelize.STRING,
            }, opt2: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable('Products');
    }
};
