'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Users', 'role');
        await queryInterface.removeColumn('Users', 'accountType');
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Users');
    }
};
