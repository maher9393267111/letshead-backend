const {checkValidation, deleteFromBody} = require("../services/globalFunction");
const {Op, Sequelize} = require("sequelize");
const {
    AssignEngineer,
    ImageOrder,
    ImageType,
    Order,
    Product,
    BoilerType,
    AddressOrder,
    User,
    AddonOrder,
    Addon,
    OrderQuestion,
    Question,
    InstallAnswer,
    InstallQuestion
} = require("../../models");
const {sendMail} = require("../../helpers/SendMail");

exports.findAll = async (req, res, next) => {

    AssignEngineer.findAll({
        where: {userID: req.userID}, order: [['createdAt', 'DESC']], attributes: ["id", "status", "orderID","price","engNote","isVerticalFlue"], include: [{
            model: Order,
            required: true,
            attributes: ["installDate", "preQuestionStatus", "postQuestionStatus", "imageEvidenceStatus"],
            include: [{model: Product, attributes: ["name"], include: {model: BoilerType, attributes: ["name"]}}, {
                model: AddonOrder, attributes: ["amount"], include: {model: Addon, attributes: ["name"]}
            }, {
                model: AddressOrder, attributes: ["installPostcode","installLine1","installLine2","installCity"]
            },]
        }],
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};


// Create and Save a new AssignEngineer
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "AssignEngineer");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = req.body;
    await AssignEngineer.update({status: 3}, {where: {orderID: body.orderID, status: {[Op.or]: [0, 1]}}})
        .then(async (num) => {
            await AssignEngineer.create({
                userID: body.userID, orderID: body.orderID, price: body.price, isVerticalFlue: body.isVerticalFlue, engNote: body.note,
            })
                .then(async data => {
                    res.send();

                })
                .catch(next);
        })
        .catch(next);


};

// Find a single Tutorial with an id
exports.show = async (req, res, next) => {

    const id = req.params.id;

    await AssignEngineer.findAll({
        where: {orderID: id},
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};

// Update a AssignEngineer by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "AssignEngineer");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await AssignEngineer.update(body, {where: {id, userID: req.userID}})
        .then(num => {
            if (Number(num) === 1) {
                AssignEngineer.findByPk(id)
                    .then(async assignEng => {
                        res.status(200).send(assignEng);

                        if (assignEng.status === 1) {
                            const eng = await User.findByPk(assignEng.userID);
                            const order = await Order.findByPk(assignEng.orderID);
                            const user = await User.scope('withEmail').findByPk(order.userID);
                            await sendMail(3, user.email, user.name, {engName: eng.name, installDate: order.installDate});
                        }
                    })
                    .catch(next);

            } else {
                res.status(406).send({
                    message: `Cannot update AssignEngineer with id=${id}. Maybe AssignEngineer was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete a AssignEngineer with the specified id in the request
exports.delete = async (req, res, next) => {

    const id = req.params.id;

    await AssignEngineer.destroy({
        where: {id}
    })
        .then(num => {
            if (Number(num) === 1) {

                res.send({
                    message: "AssignEngineer was deleted successfully!"
                });

            } else {
                res.status(400).send({
                    message: `Cannot delete AssignEngineer with id=${id}. Maybe AssignEngineer was not found!`
                });
            }
        })
        .catch(next);
};

// Find a single Tutorial with an id
exports.findOrder = async (req, res, next) => {

    const id = req.params.id;

    await Order.findByPk(id, {
        attributes: ["installDate", "status", "preQuestionStatus", "postQuestionStatus", "imageEvidenceStatus"],

        include: [{model: User, attributes: ["name", "username"]}, {
            model: Product, attributes: ["name", "image"], include: {model: BoilerType, attributes: ["name"]}
        }, {model: AddonOrder, attributes: ["amount"], include: {model: Addon, attributes: ["name", "image"]}}, {
            model: AddressOrder, attributes: ["installLine1", "installLine2", "installCity", "installPostcode"]
        }, {
            model: OrderQuestion, attributes: ["questionID"], include: {model: Question, attributes: ["name"], as: "Answer"}
        }, {
            model: InstallAnswer,
            attributes: ["multiChoiceAnswer", "shortAnswer"],
            include: [{model: InstallQuestion, attributes: ['id', 'isPreInstall', 'type']},]
        }, {model: ImageOrder, attributes: ["image", "imageTypeID"], include: {model: ImageType, attributes: ["name", "parentID"]}},]
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};
