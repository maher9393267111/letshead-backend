const {checkValidation, deleteFromBody, deleteImages} = require("../services/globalFunction");
const {Addon, AddonProduct, Product} = require("../../models");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";

    Addon.findAll({
        order: [['createdAt', 'DESC']], paranoid: isShowDeleted,
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};


// Create and Save a new Addon
exports.create = async (req, res, next) => {

    let file = null, filePath;
    if (req.file != null && req.file) {
        file = req.file;
        if (file) filePath = "./" + process.env.AVATAR_STORAGE + "/" + file.filename;
    }


    try {
        const {errors, isValid} = checkValidation(req, "Addon");
        if (!isValid) {
            if (file) deleteImages([filePath]);
            return res.status(400).json(errors);
        }
    } catch (e) {
        if (file) deleteImages([filePath]);
        return res.status(400).json();
    }

    await Addon.create({
        name: req.body.name,
        manufacturerID: req.body.manufacturerID,
        categoryID: req.body.categoryID,
        price: req.body.price,
        discount: req.body.discount,
        code: req.body.code,
        wattage: req.body.wattage,
        warranty: req.body.warranty,
        warrantyImage: req.body.warrantyImage,
        isActiveQuantity: req.body.isActiveQuantity,
        isActiveDiscount: req.body.isActiveDiscount,
        subtitle: req.body.subtitle,
        description: req.body.description,
        isActive: req.body.isActive,
        image: file?.filename,
    })
        .then(async data => {
            res.send();
        })
        .catch(function (err) {
            deleteImages([filePath]);
            return next(err);
        });


};

// // Find a single Tutorial with an id
exports.findAddonsProduct = async (req, res, next) => {

    const id = req.params.id;

    await Addon.findAll({
        attributes: ["id", "name", "price", "image"],
        where: {isActive: true},
        include: [{model: Product, required: true, attributes: [], through: {model: AddonProduct, attributes: [], where: {productID: id}}}],

    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};

// Update an Addon by the id in the request
exports.update = async (req, res, next) => {


    let file = null, filePath;
    if (req.file != null && req.file) {
        file = req.file;
        if (file) filePath = "./" + process.env.AVATAR_STORAGE + "/" + file.filename;
    }

    // check validation
    try {
        const {errors, isValid} = checkValidation(req, "Addon");
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
        await Addon.findByPk(id)
            .then(async data => {
                let imageName = data.image;
                if (imageName != null) {
                    const imagePath = "./" + process.env.AVATAR_STORAGE + "/" + imageName;
                    deleteImages([imagePath]);
                }
            })
            .catch(next);

    }

    await Addon.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                Addon.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);
            } else {
                if (file) deleteImages([filePath]);
                return res.status(406).send({
                    message: `Cannot update Product with id=${id}. Maybe it was not found or req.body is empty!`
                });
            }
        })
        .catch(function (err) {
            if (file) deleteImages([filePath]);
            return next(err);
        });

};

// Delete an Addon with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await Addon.restore({where: {id: arrIDs}}) // individualHooks: true
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update Addon with ids. Maybe Addon was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            const data = await Addon.findAll({
                where: {id: arrIDs}, attributes: ["id", "image"], raw: true, paranoid: false,
            });
            await Addon.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        let images = [], arrIDs = [];
                        data.map((row) => {
                            images.push("./" + process.env.AVATAR_STORAGE + "/" + row.image);
                            arrIDs.push(row.id);
                        });
                        deleteImages(images);
                        res.send({
                            message: "Addon was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Addon with range ids. Maybe Addon was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await Addon.destroy({where: {id: arrIDs}, force: isForce,}) // individualHooks: true
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Addon with range ids. Maybe Addon was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};

