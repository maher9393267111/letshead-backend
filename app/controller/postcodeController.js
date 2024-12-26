const {checkValidation, deleteFromBody} = require("../services/globalFunction");
const {Postcode, ProductOrder} = require("../../models");
const {Op, Sequelize} = require("sequelize");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";

    Postcode.findAll({
        order: [['createdAt', 'DESC']], paranoid: isShowDeleted,
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};


// Create and Save a new Postcode
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Postcode");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let bulkData = req.body.name.split(',').map((name) => {
        return {
            name: name.toLowerCase(), cityID: req.body.cityID, type: req.body.type, isActive: req.body.isActive,
        };
    });

    await Postcode.bulkCreate(bulkData).then(async data => {
        res.send();
    })
        .catch(next);


};

// Find a single Tutorial with an id
exports.show = async (req, res, next) => {

    const postCodeTxt = req.params.postcode.trim().toLowerCase();

    if (postCodeTxt.length < 5 || postCodeTxt.length > 8) return res.status(404).send();

    Postcode.findOne({
        attributes: ["name", "type"], where: {
            name: {
                [Op.or]: [{[Op.and]: [Sequelize.where(Sequelize.fn('char_length', Sequelize.col('name')), 2), {[Op.startsWith]: postCodeTxt.slice(0, 2)}]}, {
                    [Op.and]: [Sequelize.where(Sequelize.fn('char_length', Sequelize.col('name')), 1), {[Op.startsWith]: postCodeTxt.slice(0, 1)}, Sequelize.where(Sequelize.literal(Number(postCodeTxt.charAt(1)) >= 0), true)]
                },
                ]
            }, type: {[Op.or]: [0, 2]}
        },
    }).then(data => {
        res.status((data != null) ? 200 : 204).send();
    })
        .catch(next);
};

// Update a Postcode by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Postcode");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;
    body['name'] = body.name.toLowerCase();

    await Postcode.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                Postcode.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                res.status(406).send({
                    message: `Cannot update Postcode with id=${id}. Maybe Postcode was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete a Postcode with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await Postcode.restore({where: {id: arrIDs}})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update Postcode with ids. Maybe Postcode was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            await Postcode.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.send({
                            message: "Postcode was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Postcode with range ids. Maybe Postcode was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await Postcode.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Postcode with range ids. Maybe Postcode was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};
