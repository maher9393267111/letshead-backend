'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AssignEngineer extends Model {
        static associate(models) {
            AssignEngineer.belongsTo(models.User, {foreignKey: 'userID',});
            AssignEngineer.belongsTo(models.Order, {foreignKey: 'orderID',});
        }
    }

    AssignEngineer.init({
        orderID: {
            type: DataTypes.INTEGER, allowNull: false,
        }, userID: {
            type: DataTypes.INTEGER, allowNull: false,
        },price: {
            type: DataTypes.INTEGER, defaultValue: 0, allowNull: false,
        },isVerticalFlue: {
            type: DataTypes.BOOLEAN, defaultValue: true,allowNull: false,
        }, engNote: {
            type: DataTypes.TEXT, allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER, defaultValue: 0, allowNull: false,
        },
    }, {
        sequelize, modelName: 'AssignEngineer',
    });
    return AssignEngineer;
};
