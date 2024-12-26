module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([queryInterface.addColumn('Prices', 'slug', {
            type: Sequelize.STRING, unique: true,
        },), queryInterface.addColumn('Prices', 'isAdditionalType', {
            type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false,
        },),]);
    },

    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn('Prices', 'slug'), queryInterface.removeColumn('isAdditionalType', 'isAdditionalType')]);
    },
};