'use strict';
const moment = require("moment");
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class EmailTemplate extends Model {
        static associate(models) {
            EmailTemplate.hasMany(models.EmailOrder, { foreignKey: 'templateID',});
        }
    }

    EmailTemplate.init({
         name: {
            type: DataTypes.STRING, allowNull: false,
        },  templateTitle: {
            type: DataTypes.STRING, allowNull: false,
        }, templateContent: {
            type: DataTypes.TEXT, allowNull: true,
        }, isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        createdAt: {
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
        sequelize, modelName: 'EmailTemplate',  paranoid: true,
    });
    return EmailTemplate;
};
