'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Services', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

            typeID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'JobCategories',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

            categoryID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'JobCategories',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            price: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            note: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            bookingDate: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },

            priority: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            startTime: {
                type: Sequelize.TIME,
                allowNull: false,
            },
            endTime: {
                type: Sequelize.TIME,
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
        await queryInterface.dropTable('Services');
    }
};
