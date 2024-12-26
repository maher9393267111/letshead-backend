const {checkValidation, deleteFromBody} = require("../services/globalFunction");
const {FuelType} = require("../../models");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";
    FuelType.findAll({
        order: [['createdAt', 'DESC']],
        paranoid: isShowDeleted,
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};


// Create and Save a new FuelType
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "FuelType");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    await FuelType.create({
        name: req.body.name,isActive: req.body.isActive,
    })
        .then(async data => {
            res.send();

        })
        .catch(next);


};

// Update a FuelType by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "FuelType");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await FuelType.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                FuelType.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                res.status(406).send({
                    message: `Cannot update FuelType with id=${id}. Maybe FuelType was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete a FuelType with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await FuelType.restore({where: {id: arrIDs}})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update FuelType with ids. Maybe FuelType was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            await FuelType.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.send({
                            message: "FuelType was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete FuelType with range ids. Maybe FuelType was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await FuelType.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete FuelType with range ids. Maybe FuelType was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};



