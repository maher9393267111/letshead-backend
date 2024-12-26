'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            Product.belongsToMany(models.Postcode, {through: 'PostCodePrice', foreignKey: 'productID',});
            Product.belongsToMany(models.Addon, {through: 'AddonProduct', foreignKey: 'productID',});
            Product.hasMany(models.Order, {foreignKey: 'productID',});
            Product.hasMany(models.Quote, {foreignKey: 'productID',});
            Product.belongsTo(models.BoilerType, {foreignKey: 'boilerTypeID',});
            Product.belongsTo(models.Manufacturer, {foreignKey: 'manufacturerID',});
            Product.belongsToMany(models.Size, {through: 'ProductSize', foreignKey: 'productID',});
            Product.belongsToMany(models.Price, {through: 'PriceProduct', foreignKey: 'productID',});
            Product.belongsToMany(models.Plan, {through: 'ProductPlan', foreignKey: 'productID',});
            Product.belongsToMany(models.Coupon, {through: 'CouponProduct', foreignKey: 'productID',});
        }
    }

    Product.init({
        name: {
            type: DataTypes.STRING, allowNull: false,
        }, manufacturerID: {
            type: DataTypes.INTEGER, allowNull: false
        },

        fuelTypeID: {
            type: DataTypes.INTEGER, allowNull: false
        },

        boilerTypeID: {
            type: DataTypes.INTEGER, allowNull: false
        },

        code: {
            type: DataTypes.STRING,
        }, wattage: {
            type: DataTypes.INTEGER,
        }, warranty: {
            type: DataTypes.INTEGER,
        }, image: {
            type: DataTypes.TEXT,
        }, warrantyImage: {
            type: DataTypes.TEXT,
        },

        isActive: {
            type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false,
        },

        isRecommend: {
            type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false,
        }, subtitle: {
            type: DataTypes.STRING,
        }, description: {
            type: DataTypes.TEXT,
        }, efficiencyRating: {
            type: DataTypes.STRING,
        }, dimension: {
            type: DataTypes.STRING,
        }, flowRate: {
            type: DataTypes.FLOAT,
        }, opt1: {
            type: DataTypes.STRING,
        }, opt2: {
            type: DataTypes.STRING,
        }, model: {
            type: DataTypes.STRING,
        }, otherInfoTitle: {
            type: DataTypes.STRING,
        }, otherInfoContent: {
            type: DataTypes.TEXT,
        }, videoUrl: {
            type: DataTypes.STRING,
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
        sequelize, modelName: 'Product', paranoid: true, defaultScope: {
            attributes: {exclude: ["manufacturerID", "fuelTypeID", "boilerTypeID", "code", "wattage", "warranty", "image", "warrantyImage", "isActive", "isRecommend", "subtitle", "description", "efficiencyRating", "dimension", "flowRate", "createdAt", "updatedAt"]},
        }, scopes: {
            withAllFields: {
                attributes: {}
            },

        }
    });
    return Product;
};
