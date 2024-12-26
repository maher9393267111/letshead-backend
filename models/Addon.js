'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Addon extends Model {
        static associate(models) {
            Addon.belongsTo(models.Category, {foreignKey: 'categoryID',});
            Addon.belongsToMany(models.Product, {through: 'AddonProduct', foreignKey: 'addonID',});
        }
    }

    Addon.init({
        name: {
            type: DataTypes.STRING, allowNull: false,
        }, manufacturerID: {
            type: DataTypes.INTEGER, allowNull: false
        }, categoryID: {
            type: DataTypes.INTEGER, allowNull: false
        },


        price: {
            type: DataTypes.INTEGER, allowNull: false,
        }, isActiveDiscount: {
            type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false,
        }, discount: {
            type: DataTypes.INTEGER, allowNull: false,
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

        isActiveQuantity: {
            type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false,
        },

        subtitle: {
            type: DataTypes.STRING,
        }, description: {
            type: DataTypes.TEXT,
        }, createdAt: {
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
        sequelize, modelName: 'Addon', paranoid: true,
        // hooks: {
        //     afterDestroy: async (instance, options) => {
        //         try {
        //             instance.getProducts().then(models => models.forEach(model => model?.destroy()));
        //         } catch (e) {
        //             console.log(e);
        //         }
        //     },
        //     afterRestore: async (instance, options) => {
        //         try {
        //             instance.getProducts({paranoid: false}).then(models => models.forEach(model => model?.restore()));
        //         } catch (e) {
        //             console.log(e);
        //         }
        //     },
        // },
    });
    return Addon;
};
