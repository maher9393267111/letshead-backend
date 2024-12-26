module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([ queryInterface.addColumn('Customers', 'isSameInstall', {
            type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false,
        }),]);
    },

    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn('Customers', 'isSameInstall'),]);
    },
};