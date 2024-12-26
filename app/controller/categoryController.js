const {checkValidation, deleteFromBody} = require("../services/globalFunction");
const {Category, Addon, Product, AddonProduct} = require("../../models");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";

    Category.findAll({
        order: [['orderAt', 'ASC'], ['createdAt', 'ASC']], paranoid: isShowDeleted,
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};

exports.findAllAddons = async (req, res, next) => {
    Category.findAll({
        attributes: ["id", "name"],
        where: {isActive: true},
        order: [['orderAt', 'ASC'], ['createdAt', 'ASC']],
        include: {model: Addon, attributes: ["id", "name", "image"], where: {isActive: true}}
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};

exports.findAllAddonsProduct = async (req, res, next) => {
    const id = req.params.id;
    Category.findAll({
        attributes: ["id", "name", "isDynamicSelect"], where: {isActive: true}, order: [['orderAt', 'ASC'], ['createdAt', 'ASC']], include: {
            model: Addon, attributes: ["id", "name", "price", "isActiveQuantity", "image", "description"], where: {isActive: true}, include: [{
                model: Product,
                required: true,
                limit: 1,
                separate: false,
                attributes: ["id"],
                through: {model: AddonProduct, attributes: ["isDefault"], where: {productID: id}}
            }],
        }
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};


// Create and Save a new Category
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Category");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    await Category.create({
        name: req.body.name, isActive: req.body.isActive, isDynamicSelect: req.body.isDynamicSelect,
    })
        .then(async data => {
            res.send();

        })
        .catch(next);


};

// Update a Category by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Category");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    if ("sourcePosition" in body && "destinationID" in body && "destinationPosition" in body) {
        await Category.update({orderAt: body.sourcePosition}, {where: {id: body.destinationID}})
        body = {orderAt: body.destinationPosition};
    }

    await Category.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                res.status(200).send();
            } else {
                res.status(406).send({
                    message: `Cannot update Category with id=${id}. Maybe Category was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete a Category with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await Category.restore({where: {id: arrIDs}})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update Category with ids. Maybe Category was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            await Category.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.send({
                            message: "Category was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Category with range ids. Maybe Category was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await Category.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Category with range ids. Maybe Category was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};

