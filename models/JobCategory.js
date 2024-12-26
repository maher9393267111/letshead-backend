'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class JobCategory extends Model {
        static associate(models) {

        }
    }

    JobCategory.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isTypeCategory: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        createdAt: {
            type: 'TIMESTAMP',
            allowNull: false,
            get() {
                return parseInt(moment(this.getDataValue('createdAt')).format('x'));
            }
        }
    }, {
        sequelize,
        modelName: 'JobCategory',
    });
    return JobCategory;
};
