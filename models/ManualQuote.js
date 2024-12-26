'use strict';
const moment = require("moment");
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ManualQuote extends Model {
        static associate(models) {

        }
    }

    ManualQuote.init({
        uuid: {
            type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false,
        }, finalTotal: {
            type: DataTypes.INTEGER, allowNull: false, defaultValue: 0,
        }, discountPrice: {
            type: DataTypes.INTEGER, allowNull: false, defaultValue: 0,
        }, tax: {
            type: DataTypes.INTEGER, allowNull: false, defaultValue: 0,
        }, products: {
            type: DataTypes.JSON, allowNull: false,
            get: function () {
                console.log(this.getDataValue('products'))
                return this.getDataValue('products') ? JSON.parse(this.getDataValue('products')) : "";
            },
            set: function (value) {
                return this.setDataValue("products", JSON.stringify(value));
            }
        }, postcode: {
            type: DataTypes.STRING, allowNull: false
        }, firstName: {
            type: DataTypes.STRING, allowNull: false,
        }, lastName: {
            type: DataTypes.STRING, allowNull: true,
        }, email: {
            type: DataTypes.STRING, allowNull: false,
        }, phoneNumber: {
            type: DataTypes.STRING, allowNull: false,
        }, expiredAt: {
            type: DataTypes.DATE, allowNull: false
        },
        status: {
            type: DataTypes.INTEGER, defaultValue: 0,
        },
        createdAt: {
            type: 'TIMESTAMP', allowNull: false, get() {
                return parseInt(moment(this.getDataValue('createdAt')).format('x'));
            }
        }, deletedAt: {
            type: DataTypes.BOOLEAN, allowNull: true, get() {
                return this.getDataValue("deletedAt") != null;
            },
        },
    }, {
        sequelize, modelName: 'ManualQuote', paranoid: true,
    });
    return ManualQuote;
};
