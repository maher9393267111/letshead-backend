'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AvailableWork extends Model {
        static associate(models) {
            AvailableWork.belongsTo(models.User, {foreignKey: 'userID',});
        }
    }

    AvailableWork.init({
        userID: {
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
        sequelize, modelName: 'AvailableWork',
    });
    return AvailableWork;
};
