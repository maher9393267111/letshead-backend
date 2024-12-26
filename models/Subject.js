'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Subject extends Model {
        static associate(models) {

        }
    }

    Subject.init({
        name: {
            type: DataTypes.STRING, allowNull: false,
        },
        isTypeEnquiry: {
            type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false,
        },  isActive: {
            type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false,
        }, createdAt: {
            type: 'TIMESTAMP', allowNull: false, get() {
                return parseInt(moment(this.getDataValue('createdAt')).format('x'));
            }
        }, deletedAt: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            get() {
                return this.getDataValue("deletedAt") != null;
            },
        },
    }, {
        sequelize, modelName: 'Subject',paranoid: true,
    });
    return Subject;
};
