'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PriceProduct extends Model {
        static associate(models) {
            PriceProduct.belongsTo(models.Product, {foreignKey: 'productID',});
            PriceProduct.belongsTo(models.Price, {foreignKey: 'priceID',});
        }
    }

    PriceProduct.init({

        productID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        priceID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        createdAt: {
            type: 'TIMESTAMP',
            allowNull: false,
            get() {
                return parseInt(moment(this.getDataValue('createdAt')).format('x'));
            }
        }
    }, {
        sequelize, modelName: 'PriceProduct', tableName: "priceProducts",
    });
    return PriceProduct;
};
