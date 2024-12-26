'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('ProductPlans', {

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
            planID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Plans',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },


        });
    }, down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('ProductPlans');
    }
};
