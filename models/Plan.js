'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Plan extends Model {
        static associate(models) {
            Plan.hasMany(models.Order, {foreignKey: 'planID',});
            Plan.belongsToMany(models.Product, {through: 'ProductPlan', foreignKey: 'planID',});
        }
    }

    Plan.init({
        name: {
            type: DataTypes.STRING, allowNull: false,
        },planUID: {
            type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false,
        },  content: {
            type: DataTypes.TEXT, allowNull: false,
        }, isActive: {
            type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false,
        }, createdAt: {
            type: 'TIMESTAMP', allowNull: false, get() {
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
        sequelize, modelName: 'Plan', paranoid: true,
    });
    return Plan;
};
