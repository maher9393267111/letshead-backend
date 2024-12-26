'use strict';
const moment = require("moment");
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ImageProfile extends Model {
        static associate(models) {
            ImageProfile.belongsTo(models.Profile, {foreignKey: 'profileID'});
            ImageProfile.belongsTo(models.ImageType, {foreignKey: 'imageTypeID'});
        }
    }

    ImageProfile.init({
        profileID: {
            type: DataTypes.INTEGER, allowNull: false,
        }, imageTypeID: {
            type: DataTypes.INTEGER, allowNull: false,
        }, image: {
            type: DataTypes.TEXT, allowNull: false,
        }, expire: {
            type: DataTypes.DATEONLY, allowNull: false,
        },


        createdAt: {
            type: 'TIMESTAMP', allowNull: false, get() {
                return parseInt(moment(this.getDataValue('createdAt')).format('x'));
            }
        }
    }, {
        sequelize, modelName: 'ImageProfile',
    });
    return ImageProfile;
};
