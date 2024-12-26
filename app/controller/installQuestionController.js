const {checkValidation, deleteFromBody} = require("../services/globalFunction");
const {InstallQuestion} = require("../../models");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";

    InstallQuestion.findAll({
        order: [['createdAt', 'DESC']],
        paranoid: isShowDeleted,

    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};


// Create and Save a new InstallQuestion
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "InstallQuestion");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    await InstallQuestion.create({
        name: req.body.name,isPreInstall: req.body.isPreInstall, type: req.body.type, orderNum: req.body.orderNum,  isActive: req.body.isActive,
    })
        .then(async data => {
            res.send();

        })
        .catch(next);


};

// Update a InstallQuestion by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "InstallQuestion");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await InstallQuestion.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                InstallQuestion.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                res.status(406).send({
                    message: `Cannot update InstallQuestion with id=${id}. Maybe InstallQuestion was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete a InstallQuestion with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await InstallQuestion.restore({where: {id: arrIDs}})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update InstallQuestion with ids. Maybe InstallQuestion was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            await InstallQuestion.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.send({
                            message: "InstallQuestion was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete InstallQuestion with range ids. Maybe InstallQuestion was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await InstallQuestion.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete InstallQuestion with range ids. Maybe InstallQuestion was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};


