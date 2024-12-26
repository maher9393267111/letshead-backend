'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProductSize extends Model {
        static associate(models) {
            ProductSize.belongsTo(models.Product, {foreignKey: 'productID',});
            ProductSize.belongsTo(models.Size, {foreignKey: 'sizeID',});

        }
    }

    ProductSize.init({

        productID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        sizeID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

    }, {
        sequelize,
        modelName: 'ProductSize', timestamps: false,
    });
    return ProductSize;
};
