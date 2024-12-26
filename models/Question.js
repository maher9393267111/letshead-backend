'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Question extends Model {
        static associate(models) {
            Question.belongsTo(models.Question, {as: 'Parent', foreignKey: 'parentID'});
        }
    }

    Question.init({
        name: {
            type: DataTypes.STRING, allowNull: false,
        }, orderNum: {
            type: DataTypes.INTEGER, allowNull: false,
        }, isShowHelpText: {
            type: DataTypes.BOOLEAN, defaultValue: false,
        },

        isShowHelpVideo: {
            type: DataTypes.BOOLEAN, defaultValue: false,
        },

        helpText: {
            type: DataTypes.TEXT, allowNull: true,
        },

        helpVideo: {
            type: DataTypes.STRING, allowNull: true,
        },

        image: {
            type: DataTypes.STRING, allowNull: true,
        },

        parentID: {
            type: DataTypes.INTEGER, allowNull: false, defaultValue: 0,
        },

        destinationID: {
            type: DataTypes.INTEGER, allowNull: false, defaultValue: 0,
        },
        dependenceType: {
            type: DataTypes.INTEGER, allowNull: false, defaultValue: 0,
        },
        dependenceID: {
            type: DataTypes.INTEGER, allowNull: false, defaultValue: 0,
        }, optStatus: {
            type: DataTypes.TINYINT, allowNull: false, defaultValue: 0,
        },
        isQuestion: {
            type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true
        },
        isActive: {
            type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false,
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
        sequelize, modelName: 'Question', paranoid: true, scopes: {
            userShow: {
                attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']},
            }
        },
    });
    return Question;
};
