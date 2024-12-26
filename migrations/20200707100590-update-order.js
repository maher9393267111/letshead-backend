module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([queryInterface.addColumn('Orders', 'planID', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Plans',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        }),]);
    },

    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn('Orders', 'planID')]);
    },
};