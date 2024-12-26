'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Contact extends Model {
        static associate(models) {

        }
    }

    Contact.init({
        name: {
            type: DataTypes.STRING, allowNull: false,
        },

        phone: {
            type: DataTypes.STRING, allowNull: false,
        },

        email: {
            type: DataTypes.STRING, allowNull: false,
        },

        address: {
            type: DataTypes.STRING,
        }, postcode: {
            type: DataTypes.STRING,
        }, body: {
            type: DataTypes.TEXT,
        }, subjectID: {
            type: DataTypes.INTEGER, allowNull: true
        },enquiryID: {
            type: DataTypes.INTEGER, allowNull: true
        },image: {
            type: DataTypes.TEXT, allowNull: true
        },note: {
            type: DataTypes.TEXT, allowNull: true
        },

        isActive: {
            type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false,
        }, createdAt: {
            type: 'TIMESTAMP', allowNull: false, get() {
                return parseInt(moment(this.getDataValue('createdAt')).format('x'));
            }
        },deletedAt: {
            type: DataTypes.BOOLEAN, allowNull: true, get() {
                return this.getDataValue("deletedAt") != null;
            },
        },
    }, {
        sequelize, modelName: 'Contact',paranoid: true,
    });
    return Contact;
};
