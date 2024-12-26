'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Coupon extends Model {
        static associate(models) {
            Coupon.belongsToMany(models.Product, {through: 'CouponProduct', foreignKey: 'couponID',});
        }
    }

    Coupon.init({
        code: {
            type: DataTypes.STRING, allowNull: false,
        }, value: {
            allowNull: false, type: DataTypes.INTEGER, defaultValue: 0,
        }, expire: {
            type: DataTypes.DATEONLY, allowNull: false,
        }, isPercent: {
            type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false,
        }, isActive: {
            type: DataTypes.BOOLEAN, defaultValue: true
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
        sequelize, modelName: 'Coupon', paranoid: true,

    });
    return Coupon;
};
