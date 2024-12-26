'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('ImageProducts', {

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
            image: {
                type: Sequelize.TEXT,
                allowNull: false,
            },


        });
    }, down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('ImageProducts');
    }
};
