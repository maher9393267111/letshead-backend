'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Price extends Model {
        static associate(models) {
            Price.belongsToMany(models.Product, {through: 'PriceProduct', foreignKey: 'priceID',});

        }
    }

    Price.init({
        name: {
            type: DataTypes.STRING, allowNull: false,
        }, parentID: {
            allowNull: false, type: DataTypes.INTEGER,
        }, isMain: {
            type: DataTypes.BOOLEAN, defaultValue: false
        }, isDiscount: {
            type: DataTypes.BOOLEAN, defaultValue: false
        }, isActive: {
            type: DataTypes.BOOLEAN, defaultValue: true
        }, isAdditionalType: {
            type: DataTypes.BOOLEAN, defaultValue: false
        }, slug: {
            type: DataTypes.STRING, unique: true
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
        sequelize, modelName: 'Price', paranoid: true,
    });
    return Price;
};
