'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Size extends Model {
        static associate(models) {
            Size.belongsToMany(models.Product, {through: 'ProductSize', foreignKey: 'sizeID',});

        }
    }

    Size.init({
        name: {
            type: DataTypes.STRING, allowNull: false,
        }, parentID: {
            allowNull: false, type: DataTypes.INTEGER,
        }, type: {
            allowNull: false, type: DataTypes.INTEGER,
        }, value: {
            type: DataTypes.INTEGER, allowNull: false
        }, isActive: {
            type: DataTypes.BOOLEAN, defaultValue: true
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
        sequelize, modelName: 'Size', paranoid: true,
    });
    return Size;
};
