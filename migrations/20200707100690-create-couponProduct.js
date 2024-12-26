'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('CouponProducts', {


            productID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Products', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },

            couponID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Coupons', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },


        });
    }, down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('CouponProducts');
    }
};
