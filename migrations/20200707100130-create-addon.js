'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Addons', {
            id: {
                allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
            }, name: {
                type: Sequelize.STRING, allowNull: false,
            }, manufacturerID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Manufacturers', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },

            categoryID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Categories', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },

            price: {
                type: Sequelize.INTEGER, allowNull: false,
            }, isActiveDiscount: {
                type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false,
            }, discount: {
                type: Sequelize.INTEGER, allowNull: false,
            }, code: {
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

            isActiveQuantity: {
                type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false,
            },

            subtitle: {
                type: Sequelize.STRING,
            }, description: {
                type: Sequelize.TEXT,
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
        await queryInterface.dropTable('Addons');
    }
};
