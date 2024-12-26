const {checkValidation, deleteFromBody} = require("../../services/globalFunction");
const {PlanService} = require("../../../models");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";
    PlanService.findAll({
        order: [['createdAt', 'DESC']],
        paranoid: isShowDeleted,
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};


// Create and Save a new PlanService
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "PlanService");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    await PlanService.create({
        name: req.body.name,price: req.body.price, discount: req.body.discount, isActive: req.body.isActive,
    })
        .then(async data => {
            res.send(data);

        })
        .catch(next);
};



// Update a PlanService by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "PlanService");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await PlanService.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                PlanService.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                res.status(406).send({
                    message: `Cannot update PlanService with id=${id}. Maybe PlanService was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete a PlanService with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await PlanService.restore({where: {id: arrIDs}})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update PlanService with ids. Maybe PlanService was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            await PlanService.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.send({
                            message: "PlanService was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete PlanService with range ids. Maybe PlanService was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await PlanService.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete PlanService with range ids. Maybe PlanService was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};



