'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {
            Category.hasMany(models.Addon, {foreignKey: 'categoryID'});
        }
    }

    Category.init({
        name: {
            type: DataTypes.STRING, allowNull: false,
        }, isActive: {
            type: DataTypes.BOOLEAN, defaultValue: true
        }, isDynamicSelect: {
            type: DataTypes.BOOLEAN, defaultValue: true
        }, orderAt: {
            type: DataTypes.INTEGER, allowNull: true,
        }, createdAt: {
            type: 'TIMESTAMP', allowNull: false, get() {
                return parseInt(moment(this.getDataValue('createdAt')).format('x'));
            }
        }, deletedAt: {
            type: DataTypes.BOOLEAN, allowNull: true, get() {
                return this.getDataValue("deletedAt") != null;
            },
        },
    }, {
        sequelize,
        modelName: 'Category',
        paranoid: true,
    });
    return Category;
};
