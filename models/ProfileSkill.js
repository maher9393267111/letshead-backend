'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProfileSkill extends Model {
        static associate(models) {
            ProfileSkill.belongsToMany(models.Profile, {through: 'ProfileSkill', foreignKey: 'profileID'});
            ProfileSkill.belongsToMany(models.Postcode, {through: 'ProfileSkill', foreignKey: 'skillID'});
        }
    }

    ProfileSkill.init({
        profileID: {
            type: DataTypes.INTEGER, allowNull: false,
        },

        skillID: {
            type: DataTypes.INTEGER, allowNull: false,
        },

    }, {
        sequelize,
        modelName: 'ProfileSkill',
        timestamps: false,
    });
    return ProfileSkill;
};
