'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PostcodePrice extends Model {
        static associate(models) {
            PostcodePrice.belongsTo(models.Product, {foreignKey: 'productID',});
            PostcodePrice.belongsTo(models.Postcode, {foreignKey: 'postCodeID',});

        }
    }

    PostcodePrice.init({

        productID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        postCodeID: {
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
        sequelize,
        modelName: 'PostcodePrice',
    });
    return PostcodePrice;
};
