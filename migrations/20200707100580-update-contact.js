module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([queryInterface.addColumn('Contacts', 'enquiryID', {
            type: Sequelize.INTEGER, allowNull: true, references: {
                model: 'Subjects', key: 'id',
            }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
        }), queryInterface.addColumn('Contacts', 'image', {
            type: Sequelize.TEXT, allowNull: true,
        }), queryInterface.addColumn('Contacts', 'note', {
            type: Sequelize.TEXT, allowNull: true,
        }),]);
    },

    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn('Contacts', 'enquiryID'), queryInterface.removeColumn('Contacts', 'image'), queryInterface.removeColumn('Contacts', 'note'),]);
    },
};