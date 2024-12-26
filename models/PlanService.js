'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PlanService extends Model {
        static associate(models) {

            }
    }

    PlanService.init({
        name: {
            type: DataTypes.STRING, allowNull: false,
        }, price: {
            type: DataTypes.INTEGER, allowNull: false,
        },discount: {
            type: DataTypes.INTEGER, allowNull: true,
        },isActive: {
            type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false,
        },
        createdAt: {
            type: 'TIMESTAMP',
            allowNull: false,
            get() {
                return parseInt(moment(this.getDataValue('createdAt')).format('x'));
            }
        },
        deletedAt: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            get() {
                return this.getDataValue("deletedAt") != null;
            },
        },
    }, {
        sequelize,
        modelName: 'PlanService',
        paranoid: true,
    });
    return PlanService;
};
