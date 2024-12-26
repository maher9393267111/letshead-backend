const {checkValidation, deleteFromBody} = require("../services/globalFunction");
const {EmailOrder, User, AvailableInstallation, BoilerType} = require("../../models");
const {sendMail} = require("../../helpers/SendMail");
const {Op} = require("sequelize");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";
    EmailOrder.findAll({
        order: [['createdAt', 'DESC']], paranoid: isShowDeleted,
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};


// Create and Save a new EmailOrder
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "EmailOrder");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    await EmailOrder.create({
        userID: req.body.userID, orderID: req.body.orderID, templateID: req.body.templateID, mailTitle: req.body.mailTitle, mailContent: req.body.mailContent,
    })
        .then(async emailOrder => {
            res.send(emailOrder);
            const user = await User.scope('withEmail').findByPk(emailOrder.userID);
            await sendMail(2, user.email, user.name, {mailTitle: emailOrder.mailTitle, mailContent: emailOrder.mailContent});

        })
        .catch(next);


};

exports.show = async (req, res, next) => {
    const id = Number(req.params.id);
    EmailOrder.findAll({where:{orderID:id}})
        .then(async data => {
            res.status(200).send(data);
        })
        .catch(next);
};


