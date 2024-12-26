'use strict';
const moment = require("moment");
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Service extends Model {
        static associate(models) {
            Service.belongsTo(models.User, {foreignKey: "userID"});
        }
    }

    Service.init({
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        typeID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        categoryID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        note: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        bookingDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },

        priority: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        startTime: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.TIME,
            allowNull: false,
        },

        isActive: {
            type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false,
        },

    }, {
        sequelize, modelName: 'Service',
    });
    return Service;
};
