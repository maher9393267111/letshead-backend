'use strict';
const moment = require("moment");
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ImageOrder extends Model {
        static associate(models) {
            ImageOrder.belongsTo(models.Order, {foreignKey: 'orderID'});
            ImageOrder.belongsTo(models.ImageType, {foreignKey: 'imageTypeID'});
        }
    }

    ImageOrder.init({
        orderID: {
            type: DataTypes.INTEGER, allowNull: false,
        }, imageTypeID: {
            type: DataTypes.INTEGER, allowNull: false,
        }, image: {
            type: DataTypes.TEXT, allowNull: false,
        },title: {
            type: DataTypes.STRING, allowNull: true,
        },


        createdAt: {
            type: 'TIMESTAMP', allowNull: false, get() {
                return parseInt(moment(this.getDataValue('createdAt')).format('x'));
            }
        }
    }, {
        sequelize, modelName: 'ImageOrder',
    });
    return ImageOrder;
};
