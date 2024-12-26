'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class BoilerType extends Model {
        static associate(models) {
            BoilerType.hasMany(models.Product, {foreignKey: 'boilerTypeID'});
        }
    }

    BoilerType.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        parentID: {
            allowNull: false,
            type: DataTypes.INTEGER,
            defaultValue: 0,
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
        modelName: 'BoilerType',
        paranoid: true,
    });
    return BoilerType;
};
