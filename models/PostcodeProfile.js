'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PostcodeProfile extends Model {
        static associate(models) {
            PostcodeProfile.belongsToMany(models.Profile, {through: 'PostcodeProfile', foreignKey: 'profileID'});
            PostcodeProfile.belongsToMany(models.Postcode, {through: 'PostcodeProfile', foreignKey: 'postcodeID'});
        }
    }

    PostcodeProfile.init({
        profileID: {
            type: DataTypes.INTEGER, allowNull: false,
        },

        postcodeID: {
            type: DataTypes.INTEGER, allowNull: false,
        },

    }, {
        sequelize,
        modelName: 'PostcodeProfile',
        timestamps: false,
    });
    return PostcodeProfile;
};
