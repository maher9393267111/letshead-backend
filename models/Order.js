'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.hasMany(models.AddonOrder, {foreignKey: 'orderID',});
            Order.hasMany(models.InstallAnswer, {foreignKey: 'orderID',});
            Order.hasMany(models.ImageOrder, {foreignKey: 'orderID',});
            Order.hasMany(models.AssignEngineer, {foreignKey: 'orderID',});
            Order.hasOne(models.AddressOrder, {foreignKey: 'orderID',});
            Order.belongsTo(models.User, {foreignKey: "userID"});
            Order.belongsTo(models.Product, {foreignKey: "productID"});
            Order.belongsTo(models.Plan, {foreignKey: "planID"});
            Order.hasMany(models.OrderQuestion, {foreignKey: 'orderID',});
            Order.hasMany(models.NoteOrder, {foreignKey: 'orderID',});
            Order.hasMany(models.EmailOrder, {foreignKey: 'orderID',});

        }
    }

    Order.init({
        uuid: {
            type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false,
        }, userID: {
            type: DataTypes.INTEGER, allowNull: false,
        }, couponID: {
            type: DataTypes.INTEGER, allowNull: true,
        }, couponPrice: {
            type: DataTypes.INTEGER, allowNull: true,
        }, productID: {
            type: DataTypes.INTEGER, allowNull: false,
        }, productTotalPrice: {
            type: DataTypes.INTEGER, allowNull: false,
        }, total: {
            type: DataTypes.INTEGER, allowNull: false,
        }, subPostcode: {
            type: DataTypes.STRING, allowNull: false
        }, installDate: {
            type: DataTypes.DATEONLY, allowNull: false,
        }, installPrice: {
            type: DataTypes.INTEGER, allowNull: false,
        }, postcodePrice: {
            type: DataTypes.INTEGER, allowNull: false,
        }, discount: {
            type: DataTypes.INTEGER, allowNull: false,
        }, tax: {
            type: DataTypes.INTEGER, allowNull: false,
        }, status: {
            type: DataTypes.INTEGER, defaultValue: 0, allowNull: false,
        }, preQuestionStatus: {
            type: DataTypes.INTEGER, allowNull: true,
        }, postQuestionStatus: {
            type: DataTypes.INTEGER, allowNull: true,
        }, imageEvidenceStatus: {
            type: DataTypes.INTEGER, allowNull: true,
        }, preQuestionCancelReason: {
            type: DataTypes.STRING(1000), allowNull: true,
        }, postQuestionCancelReason: {
            type: DataTypes.STRING(1000), allowNull: true,
        }, imageEvidenceCancelReason: {
            type: DataTypes.STRING(1000), allowNull: true,
        }, type: {
            type: DataTypes.INTEGER, defaultValue: 0, allowNull: false,
        }, note: {
            type: DataTypes.STRING(1000), allowNull: true,
        }, cancelReason: {
            type: DataTypes.STRING(1000), allowNull: true,
        }, imageSubmitStatus: {
            type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0,
        }, planID: {
            type: DataTypes.INTEGER, allowNull: true,
        }, additionalPrice: {
            type: DataTypes.JSON, allowNull: true, get: function () {
                const rawValue = this.getDataValue('additionalPrice');
                return rawValue ? JSON.parse(rawValue) : null;
            }, set(value) {
                this.setDataValue('additionalPrice', JSON.stringify(value));
            },
        },
        createdAt: {
            type: 'TIMESTAMP', allowNull: false, get() {
                return parseInt(moment(this.getDataValue('createdAt')).format('x'));
            }
        }, deletedAt: {
            type: DataTypes.BOOLEAN, allowNull: true, get() {
                return this.getDataValue("deletedAt") != null;
            },
        },
    }, {
        sequelize, modelName: 'Order', paranoid: true,
    });
    return Order;
};
