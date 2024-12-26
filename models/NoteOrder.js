'use strict';
const moment = require("moment");
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class NoteOrder extends Model {
        static associate(models) {
            NoteOrder.belongsTo(models.Order, {foreignKey: 'orderID'});

        }
    }

    NoteOrder.init({
        orderID: {
            type: DataTypes.INTEGER, allowNull: false,
        }, title: {
            type: DataTypes.STRING, allowNull: false,
        }, body: {
            type: DataTypes.TEXT, allowNull: true,
        },

        createdAt: {
            type: 'TIMESTAMP', allowNull: false, get() {
                return parseInt(moment(this.getDataValue('createdAt')).format('x'));
            }
        }
    }, {
        sequelize, modelName: 'NoteOrder',
    });
    return NoteOrder;
};
