module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([queryInterface.addColumn('Manufacturers', 'image', {
            type: Sequelize.STRING, allowNull: true,
        },)
        ]);
    },

    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn('Manufacturers', 'image')]);
    },
};