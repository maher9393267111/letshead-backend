'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class QuoteQuestion extends Model {
        static associate(models) {
            QuoteQuestion.belongsTo(models.Question, {foreignKey: "questionID", as: "Question"});
            QuoteQuestion.belongsTo(models.Question, {foreignKey: "answerID", as: "Answer",});

        }
    }

    QuoteQuestion.init({
        quoteID: {
            type: DataTypes.INTEGER, allowNull: false,
        },

        questionID: {
            type: DataTypes.INTEGER, allowNull: false,
        },

        answerID: {
            type: DataTypes.INTEGER, allowNull: false,
        },

        createdAt: {
            type: 'TIMESTAMP', allowNull: false, get() {
                return parseInt(moment(this.getDataValue('createdAt')).format('x'));
            }
        }
    }, {
        sequelize, modelName: 'QuoteQuestion',
    });
    return QuoteQuestion;
};
