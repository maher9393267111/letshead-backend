'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class RoleUser extends Model {
        static associate(models) {
            RoleUser.belongsTo(models.User, {foreignKey: 'userID',});
            RoleUser.belongsTo(models.Role, {foreignKey: 'roleID',});

        }
    }

    RoleUser.init({
        userID: {
            type: DataTypes.INTEGER, allowNull: false,
        }, roleID: {
            type: DataTypes.INTEGER, allowNull: false,
        },
    }, {
        sequelize, modelName: 'RoleUser', timestamps: false,
    });

    RoleUser.removeAttribute('id');
    return RoleUser;
};
