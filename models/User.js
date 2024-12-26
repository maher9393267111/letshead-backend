'use strict';
const moment = require("moment");
const {Model,} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.AvailableWork, {foreignKey: 'userID'});
            User.hasMany(models.AssignEngineer, {foreignKey: 'userID'});
            User.hasOne(models.Profile, {foreignKey: 'userID'});
            User.hasOne(models.Customer, {foreignKey: 'userID'});
            User.hasMany(models.Order, {foreignKey: 'userID'});
            User.belongsToMany(models.Role, {through: 'RoleUser', foreignKey: 'userID'});

        }
    }

    User.init({
        name: {
            type: DataTypes.STRING, allowNull: false,
        },

        username: {
            type: DataTypes.STRING, allowNull: false, unique: {
                args: true, msg: 'Username address already in use!'
            }
        }, password: {
            type: DataTypes.STRING, allowNull: false,
        },
        email: {
            type: DataTypes.STRING, allowNull: false, unique: true,
        },
        dialCode: {
            type: DataTypes.STRING, allowNull: false,defaultValue: "+44",
        },
        isActive: {
            type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true,
        }, createdAt: {
            type: 'TIMESTAMP', allowNull: false, get() {
                return parseInt(moment(this.getDataValue('createdAt')).format('x'));
            }
        }, deletedAt: {
            type: DataTypes.BOOLEAN, allowNull: true, get() {
                return this.getDataValue("deletedAt") != null;
            },
        },
    }, {
        sequelize, modelName: 'User', paranoid: true, defaultScope: {
            attributes: {exclude: ['password', 'isActive', 'createdAt', 'updatedAt', 'deletedAt', 'username','email']},
        }, scopes: {
            withActiveUsername: {
                attributes: {exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt','email']},
            }, withActive: {
                attributes: {exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt', 'username','email']},
            }, withActivePassword: {
                attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt', 'username','email']},
            }, withEmail: {
                attributes: {exclude: ['password', 'isActive', 'createdAt', 'updatedAt', 'deletedAt']},
            },withAllInfo: {
                attributes: {exclude: ['password', 'createdAt', 'updatedAt',]},
            },
        }, hooks: {
            afterDestroy: async (instance, options) => {
                try {
                    instance.getProfile().then(model => model?.destroy());
                    instance.getCustomer().then(model => model?.destroy());
                    instance.getAvailableWorks().then(models => models.forEach(model => model?.destroy()));
                    instance.getOrders().then(models => models.forEach(model => model?.destroy()));
                } catch (e) {
                    console.log(e);
                }
            },
            afterRestore: async (instance, options) => {
                try {
                    instance.getProfile({paranoid: false}).then(model => model?.restore());
                    instance.getCustomer({paranoid: false}).then(model => model?.restore());
                    instance.getAvailableWorks({paranoid: false}).then(models => models.forEach(model => model?.restore()));
                    instance.getOrders({paranoid: false}).then(models => models.forEach(model => model?.restore()));
                } catch (e) {
                    console.log(e);
                }
            },
        },
    });
    return User;
};
