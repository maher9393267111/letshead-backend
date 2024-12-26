const {checkValidation, deleteFromBody} = require("../services/globalFunction");
const {Size} = require("../../models");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";

    Size.findAll({
        order: [['createdAt', 'DESC']],
        paranoid: isShowDeleted,
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};


// Create and Save a new Size
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Size");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    await Size.create({
        name: req.body.name,
        parentID: req.body.parentID,
        type: req.body.type,
        value: req.body.value,
        isActive: req.body.isActive,
    })
        .then(async data => {
            res.send();

        })
        .catch(next);


};

// Update a Size by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Size");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await Size.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                Size.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                res.status(406).send({
                    message: `Cannot update Size with id=${id}. Maybe Size was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete a Size with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await Size.restore({where: {id: arrIDs}})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update Size with ids. Maybe Size was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            await Size.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.send({
                            message: "Size was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Size with range ids. Maybe Size was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await Size.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Size with range ids. Maybe Size was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};



