'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PlanUser extends Model {
        static associate(models) {

             }
    }

    PlanUser.init({
        userID: {
            type: DataTypes.INTEGER, allowNull: false,
        }, planServiceID: {
            type: DataTypes.INTEGER, allowNull: false,
        }, price: {
            type: DataTypes.INTEGER, allowNull: false,
        }, discount: {
            type: DataTypes.INTEGER, allowNull: true,
        }, startedAt: {
            type: DataTypes.DATEONLY, allowNull: false,
        }, expireAt: {
            type: DataTypes.DATEONLY, allowNull: true,
        }, status: {
            type: DataTypes.INTEGER, defaultValue: 0, allowNull: false,
        }, createdAt: {
            type: 'TIMESTAMP', allowNull: false, get() {
                return parseInt(moment(this.getDataValue('createdAt')).format('x'));
            }
        }, deletedAt: {
            type: DataTypes.BOOLEAN, allowNull: true, get() {
                return this.getDataValue("deletedAt") != null;
            },
        },
    }, {
        sequelize, modelName: 'PlanUser', paranoid: true,
    });
    return PlanUser;
};
