'use strict';
const moment = require("moment");
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Quote extends Model {
        static associate(models) {
            Quote.belongsTo(models.Product, {foreignKey: "productID"});
            Quote.hasMany(models.QuoteQuestion, {foreignKey: 'quoteID',});
        }
    }

    Quote.init({
        uuid: {
            type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false,
        }, productID: {
            type: DataTypes.INTEGER, allowNull: true, defaultValue: null,
        }, productTotalPrice: {
            type: DataTypes.INTEGER, allowNull: false, defaultValue: 0,
        }, subPostcode: {
            type: DataTypes.STRING, allowNull: false
        }, postcodePrice: {
            type: DataTypes.INTEGER, allowNull: false, defaultValue: 0,
        }, status: {
            type: DataTypes.INTEGER, defaultValue: 0, allowNull: false,
        }, name: {
            type: DataTypes.STRING, allowNull: false,
        }, lastName: {
            type: DataTypes.STRING, allowNull: true,
        }, email: {
            type: DataTypes.STRING, allowNull: false,
        }, phoneNumber: {
            type: DataTypes.STRING, allowNull: false,
        }, expiredAt: {
            type: DataTypes.DATE, allowNull: false
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
        sequelize, modelName: 'Quote',paranoid: true,
        hooks: {
            afterDestroy: async (instance, options) => {
                try {
                     instance.getQuoteQuestions().then(models => models.forEach(model => model?.destroy()));
                } catch (e) {
                    console.log(e);
                }
            },
            afterRestore: async (instance, options) => {
                try {
                    instance.getQuoteQuestions({paranoid: false}).then(models => models.forEach(model => model?.restore()));
                } catch (e) {
                    console.log(e);
                }
            },
        },
    });
    return Quote;
};
