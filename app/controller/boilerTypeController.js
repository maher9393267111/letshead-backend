const {checkValidation, deleteFromBody} = require("../services/globalFunction");
const {BoilerType} = require("../../models");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";
    BoilerType.findAll({
        order: [['createdAt', 'DESC']],
        paranoid: isShowDeleted,
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};


// Create and Save a new BoilerType
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "BoilerType");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    await BoilerType.create({
        name: req.body.name,parentID: req.body.parentID,  isActive: req.body.isActive,
    })
        .then(async data => {
            res.send();

        })
        .catch(next);


};

// Update a BoilerType by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "BoilerType");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await BoilerType.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                BoilerType.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                res.status(406).send({
                    message: `Cannot update BoilerType with id=${id}. Maybe BoilerType was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete a BoilerType with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await BoilerType.restore({where: {id: arrIDs}})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update BoilerType with ids. Maybe BoilerType was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            await BoilerType.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.send({
                            message: "BoilerType was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete BoilerType with range ids. Maybe BoilerType was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await BoilerType.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete BoilerType with range ids. Maybe BoilerType was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};


