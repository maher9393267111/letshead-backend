'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('RoleUsers', {


            userID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Users', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },

            roleID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Roles', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },


        });
    }, down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('RoleUsers');
    }
};
