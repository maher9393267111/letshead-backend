const {checkValidation, deleteFromBody} = require("../services/globalFunction");
const {Price} = require("../../models");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";

    Price.findAll({
        order: [['createdAt', 'DESC']],
        paranoid: isShowDeleted,
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};


// Create and Save a new Price
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Price");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    await Price.create({
        name: req.body.name,
        parentID: req.body.parentID,
        isMain: req.body.isMain,
        isDiscount: req.body.isDiscount,
        isActive: req.body.isActive,
        slug: req.body.slug,
        isAdditionalType: req.body.isAdditionalType,
    })
        .then(async data => {
            res.send();

        })
        .catch(next);


};

// Update a Price by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Price");
    if (!isValid) {
        return res.status(400).json(errors);
    }
    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await Price.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                Price.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                res.status(406).send({
                    message: `Cannot update Price with id=${id}. Maybe Price was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete a Price with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await Price.restore({where: {id: arrIDs}})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update Price with ids. Maybe Price was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            await Price.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.send({
                            message: "Price was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Price with range ids. Maybe Price was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await Price.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Price with range ids. Maybe Price was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};



