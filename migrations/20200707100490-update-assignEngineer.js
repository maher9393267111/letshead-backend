module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([queryInterface.addColumn('AssignEngineers', 'price', {
            type: Sequelize.INTEGER, defaultValue: 0, allowNull: false,
        }), queryInterface.addColumn('AssignEngineers', 'isVerticalFlue', {
            type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false,
        }),]);
    },

    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn('AssignEngineers', 'price'), queryInterface.removeColumn('AssignEngineers', 'isVerticalFlue'),]);
    },
};