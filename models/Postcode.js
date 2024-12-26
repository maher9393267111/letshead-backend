'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Postcode extends Model {
        static associate(models) {
            Postcode.belongsTo(models.City, {foreignKey: 'cityID',});
            Postcode.belongsToMany(models.Profile, {through: 'PostcodeProfile', foreignKey: 'postcodeID',});

        }
    }

    Postcode.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cityID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        type: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        }
    }, {
        sequelize,
        modelName: 'Postcode',
        paranoid: true,
    });
    return Postcode;
};
