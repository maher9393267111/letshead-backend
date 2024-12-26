'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Customer extends Model {
        static associate(models) {
            Customer.belongsTo(models.User, {foreignKey: "userID"});
        }
    }

    Customer.init({
        title: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        addressLine1: {
            type: DataTypes.STRING, allowNull: false,
        },

        addressLine2: {
            type: DataTypes.STRING, allowNull: true,
        },

        city: {
            type: DataTypes.STRING, allowNull: false,
        },

        postcode: {
            type: DataTypes.STRING, allowNull: false,
        },
        installLine1: {
            type: DataTypes.STRING, allowNull: true,
        },
        installLine2: {
            type: DataTypes.STRING, allowNull: true,
        },

        installCity: {
            type: DataTypes.STRING, allowNull: true,
        },

        installPostcode: {
            type: DataTypes.STRING, allowNull: true,
        },

        isActive: {
            type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false,
        },
        isSameInstall: {
            type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false,
        },
        deletedAt: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            get() {
                return this.getDataValue("deletedAt") != null;
            },
        },

    }, {
        sequelize, modelName: 'Customer',paranoid: true,
    });
    return Customer;
};
