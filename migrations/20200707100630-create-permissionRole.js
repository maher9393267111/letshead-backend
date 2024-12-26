'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('PermissionRoles', {


            permissionID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Permissions', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },

            roleID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Roles', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },


        });
    }, down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('PermissionRoles');
    }
};
