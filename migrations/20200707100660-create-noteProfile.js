'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('NoteProfiles', {
            id: {
                allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
            }, profileID: {
                type: Sequelize.INTEGER, allowNull: false,references: {
                    model: 'Profiles', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            }, title: {
                type: Sequelize.STRING, allowNull: false,
            }, body: {
                type: Sequelize.TEXT, allowNull: true,
            }, createdAt: {
                type: 'TIMESTAMP', defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), allowNull: false
            },

            updatedAt: {
                type: 'TIMESTAMP', defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), allowNull: false
            },

        });
    }, down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('NoteProfiles');
    }
};
