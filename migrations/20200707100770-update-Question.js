module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([queryInterface.changeColumn('Questions', 'helpText', {
            type: Sequelize.TEXT, allowNull: true,
        },),]);
    },

    down: (queryInterface) => {
        return Promise.all([queryInterface.changeColumn('Questions', 'helpText')]);
    },
};