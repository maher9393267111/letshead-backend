'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Manufacturer extends Model {
        static associate(models) {
            Manufacturer.hasMany(models.Product, {foreignKey: 'manufacturerID'});
        }
    }

    Manufacturer.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isForAddon: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }, image: {
            type: DataTypes.STRING,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        createdAt: {
            type: 'TIMESTAMP',
            allowNull: false,
            get() {
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
        sequelize,
        modelName: 'Manufacturer',
        paranoid: true,
    });
    return Manufacturer;
};
