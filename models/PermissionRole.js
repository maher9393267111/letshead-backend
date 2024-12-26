'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PermissionRole extends Model {
        static associate(models) {
            PermissionRole.belongsTo(models.Permission, {foreignKey: 'permissionID',});
            PermissionRole.belongsTo(models.Role, {foreignKey: 'roleID',});
        }
    }

    PermissionRole.init({
        permissionID: {
            type: DataTypes.INTEGER, allowNull: false,
        }, roleID: {
            type: DataTypes.INTEGER, allowNull: false,
        },
    }, {
        sequelize, modelName: 'PermissionRole', timestamps: false,
    });

    PermissionRole.removeAttribute('id');
    return PermissionRole;
};
