module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([queryInterface.addColumn('Orders', 'uuid', {
            type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false,
        }), queryInterface.addColumn('Orders', 'imageSubmitStatus', {
            type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false,
        }),]);
    },

    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn('Orders', 'uuid'),queryInterface.removeColumn('Orders', 'imageSubmitStatus'),]);
    },
};