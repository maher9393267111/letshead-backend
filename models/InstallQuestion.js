'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class InstallQuestion extends Model {
        static associate(models) {
            InstallQuestion.hasMany(models.InstallAnswer, {foreignKey: 'installQuestionID'});
        }
    }

    InstallQuestion.init({
        name: {
            type: DataTypes.STRING, allowNull: false,
        }, isPreInstall: {
            type: DataTypes.BOOLEAN, defaultValue: true
        }, type: {
            type: DataTypes.INTEGER, allowNull: false,
        }, orderNum: {
            type: DataTypes.INTEGER, allowNull: false,
        }, isActive: {
            type: DataTypes.BOOLEAN, defaultValue: true
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
        sequelize, modelName: 'InstallQuestion', paranoid: true,

    });
    return InstallQuestion;
};
