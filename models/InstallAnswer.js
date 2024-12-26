'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class InstallAnswer extends Model {
        static associate(models) {
            InstallAnswer.belongsTo(models.Order, {foreignKey: 'orderID',});
            InstallAnswer.belongsTo(models.InstallQuestion, {foreignKey: 'installQuestionID',});
        }
    }

    InstallAnswer.init({
        orderID: {
            type: DataTypes.INTEGER, allowNull: false,
        }, installQuestionID: {
            type: DataTypes.INTEGER, allowNull: false,
        }, multiChoiceAnswer: {
            type: DataTypes.INTEGER, allowNull: false,
        }, shortAnswer: {
            type: DataTypes.INTEGER,
        }, createdAt: {
            type: 'TIMESTAMP', allowNull: false, get() {
                return parseInt(moment(this.getDataValue('createdAt')).format('x'));
            }
        }
    }, {
        sequelize, modelName: 'InstallAnswer',
    });
    return InstallAnswer;
};
