const {checkValidation, deleteFromBody} = require("../services/globalFunction");
const {City, Postcode} = require("../../models");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";

    City.findAll({
        order: [['createdAt', 'DESC']],
        paranoid: isShowDeleted,
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};

exports.findPostcodesInCity = async (req, res, next) => {

    let isTypeEng = req.params.isTypeEng;
    let condition = {isActive: true};

    if (isTypeEng !== undefined && isTypeEng === "true") {
        condition["type"] = 1;
    } else if (isTypeEng !== undefined && isTypeEng === "true") {
        condition["type"] = 2;
    }

    City.findAll({
        where: {isActive: true}, attributes: ["id", "name"], order: [['createdAt', 'DESC']], include: {
            where: condition, model: Postcode, attributes: ["name", "id", "isActive"], required: true,
        }
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};


// Create and Save a new City
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "City");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let bulkData = req.body.name.split(',').map((name) => {
        return {
            name: name, isActive: req.body.isActive,
        };
    });

    await City.bulkCreate(bulkData).then(async data => {
        res.send();
    })
        .catch(next);


};

// Update a City by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "City");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await City.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                City.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                res.status(406).send({
                    message: `Cannot update City with id=${id}. Maybe City was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete a City with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await City.restore({where: {id: arrIDs}})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update City with ids. Maybe City was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            await City.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.send({
                            message: "City was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete City with range ids. Maybe City was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await City.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete City with range ids. Maybe City was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};

