const {checkValidation, deleteFromBody, deleteImages} = require("../services/globalFunction");
const {ManualQuote} = require("../../models");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";
    ManualQuote.findAll({
        order: [['createdAt', 'DESC']], paranoid: isShowDeleted,
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};


// Create and Save a new ManualQuote
exports.create = async (req, res, next) => {

    let file = null, filePath;
    if (req.file != null && req.file) {
        file = req.file;
        if (file) filePath = "./" + process.env.AVATAR_STORAGE + "/" + file.filename;
    }

    try {
        const {errors, isValid} = checkValidation(req, "ManualQuote");
        if (!isValid) {
            if (file) deleteImages([filePath]);
            return res.status(400).json(errors);
        }
    } catch (e) {
        if (file) deleteImages([filePath]);
        return res.status(400).json();
    }

    const body = req.body;
    await ManualQuote.create({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        postcode: body.postcode,
        phoneNumber: body.phoneNumber,
        discountPrice: body.discountPrice,
        tax: body.tax,
        expiredAt: body.expiredAt,
        products: body.products
    })
        .then(async data => {
            res.send();

        })
        .catch(function (err) {
            deleteImages([filePath]);
            return next(err);
        });

};

// Find a single Tutorial with an id
exports.show = async (req, res, next) => {
    const id = req.params.id;
    await ManualQuote.findOne({where: {uuid: id, status: 0}})
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({message: 'Not found ManualQuote with id=' + id});
            }
        })
        .catch(next);
};

exports.status = async (req, res, next) => {

    try {
        const {errors, isValid} = checkValidation(req, "ManualQuoteStatus");
        if (!isValid) {
            return res.status(400).json(errors);
        }
    } catch (e) {
        return res.status(400).json();
    }

    let body = {status: req.body.isAccepted === true ? 1 : 2};
    const uuid = req.params.id;

    await ManualQuote.update(body, {where: {uuid: uuid}})
        .then(num => {
            console.log(num)
            if (Number(num) === 1) {
                return res.status(200).json();
            } else {
                return res.status(406).send({
                    message: `Cannot update ManualQuote with id=${uuid}. Maybe ManualQuote was not found or req.body is empty!`
                });
            }
        })
        .catch(function (err) {
            return next(err);
        });
};


// Update a ManualQuote by the id in the request
exports.update = async (req, res, next) => {

    try {
        const {errors, isValid} = checkValidation(req, "ManualQuote");
        if (!isValid) {
            return res.status(400).json(errors);
        }
    } catch (e) {
        return res.status(400).json();
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await ManualQuote.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                ManualQuote.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                return res.status(406).send({
                    message: `Cannot update ManualQuote with id=${id}. Maybe ManualQuote was not found or req.body is empty!`
                });
            }
        })
        .catch(function (err) {
            return next(err);
        });
};

// Delete a ManualQuote with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await ManualQuote.restore({where: {id: arrIDs}})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update ManualQuote with ids. Maybe ManualQuote was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            await ManualQuote.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        let arrIDs = [];
                        data.map((row) => {
                            arrIDs.push(row.id);
                        });
                        res.send({
                            message: "ManualQuote was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete ManualQuote with range ids. Maybe ManualQuote was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await ManualQuote.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete ManualQuote with range ids. Maybe ManualQuote was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};



