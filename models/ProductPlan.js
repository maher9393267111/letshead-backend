'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProductPlan extends Model {
        static associate(models) {
            ProductPlan.belongsTo(models.Product, {foreignKey: 'productID',});
            ProductPlan.belongsTo(models.Plan, {foreignKey: 'planID',});
        }
    }

    ProductPlan.init({

        productID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        planID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

    }, {
        sequelize,
        modelName: 'ProductPlan', timestamps: false,
    });
    ProductPlan.removeAttribute('id');
    return ProductPlan;
};
