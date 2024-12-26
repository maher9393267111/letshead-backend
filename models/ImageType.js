'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ImageType extends Model {
        static associate(models) {
            ImageType.hasMany(models.ImageOrder, {foreignKey: 'imageTypeID'});
        }
    }

    ImageType.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        parentID: {
            allowNull: false,
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        orderNum: {
            type: DataTypes.INTEGER, allowNull: false,
        },
        maxAllowed: {
            type: DataTypes.INTEGER, allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        isRequired: {
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
        modelName: 'ImageType',
        paranoid: true,
    });
    return ImageType;
};
