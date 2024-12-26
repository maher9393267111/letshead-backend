'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AvailableInstallation extends Model {
        static associate(models) {

        }
    }

    AvailableInstallation.init({
        price: {
            allowNull: true,
            type: DataTypes.INTEGER,
        },
        startDate: {
            type: DataTypes.DATEONLY, allowNull: false,
        },
        endDate: {
            type: DataTypes.DATEONLY, allowNull: false,
        },

        isActive: {
            type: DataTypes.BOOLEAN, defaultValue: true
        }, createdAt: {
            type: 'TIMESTAMP', allowNull: false, get() {
                return parseInt(moment(this.getDataValue('createdAt')).format('x'));
            }
        }
    }, {
        sequelize, modelName: 'AvailableInstallation',
    });
    return AvailableInstallation;
};
