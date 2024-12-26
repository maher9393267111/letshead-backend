'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AddonProduct extends Model {
        static associate(models) {
            AddonProduct.belongsTo(models.Product, {foreignKey: 'productID',});
            AddonProduct.belongsTo(models.Addon, {foreignKey: 'addonID',});
        }
    }

    AddonProduct.init({

        productID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        addonID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isDefault: {
            type: DataTypes.BOOLEAN, defaultValue: true
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
        modelName: 'AddonProduct',
    });
    return AddonProduct;
};
