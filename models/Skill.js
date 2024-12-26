'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Skill extends Model {
        static associate(models) {
            Skill.belongsToMany(models.Profile, {through: 'ProfileSkill', foreignKey: 'skillID',});

        }
    }

    Skill.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        parentID: {
            allowNull: false,
            type: DataTypes.INTEGER,
            defaultValue: 0,
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
        modelName: 'Skill',paranoid: true,
    });
    return Skill;
};
