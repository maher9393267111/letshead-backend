const {checkValidation, deleteFromBody} = require("../../services/globalFunction");
const {Appliance} = require("../../../models");

exports.show = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";
    const id=req.params.id;
    Appliance.findAll({
        where:{planUserID:id},
        order: [['createdAt', 'DESC']],
        paranoid: isShowDeleted,
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};


// Create and Save a new Appliance
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Appliance");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const body = req.body;
    await Appliance.create({
        name: body.name,
        planUserID: body.planUserID,
        warrantyStartedAt: body.startedAt,
        warrantyEndedAt: body.endedAt,
        type: body.type,
        model: body.model,
        location: body.location,
        additional: body.additional,
        applianceService: body.applianceService,
    })
        .then(async data => {
            res.send(data);

        })
        .catch(next);
};


// Update a Appliance by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Appliance");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await Appliance.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                Appliance.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                res.status(406).send({
                    message: `Cannot update Appliance with id=${id}. Maybe Appliance was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete a Appliance with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await Appliance.restore({where: {id: arrIDs}})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update Appliance with ids. Maybe Appliance was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            await Appliance.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.send({
                            message: "Appliance was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Appliance with range ids. Maybe Appliance was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await Appliance.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Appliance with range ids. Maybe Appliance was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};


