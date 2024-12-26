module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([queryInterface.addColumn('GuestResults', 'additionalPrice', {
            type: Sequelize.JSON, allowNull: true,
        },)
        ]);
    },

    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn('GuestResults', 'additionalPrice')]);
    },
};