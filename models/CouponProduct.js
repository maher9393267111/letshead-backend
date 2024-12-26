'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CouponProduct extends Model {
        static associate(models) {
            CouponProduct.belongsTo(models.Product, {foreignKey: 'productID',});
            CouponProduct.belongsTo(models.Coupon, {foreignKey: 'couponID',});
        }
    }

    CouponProduct.init({
        productID: {
            type: DataTypes.INTEGER, allowNull: false,
        }, couponID: {
            type: DataTypes.INTEGER, allowNull: false,
        },
    }, {
        sequelize, modelName: 'CouponProduct', timestamps: false,
    });

    CouponProduct.removeAttribute('id');
    return CouponProduct;
};
