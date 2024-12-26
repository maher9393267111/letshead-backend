module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([queryInterface.changeColumn('Quotes', 'productID', {
            type: Sequelize.INTEGER, allowNull: true, references: {
                model: 'Products', key: 'id',
            }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
        }),

            queryInterface.addColumn('Quotes', 'lastName', {
                type: Sequelize.STRING, allowNull: true,
            }),],);
    },

    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn('Quotes', 'productID'),
            queryInterface.removeColumn('Quotes', 'lastName'),
        ]);
    },
};