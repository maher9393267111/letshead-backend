const {checkValidation, deleteFromBody} = require("../services/globalFunction");
const {User, Role, RoleUser, Order} = require("../../models");
const {Sequelize, Op} = require("sequelize");

exports.findAll = async (req, res, next) => {

    const users = await User.findAll({
        attributes: [[Sequelize.fn('COUNT', Sequelize.col('User.id')), 'count'],],
        include: [{model: Role, attributes: ["slug"], through: {model: RoleUser, attributes: []}}],
        group: ["Roles.RoleUser.roleID"],
        raw: true,
    });

    const ordersStatus = await Order.findAll({
        attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],], group: ["status"], raw: true
    });

    const ordersMonth = await Order.findAll({
        attributes: [[Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"], [Sequelize.fn("count", "*"), "count"],], group: ["month"],

        raw: true
    });

    res.send({users, ordersStatus, ordersMonth});
};
