'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Coupons', 'productID');
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Coupons');
    }
};
