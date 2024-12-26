'use strict';
const moment = require("moment");
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class NoteProfile extends Model {
        static associate(models) {
            NoteProfile.belongsTo(models.Order, {foreignKey: 'profileID'});
        }
    }

    NoteProfile.init({
        profileID: {
            type: DataTypes.INTEGER, allowNull: false,
        }, title: {
            type: DataTypes.STRING, allowNull: false,
        }, body: {
            type: DataTypes.TEXT, allowNull: true,
        },

        createdAt: {
            type: 'TIMESTAMP', allowNull: false, get() {
                return parseInt(moment(this.getDataValue('createdAt')).format('x'));
            }
        }
    }, {
        sequelize, modelName: 'NoteProfile',
    });
    return NoteProfile;
};
