'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('AddonProducts', {
            id: {
                allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
            },
            productID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Products',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            addonID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Addons',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

            isDefault: {
                type: Sequelize.BOOLEAN,
                defaultValue:false,
                allowNull: false,
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
        await queryInterface.dropTable('AddonProducts');
    }
};
