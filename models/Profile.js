'use strict';
const moment = require("moment");
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Profile extends Model {
        static associate(models) {
            Profile.hasMany(models.ImageProfile, {foreignKey: "profileID"});
            Profile.hasMany(models.NoteProfile, {foreignKey: 'profileID',});
            Profile.belongsTo(models.User, {foreignKey: "userID"});
            Profile.belongsToMany(models.Skill, {through: 'ProfileSkill', foreignKey: 'profileID',});
            Profile.belongsToMany(models.Postcode, {through: 'PostcodeProfile', foreignKey: 'profileID',});

        }
    }

    Profile.init({
        userID: {
            type: DataTypes.INTEGER, allowNull: false,
        },
        houseNumber: {
            type: DataTypes.STRING, allowNull: true,
        }, image: {
            type: DataTypes.TEXT, allowNull: false
        }, companyName: {
            type: DataTypes.STRING, allowNull: false,
        }, companyGasNumber: {
            type: DataTypes.INTEGER, allowNull: false,
        },

        companyLicenseNumber: {
            type: DataTypes.INTEGER, allowNull: false,
        }, companyAddress1: {
            type: DataTypes.STRING, allowNull: false,
        },

        companyAddress2: {
            type: DataTypes.STRING, allowNull: true,
        },

        companyCity: {
            type: DataTypes.STRING, allowNull: false,
        },

        companyPostcode: {
            type: DataTypes.STRING, allowNull: false,
        }, isLimitedCompany: {
            type: DataTypes.BOOLEAN, defaultValue: true
        }, isVatRegistered: {
            type: DataTypes.BOOLEAN, defaultValue: true
        }, companyNumber: {
            type: DataTypes.INTEGER, allowNull: true,
        }, vatNumber: {
            type: DataTypes.INTEGER, allowNull: true,
        }, isActive: {
            type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false,
        }, accountName: {
            type: DataTypes.STRING, allowNull: false,
        }, accountCode: {
            type: DataTypes.INTEGER, allowNull: false,
        }, accountNumber: {
            type: DataTypes.INTEGER, allowNull: false,
        },
        createdAt: {
            type: 'TIMESTAMP', allowNull: false, get() {
                return parseInt(moment(this.getDataValue('createdAt')).format('x'));
            }
        }, deletedAt: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            get() {
                return this.getDataValue("deletedAt") != null;
            },
        },
    }, {
        sequelize, modelName: 'Profile', paranoid: true,
    });
    return Profile;
};
