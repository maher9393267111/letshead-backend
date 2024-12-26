'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Users', 'hasProfile');
        await queryInterface.removeColumn('Users', 'socketID');
        await queryInterface.removeColumn('Users', 'isOnline');
        await queryInterface.removeColumn('Users', 'onlineDate');
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Users');
    }
};
