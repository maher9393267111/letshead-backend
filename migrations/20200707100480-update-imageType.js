module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([ queryInterface.addColumn('ImageTypes', 'isRequired', {
            type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false,
        }),]);
    },

    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn('ImageTypes', 'isRequired'),queryInterface.removeColumn('ImageTypes', 'isRequired'),]);
    },
};