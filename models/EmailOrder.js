'use strict';
const moment = require("moment");
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class EmailOrder extends Model {
        static associate(models) {
            EmailOrder.belongsTo(models.Order, {foreignKey: 'orderID'});
            EmailOrder.belongsTo(models.EmailTemplate, {foreignKey: 'templateID'});
            EmailOrder.belongsTo(models.User, {foreignKey: 'userID'});
        }
    }

    EmailOrder.init({
        userID: {
            type: DataTypes.INTEGER, allowNull: false,
        },orderID: {
            type: DataTypes.INTEGER, allowNull: false,
        },
        templateID: {
            type: DataTypes.INTEGER, allowNull: false,
        },
        mailTitle: {
            type: DataTypes.STRING, allowNull: false,
        }, mailContent: {
            type: DataTypes.TEXT, allowNull: true,
        },
        createdAt: {
            type: 'TIMESTAMP', allowNull: false, get() {
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
        sequelize, modelName: 'EmailOrder',  paranoid: true,
    });
    return EmailOrder;
};
