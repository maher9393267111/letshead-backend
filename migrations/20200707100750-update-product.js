module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('Products', 'videoUrl', {type: Sequelize.STRING, allowNull: true,},),
            queryInterface.addColumn('Products', 'model', {type: Sequelize.STRING, allowNull: true,},),
            queryInterface.addColumn('Products', 'otherInfoTitle', {type: Sequelize.STRING, allowNull: true,},),
            queryInterface.addColumn('Products', 'otherInfoContent', {type: Sequelize.TEXT, allowNull: true,},),
        ]);
    },

    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn('Products', 'videoUrl'),
            queryInterface.removeColumn('Products', 'model'),
            queryInterface.removeColumn('Products', 'otherInfoTitle'),
            queryInterface.removeColumn('Products', 'otherInfoContent'),
        ]);
    },
};