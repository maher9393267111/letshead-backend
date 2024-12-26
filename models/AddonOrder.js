'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AddonOrder extends Model {
        static associate(models) {
            AddonOrder.belongsTo(models.Order, {foreignKey: 'orderID'});
            AddonOrder.belongsTo(models.Addon, {foreignKey: 'addonID'});
        }
    }

    AddonOrder.init({
        orderID: {
            type: DataTypes.INTEGER, allowNull: false,
        },

        addonID: {
            type: DataTypes.INTEGER, allowNull: false,
        },

        price: {
            type: DataTypes.INTEGER, allowNull: false,
        },

        amount: {
            type: DataTypes.INTEGER, allowNull: false,
        },

        total: {
            type: DataTypes.INTEGER, allowNull: false,
        },

        createdAt: {
            type: 'TIMESTAMP',
            allowNull: false,
            get() {
                return parseInt(moment(this.getDataValue('createdAt')).format('x'));
            }
        }
    }, {
        sequelize,
        modelName: 'AddonOrder',
    });
    return AddonOrder;
};
