module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([ queryInterface.addColumn('Subjects', 'isTypeEnquiry', {
            type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false,
        }),]);
    },

    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn('Subjects', 'isTypeEnquiry'),]);
    },
};