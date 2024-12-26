'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('PostcodeProfiles', {


            profileID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Profiles', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },

            postcodeID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Postcodes', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },

        });
    }, down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('PostcodeProfiles');
    }
};
