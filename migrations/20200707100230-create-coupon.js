'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Coupons', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            code: {
                type: Sequelize.STRING,
              unique: true,
                allowNull: false,
            },
            value: {
                allowNull: false,
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            expire: {
                type: Sequelize.DATEONLY, allowNull: false,
            },
            productID: {
                type: Sequelize.INTEGER, allowNull: true, references: {
                    model: 'Products', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },
            isPercent: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },

            isActive: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false,
            },

            createdAt: {
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                allowNull: false
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
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Coupons');
    }
};
