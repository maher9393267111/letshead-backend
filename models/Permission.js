'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Permission extends Model {
        static associate(models) {
            Permission.belongsToMany(models.Role, {through: 'PermissionRole', foreignKey: 'permissionID',});
        }
    }

    Permission.init({
        slug: {
            type: DataTypes.STRING, allowNull: false,unique: true,
        },  displayName: {
            type: DataTypes.STRING, allowNull: false,
        },  createdAt: {
            type: 'TIMESTAMP', allowNull: false, get() {
                return parseInt(moment(this.getDataValue('createdAt')).format('x'));
            }
        },
        deletedAt: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            get() {
                return this.getDataValue("deletedAt") != null;
            },
        },
    }, {
        sequelize, modelName: 'Permission', paranoid: true,
    });
    return Permission;
};
