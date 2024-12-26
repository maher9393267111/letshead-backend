const {checkValidation, deleteFromBody} = require("../services/globalFunction");
const {EmailTemplate} = require("../../models");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";
    EmailTemplate.findAll({
        order: [['createdAt', 'DESC']], paranoid: isShowDeleted,
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};


// Create and Save a new EmailTemplate
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "EmailTemplate");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    await EmailTemplate.create({
        name: req.body.name, templateTitle: req.body.templateTitle, templateContent: req.body.templateContent, isActive: req.body.isActive,
    })
        .then(async data => {
            res.send();

        })
        .catch(next);


};

// Update a EmailTemplate by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "EmailTemplate");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await EmailTemplate.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                EmailTemplate.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                res.status(406).send({
                    message: `Cannot update EmailTemplate with id=${id}. Maybe EmailTemplate was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete a EmailTemplate with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await EmailTemplate.restore({where: {id: arrIDs}})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update EmailTemplate with ids. Maybe EmailTemplate was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            await EmailTemplate.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.send({
                            message: "EmailTemplate was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete EmailTemplate with range ids. Maybe EmailTemplate was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await EmailTemplate.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete EmailTemplate with range ids. Maybe EmailTemplate was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};



