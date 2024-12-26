const {checkValidation, deleteFromBody} = require("../../services/globalFunction");
const {PlanUser} = require("../../../models");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";
    PlanUser.findAll({
        order: [['createdAt', 'DESC']],
        paranoid: isShowDeleted,
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};


// Create and Save a new PlanUser
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "PlanUser");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    await PlanUser.create({
        userID: req.body.userID,planServiceID: req.body.planServiceID,
        price: req.body.price, discount: req.body.discount,
        startedAt: req.body.startedAt, expireAt: req.body.expireAt,status: req.body.status,
    })
        .then(async data => {
            res.send(data);

        })
        .catch(next);
};



// Update a PlanUser by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "PlanUser");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await PlanUser.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                PlanUser.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                res.status(406).send({
                    message: `Cannot update PlanUser with id=${id}. Maybe PlanUser was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete a PlanUser with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await PlanUser.restore({where: {id: arrIDs}})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update PlanUser with ids. Maybe PlanUser was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            await PlanUser.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.send({
                            message: "PlanUser was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete PlanUser with range ids. Maybe PlanUser was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await PlanUser.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete PlanUser with range ids. Maybe PlanUser was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};


