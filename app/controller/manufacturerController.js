const {checkValidation, deleteFromBody, deleteImages} = require("../services/globalFunction");
const {Manufacturer, Addon} = require("../../models");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";
    Manufacturer.findAll({
        order: [['createdAt', 'DESC']],
        paranoid: isShowDeleted,
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};


// Create and Save a new Manufacturer
exports.create = async (req, res, next) => {

    let file = null, filePath;
    if (req.file != null && req.file) {
        file = req.file;
        if (file) filePath = "./" + process.env.AVATAR_STORAGE + "/" + file.filename;
    }

    try {
        const {errors, isValid} = checkValidation(req, "Manufacturer");
        if (!isValid) {
            if (file) deleteImages([filePath]);
            return res.status(400).json(errors);
        }
    } catch (e) {
        if (file) deleteImages([filePath]);
        return res.status(400).json();
    }

    await Manufacturer.create({
        name: req.body.name, isForAddon: req.body.isForAddon, isActive: req.body.isActive, image: file?.filename,
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

    const isForAddon = req.params.isForAddon !== "false";

    await Manufacturer.findAll({
        where: {isForAddon, isActive: true},
        attributes: ["id", "name", "image"],
        paranoid: true,

    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};


// Update a Manufacturer by the id in the request
exports.update = async (req, res, next) => {

    let file = null, filePath;
    if (req.file != null && req.file) {
        file = req.file;
        if (file) filePath = "./" + process.env.AVATAR_STORAGE + "/" + file.filename;
    }

    try {
        const {errors, isValid} = checkValidation(req, "Manufacturer");
        if (!isValid) {
            if (file) deleteImages([filePath]);
            return res.status(400).json(errors);
        }
    } catch (e) {
        if (file) deleteImages([filePath]);
        return res.status(400).json();
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    if (file !== null) {
        body["image"] = file.filename;
        await Manufacturer.findByPk(id)
            .then(async data => {
                let imageName = data.image;
                if (imageName != null) {
                    const imagePath = "./" + process.env.AVATAR_STORAGE + "/" + imageName;
                    deleteImages([imagePath]);
                }
            })
            .catch(next);

    }

    await Manufacturer.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                Manufacturer.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                if (file) deleteImages([filePath]);
                return res.status(406).send({
                    message: `Cannot update Manufacturer with id=${id}. Maybe Manufacturer was not found or req.body is empty!`
                });
            }
        })
        .catch(function (err) {
            if (file) deleteImages([filePath]);
            return next(err);
        });
};

// Delete a Manufacturer with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await Manufacturer.restore({where: {id: arrIDs}})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update Manufacturer with ids. Maybe Manufacturer was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            await Manufacturer.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        let images = [], arrIDs = [];
                        data.map((row) => {
                            images.push("./" + process.env.AVATAR_STORAGE + "/" + row.image);
                            arrIDs.push(row.id);
                        });
                        deleteImages(images);
                        res.send({
                            message: "Manufacturer was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Manufacturer with range ids. Maybe Manufacturer was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await Manufacturer.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Manufacturer with range ids. Maybe Manufacturer was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};



