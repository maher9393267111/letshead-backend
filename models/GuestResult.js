'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class GuestResult extends Model {
        static associate(models) {

        }
    }

    GuestResult.init({
        resultUID: {
            type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false,
        }, answerIDs: {
            type: DataTypes.STRING, allowNull: false,
        }, sizeIDs: {
            type: DataTypes.STRING, allowNull: false,
        }, postcode: {
            type: DataTypes.STRING, allowNull: true,
        }, expiredAt: {
            type: DataTypes.DATEONLY, allowNull: true
        }, productID: {
            type: DataTypes.INTEGER, allowNull: true
        }, lastPage: {
            type: DataTypes.STRING, allowNull: false
        }, addons: {
            type: DataTypes.JSON, allowNull: true, get: function () {
                const rawValue = this.getDataValue('addons');
                return rawValue ? JSON.parse(rawValue) : [];
            }, set(value) {
                this.setDataValue('addons', JSON.stringify(value));
            },
        }, event: {
            type: DataTypes.JSON, allowNull: true, get: function () {
                const rawValue = this.getDataValue('event');
                return rawValue ? JSON.parse(rawValue) : null;
            }, set(value) {
                this.setDataValue('event', JSON.stringify(value));
            },
        }, address: {
            type: DataTypes.JSON, allowNull: true, get: function () {
                const rawValue = this.getDataValue('address');
                return rawValue ? JSON.parse(rawValue) : null;
            }, set(value) {
                this.setDataValue('address', JSON.stringify(value));
            },
        }, payment: {
            type: DataTypes.JSON, allowNull: true, get: function () {
                const rawValue = this.getDataValue('payment');
                return rawValue ? JSON.parse(rawValue) : null;
            }, set(value) {
                this.setDataValue('payment', JSON.stringify(value));
            },
        }, additionalPrice: {
            type: DataTypes.JSON, allowNull: true, get: function () {
                const rawValue = this.getDataValue('additionalPrice');
                return rawValue ? JSON.parse(rawValue) : null;
            }, set(value) {
                this.setDataValue('additionalPrice', JSON.stringify(value));
            },
        },

    }, {
        sequelize, modelName: 'GuestResult', defaultScope: {
            attributes: {exclude: ['createdAt', 'updatedAt']},
        },
    });

    GuestResult.removeAttribute('id');
    return GuestResult;
};
