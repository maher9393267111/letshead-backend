const {checkValidation, deleteFromBody} = require("../services/globalFunction");
const {Plan} = require("../../models");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";
    Plan.findAll({
        order: [['createdAt', 'DESC']],
        paranoid: isShowDeleted,
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};

exports.findAllActive = async (req, res, next) => {
    Plan.findAll({
        where: {isActive: true},
        attributes: ['content'],
        order: [['createdAt', 'DESC']],
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};


// Create and Save a new Plan
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Plan");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    await Plan.create({
        name: req.body.name, planUID: req.body.planUID, content: req.body.content, isActive: req.body.isActive,
    })
        .then(async data => {
            res.send();

        })
        .catch(next);
};


// Update a Plan by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Plan");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await Plan.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                Plan.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                res.status(406).send({
                    message: `Cannot update Plan with id=${id}. Maybe Plan was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete a Plan with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await Plan.restore({where: {id: arrIDs}})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update Plan with ids. Maybe Plan was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            await Plan.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.send({
                            message: "Plan was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Plan with range ids. Maybe Plan was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await Plan.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Plan with range ids. Maybe Plan was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};



