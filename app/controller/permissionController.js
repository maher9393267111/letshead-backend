const {checkValidation, deleteFromBody} = require("../services/globalFunction");
const {Permission} = require("../../models");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";
    Permission.findAll({
        order: [['createdAt', 'DESC']],
        paranoid: isShowDeleted,
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};


// Create and Save a new Permission
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Permission");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    await Permission.create({
        slug: req.body.slug,displayName: req.body.displayName,
    })
        .then(async data => {
            res.send(data);

        })
        .catch(next);


};

// Update a Permission by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Permission");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await Permission.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                Permission.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                res.status(406).send({
                    message: `Cannot update Permission with id=${id}. Maybe Permission was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete a Permission with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await Permission.restore({where: {id: arrIDs}})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update Permission with ids. Maybe Permission was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            await Permission.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.send({
                            message: "Permission was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Permission with range ids. Maybe Permission was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await Permission.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Permission with range ids. Maybe Permission was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};



