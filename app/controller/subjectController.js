const {checkValidation, deleteFromBody} = require("../services/globalFunction");
const {Subject} = require("../../models");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";

    Subject.findAll({
        order: [['createdAt', 'DESC']],
        paranoid: isShowDeleted,
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};


// Create and Save a new Subject
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Subject");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    await Subject.create({
        name: req.body.name, isTypeEnquiry: req.body.isTypeEnquiry, isActive: req.body.isActive,
    })
        .then(async data => {
            res.send(data);

        })
        .catch(next);


};

// Find a single Tutorial with an id
exports.show = async (req, res, next) => {

    await Subject.findAll({
        where: {isActive: true}, attributes: ['id', 'name', 'isTypeEnquiry'],
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};


// Update a Subject by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Subject");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await Subject.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                Subject.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                res.status(406).send({
                    message: `Cannot update Subject with id=${id}. Maybe Subject was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete a Subject with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await Subject.restore({where: {id: arrIDs}})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update Subject with ids. Maybe Subject was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            await Subject.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.send({
                            message: "Subject was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Subject with range ids. Maybe Subject was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await Subject.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Subject with range ids. Maybe Subject was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};

