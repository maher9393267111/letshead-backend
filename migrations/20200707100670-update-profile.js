module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([queryInterface.addColumn('Profiles', 'accountName', {
            type: Sequelize.TEXT,
            defaultValue: false,
            allowNull: false,
        }), queryInterface.addColumn('Profiles', 'accountCode', {
            type: Sequelize.INTEGER,
            defaultValue: false,
            allowNull: false,
        }), queryInterface.addColumn('Profiles', 'accountNumber', {type: Sequelize.INTEGER, defaultValue: false, allowNull: false,}),]);
    },

    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn('Profiles', 'accountName'), queryInterface.removeColumn('Profiles', 'accountCode'), queryInterface.removeColumn('Profiles', 'accountNumber'),]);
    },
};