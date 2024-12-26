const {deleteFromBody, checkValidation} = require("../services/globalFunction");
const {Option} = require("../../models");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";

    Option.findAll({
        order: [['createdAt', 'DESC']], paranoid: isShowDeleted,
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};


// Create and Save a new Option
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Option");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    await Option.create({
        key: req.body.key, value: req.body.value, isActive: req.body.isActive,

    })
        .then(async data => {
            res.send();
        })
        .catch(next);


};

// Find a single Option with an id
exports.show = async (req, res, next) => {
    await Option.findAll({where:{isActive:true},attributes:["key","value"]})
        .then(data => {
            res.send(data);
        })
        .catch(next);
};

// Update an Option by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Option");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await Option.update(body, {where: {key: id}})
        .then(num => {
            if (Number(num) === 1) {
                Option.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                res.status(406).send({
                    message: `Cannot update Option with id=${id}. Maybe Option was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete an Option with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(id);
    });

    if (isRestore) {
        await Option.restore({ where: { key: arrIDs } })
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update Option with ids. Maybe Option was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            await Option.destroy({ where: { key: arrIDs }, force: isForce })
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.send({
                            message: "Option was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Option with range ids. Maybe Option was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await Option.destroy({ where: { key: arrIDs }, force: isForce })
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Option with range ids. Maybe Option was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};


