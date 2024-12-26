'use strict';
const moment = require("moment");

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class OrderQuestion extends Model {
        static associate(models) {
            OrderQuestion.belongsTo(models.Order, {foreignKey: 'orderID'});
            OrderQuestion.belongsTo(models.Question, {foreignKey: "questionID", as: "Question"});
            OrderQuestion.belongsTo(models.Question, {foreignKey: "answerID", as: "Answer",});
        }
    }

    OrderQuestion.init({
        orderID: {
            type: DataTypes.INTEGER, allowNull: false,
        },

        questionID: {
            type: DataTypes.INTEGER, allowNull: false,
        },

        answerID: {
            type: DataTypes.INTEGER, allowNull: false,
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
        modelName: 'OrderQuestion',
    });
    return OrderQuestion;
};
