'use strict';
const moment = require("moment");
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Option extends Model {

        static associate(models) {

            }
    }

    Option.init(
      {
        key: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true,
        },
        value: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          allowNull: true,
        },
        createdAt: {
          type: "TIMESTAMP",
          allowNull: false,
          get() {
            return parseInt(moment(this.getDataValue("createdAt")).format("x"));
          },
        },
        deletedAt: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          get() {
              return this.getDataValue("deletedAt") != null;
          },
        },
      },
      {
        sequelize,
        modelName: "Option",
        tableName: "Options",
        paranoid: true,
      }
    );
    return Option;
};
