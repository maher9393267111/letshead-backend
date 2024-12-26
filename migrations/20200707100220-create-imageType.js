'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ImageTypes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      parentID: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue:0,
      },
      orderNum: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      maxAllowed: {
        type: Sequelize.INTEGER, allowNull: false,

      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue:true,
        allowNull: false,
      },

      createdAt: {
          type: 'TIMESTAMP',
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false
      },

        updatedAt: {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            allowNull: false
        },
        deletedAt: {
            type: Sequelize.DATE, allowNull: true,
        },

    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ImageTypes');
  }
};
