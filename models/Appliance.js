'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Appliance extends Model {
        static associate(models) {

        }
    }

    Appliance.init({
        name: {
            type: DataTypes.STRING, allowNull: false,
        }, planUserID: {
            type: DataTypes.INTEGER, allowNull: false,
        }, applianceService: {
            type: DataTypes.TINYINT, allowNull: false,
        }, location: {
            type: DataTypes.STRING,
        }, type: {
            type: DataTypes.STRING,
        }, model: {
            type: DataTypes.STRING,
        }, additional: {
            type: DataTypes.STRING,
        }, warrantyStartedAt: {
            type: DataTypes.DATEONLY, allowNull: false,
        }, warrantyEndedAt: {
            type: DataTypes.DATEONLY, allowNull: false,
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
        sequelize, modelName: 'Appliance', paranoid: true,
    });
    return Appliance;
};
