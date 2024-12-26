'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate(models) {
            Role.belongsToMany(models.User, {through: 'RoleUser', foreignKey: 'roleID',});
            Role.belongsToMany(models.Permission, {through: 'PermissionRole', foreignKey: 'roleID',});
        }
    }

    Role.init({
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
        sequelize, modelName: 'Role', paranoid: true,
    });
    return Role;
};
