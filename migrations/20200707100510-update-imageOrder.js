module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([queryInterface.addColumn('ImageOrders', 'title', {
            type: Sequelize.STRING, allowNull: true,
        }),]);
    },

    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn('ImageOrders', 'title'),]);
    },
};