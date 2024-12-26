'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('ProfileSkills', {


            profileID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Profiles', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },

            skillID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Skills', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },


        });
    }, down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('ProfileSkills');
    }
};
