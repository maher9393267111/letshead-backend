'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ImageProduct extends Model {
        static associate(models) {
            ImageProduct.belongsTo(models.Product, {foreignKey: 'productID',});
        }
    }

    ImageProduct.init({
        productID: {
            type: DataTypes.INTEGER, allowNull: false,
        }, image: {
            type: DataTypes.TEXT, allowNull: false,
        },
    }, {
        sequelize, modelName: 'ImageProduct', timestamps: false,
    });

    ImageProduct.removeAttribute('id');
    return ImageProduct;
};
