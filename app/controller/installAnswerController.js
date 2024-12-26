const {checkValidation, deleteFromBody} = require("../services/globalFunction");
const {InstallAnswer, Order} = require("../../models");
const {Op, where} = require("sequelize");

exports.findAll = async (req, res, next) => {

    InstallAnswer.findAll({
        order: [['createdAt', 'DESC']]
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};


// Create and Save a new InstallAnswer
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "InstallAnswer");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const body = req.body;
    const orderID = Number(body.orderID);
    let questionIDs = [];

    let bulkData = body.questions.map((question) => {
        questionIDs.push(Number(question.installQuestionID));
        return {
            orderID: orderID, installQuestionID: question.installQuestionID, multiChoiceAnswer: question.multiChoiceAnswer, shortAnswer: question.shortAnswer,
        };
    });


    if (bulkData.length > 0) {
        await InstallAnswer.destroy({where: {installQuestionID: questionIDs, orderID: orderID}});

        await InstallAnswer.bulkCreate(bulkData).then(async (data) => {

            if (!body.isSaveMode) {
                if (body.isPreQuestions) {
                    await Order.update({"preQuestionStatus": 0}, {where: {id: orderID}});
                } else {
                    await Order.update({"postQuestionStatus": 0}, {where: {id: orderID}});

                }

            }

            res.send();
        });
    } else
        return res.status(204).send();

};


// Delete a InstallAnswer with the specified id in the request
exports.delete = async (req, res, next) => {

    const id = req.params.id;

    await InstallAnswer.destroy({
        where: {id}
    })
        .then(num => {
            if (Number(num) === 1) {

                res.send({
                    message: "InstallAnswer was deleted successfully!"
                });

            } else {
                res.status(400).send({
                    message: `Cannot delete InstallAnswer with id=${id}. Maybe InstallAnswer was not found!`
                });
            }
        })
        .catch(next);


};
