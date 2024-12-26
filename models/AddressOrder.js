'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AddressOrder extends Model {
        static associate(models) {
            AddressOrder.belongsTo(models.Order, {foreignKey: 'orderID'});

        }
    }

    AddressOrder.init({
        orderID: {
            type: DataTypes.INTEGER, allowNull: false,
        },

        installLine1: {
            type: DataTypes.STRING, allowNull: false,
        },

        installLine2: {
            type: DataTypes.STRING, allowNull: true,
        },

        installCity: {
            type: DataTypes.STRING, allowNull: false,
        },

        installPostcode: {
            type: DataTypes.STRING, allowNull: false,
        },

        isSameInstall: {
            type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true,
        },

        addressLine1: {
            type: DataTypes.STRING, allowNull: true,
        },

        addressLine2: {
            type: DataTypes.STRING, allowNull: true,
        },

        city: {
            type: DataTypes.STRING, allowNull: true,
        },

        postcode: {
            type: DataTypes.STRING, allowNull: true,
        },
        createdAt: {
            type: 'TIMESTAMP',
            allowNull: false,
            get() {
                return parseInt(moment(this.getDataValue('createdAt')).format('x'));
            }
        }
    }, {
        sequelize,
        modelName: 'AddressOrder',
    });
    return AddressOrder;
};
