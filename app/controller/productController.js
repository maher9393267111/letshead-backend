const {checkValidation, deleteFromBody, deleteImages} = require("../services/globalFunction");
const {
    Product, Question, ProductPlan, Plan, Size, ImageProduct, PostcodePrice, Price, ProductSize, PriceProduct, AddonProduct, GuestResult, Postcode
} = require("../../models");
const {Op, Sequelize, col} = require("sequelize");
const _ = require("lodash");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";

    Product.scope("withAllFields").findAll({
        include: [{model: Plan, attributes: ['id', 'name'], through: {model: ProductPlan, attributes: []}}],
        order: [['createdAt', 'DESC']],
        paranoid: isShowDeleted,
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};

// Create and Save a new Product
exports.create = async (req, res, next) => {

    let file = null, filePath;
    if (req.file != null && req.file) {
        file = req.file;
        if (file) filePath = "./" + process.env.AVATAR_STORAGE + "/" + file.filename;
    }


    try {
        const {errors, isValid} = checkValidation(req, "Product");
        if (!isValid) {
            if (file) deleteImages([filePath]);
            return res.status(400).json(errors);
        }
    } catch (e) {
        if (file) deleteImages([filePath]);
        return res.status(400).json();
    }

    const body = req.body;
    await Product.create({
        name: body.name,
        manufacturerID: body.manufacturerID,
        fuelTypeID: body.fuelTypeID,
        boilerTypeID: body.boilerTypeID,
        code: body.code,
        wattage: body.wattage,
        warranty: body.warranty,
        warrantyImage: body.warrantyImage,
        isRecommend: body.isRecommend,
        subtitle: body.subtitle,
        description: body.description,
        efficiencyRating: body.efficiencyRating,
        dimension: body.dimension,
        flowRate: body.flowRate,
        opt1: body.opt1,
        opt2: body.opt2,
        isActive: body.isActive,
        image: file?.filename, videoUrl: body.videoUrl, model: body.model, otherInfoTitle: body.otherInfoTitle, otherInfoContent: body.otherInfoContent,

    })
        .then(async product => {
            let bulkData = body.planIDs.split(',').map((id) => {
                return {productID: product.id, planID: Number(id)};
            });
            await ProductPlan.destroy({where: {productID: product.id}});
            await ProductPlan.bulkCreate(bulkData)
            res.send();

        })
        .catch(function (err) {
            deleteImages([filePath]);
            return next(err);
        });
};

exports.findSize = async (req, res, next) => {
    const id = req.params.id;

    ProductSize.findAll({where: {productID: id}})
        .then(data => {
            res.send(data);
        })
        .catch(next);
};

exports.updateSize = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "ProductSize");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const productID = Number(req.params.id);

    if ("sizeIDs" in body && body.sizeIDs !== "null" && body.sizeIDs !== "") {
        let bulkData = body.sizeIDs.map((id) => {
            return {productID: productID, sizeID: Number(id)};
        });
        await ProductSize.destroy({where: {productID: productID}})
        await ProductSize.bulkCreate(bulkData).then((data) => {
            res.send(data);
        });
    } else {
        res.status(406).send({
            message: `Cannot update ProductSize with id=${productID}. Maybe ProductSize was not found or req.body is empty!`
        });
    }
};

exports.findAddon = async (req, res, next) => {
    const id = req.params.id;

    AddonProduct.findAll({where: {productID: id}})
        .then(data => {
            res.send(data);
        })
        .catch(next);
};

exports.updateAddon = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "ProductSize");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const productID = Number(req.params.id);

    if ("addonIDs" in body && body.addonIDs !== "null" && body.addonIDs !== "") {
        let bulkData = body.addonIDs.map((id) => {
            return {productID: productID, addonID: Number(id), isDefault: body.addonDefaultIDs.includes(Number(id))};
        });
        await AddonProduct.destroy({where: {productID: productID}})
        await AddonProduct.bulkCreate(bulkData).then((data) => {
            res.send(data);
        });
    } else {
        res.status(406).send({
            message: `Cannot update AddonProduct with id=${productID}. Maybe AddonProduct was not found or req.body is empty!`
        });
    }
};

exports.findPrice = async (req, res, next) => {
    const id = req.params.id;

    PriceProduct.findAll({where: {productID: id}, attributes: ["priceID", "price"]})
        .then(data => {
            res.send(data);
        })
        .catch(next);
};

exports.findPrices = async (req, res, next) => {

    Product.findAll({
        where: {isActive: true}, attributes: {
            exclude: ["opt1", "opt2", "deletedAt"],
            include: [[Sequelize.literal('(SELECT price FROM priceProducts WHERE productID = Product.id AND priceID =61 )'), 'price'], [Sequelize.literal('(SELECT price FROM priceProducts WHERE productID = Product.id AND priceID = 62 )'), 'discount'],]
        }
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};

exports.updatePrice = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "PriceProduct");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const productID = Number(req.params.id);

    let bulkData = body.map((e) => {
        return {productID: productID, priceID: Number(e.priceID), price: Number(e.price)};
    });
    if (bulkData.length > 0) {
        await PriceProduct.destroy({where: {productID: productID}})
        await PriceProduct.bulkCreate(bulkData).then((data) => {
            res.send(data);
        });
    } else {
        res.status(406).send({
            message: `Cannot update ProductPrice with id=${productID}. Maybe ProductPrice was not found or req.body is empty!`
        });
    }


};

exports.findPostcode = async (req, res, next) => {
    const id = req.params.id;

    PostcodePrice.findAll({where: {productID: id}, attributes: ["postCodeID", "price"]})
        .then(data => {
            res.send(data);
        })
        .catch(next);
};

exports.updatePostcode = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "PostcodePrice");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const productID = Number(req.params.id);
    const isAllProducts = req.params.isAllProducts === "true";

    let bulkData = [];
    if (isAllProducts) {
        await Product.findAll().then(async (products) => {
            products.map(async product => {
                body.map((e) => {
                    bulkData.push({productID: product.id, postCodeID: Number(e.postCodeID), price: Number(e.price)});
                });
            });
        });

    } else {
        bulkData = body.map((e) => {
            return {productID: productID, postCodeID: Number(e.postCodeID), price: Number(e.price)};
        });
    }

    if (bulkData.length > 0) {
        if (isAllProducts) {
            await PostcodePrice.destroy({truncate: true});
        } else {
            await PostcodePrice.destroy({where: {productID: productID}})
        }
        await PostcodePrice.bulkCreate(bulkData);
        res.send();
    } else {
        res.status(406).send({
            message: `Cannot update PostcodePrice with id=${productID}. Maybe PostcodePrice was not found or req.body is empty!`
        });
    }



};

exports.findImage = async (req, res, next) => {
    const id = req.params.id;

    ImageProduct.findAll({where: {productID: id}})
        .then(data => {
            res.send(data);
        })
        .catch(next);
};

exports.createImage = async (req, res, next) => {

    let images = [], docImages = [];
    let body = req.body;
    docImages = req.files[process.env.INPUT_UPLOAD_IMAGES];
    if ("imageName" in body) {
        await ImageProduct.update({image: docImages[0].filename}, {where: {productID: body.productID, image: body.imageName}})
            .then((num) => {
                if (Number(num) >= 1) {
                    deleteImages(["./" + process.env.AVATAR_STORAGE + "/" + body.imageName]);
                    res.send({
                        message: "Image was replace successfully!",
                    });
                } else {
                    res.status(400).send({
                        message: `Cannot replace Image with range ids. Maybe Image was not found!`,
                    });
                }
            })
            .catch(next);
    } else {
        let bulkData = docImages.map((image) => {
            return {productID: Number(body.productID), image: image.filename};
        });

        await ImageProduct.bulkCreate(bulkData).then(() => {
            return res.status(200).json();
        }).catch(function (err) {
            destroyImages(docImages, images);
            return next(err);
        });
    }


};

exports.deleteImage = async (req, res, next) => {
    const productID = req.params.id;
    const image = req.params.name;

    ImageProduct.destroy({where: {productID, image}})
        .then((num) => {
            if (Number(num) >= 1) {
                deleteImages(["./" + process.env.AVATAR_STORAGE + "/" + image]);
                res.send({
                    message: "Image was deleted successfully!",
                });
            } else {
                res.status(400).send({
                    message: `Cannot delete Image with range ids. Maybe Image was not found!`,
                });
            }
        })
        .catch(next);
};

// get a result of query products in frontend
exports.result = async (req, res, next) => {

    const slug = req.params.slug;
    const postcode = req.body?.postcode ?? null;
    let guestResult = null, ids, postCodeTxt;

    guestResult = await GuestResult.findOne({where: {resultUID: slug}});
    if (guestResult == null) {
        return res.status(400).send();
    } else {
        ids = guestResult.answerIDs.split(',');
        postCodeTxt = postcode ?? guestResult.postcode;
    }
    if (postCodeTxt == null) {
        return res.status(400).send();
    }

    Question.findAll({
        where: {id: ids, isQuestion: false}, attributes: ["dependenceType", "dependenceID"], raw: true
    })
        .then(async dependences => {

            if (dependences != null) {

                let fuelTypeID = [], showerSizeID = null, bathSizeID = null, typeIDs = [], priceIDs = [], sizeIDs = [];
                dependences.map((dependence) => {
                    if (dependence.dependenceType === 0) return;
                    if (dependence.dependenceType === 1) {
                        typeIDs.push(dependence.dependenceID);
                    } else if (dependence.dependenceType === 2) {
                        priceIDs.push(dependence.dependenceID);
                    } else if (dependence.dependenceType === 7) {
                        fuelTypeID = dependence.dependenceID;
                    } else if (dependence.dependenceType === 4) {
                        bathSizeID = dependence.dependenceID;
                    } else if (dependence.dependenceType === 5) {
                        showerSizeID = dependence.dependenceID;
                    } else {
                        sizeIDs.push(dependence.dependenceID);
                    }
                });

                let whereConditions = [{
                    boilerTypeID: typeIDs[typeIDs.length - 1], fuelTypeID: fuelTypeID, isActive: true
                }];
                if (bathSizeID !== null) {
                    whereConditions.push([Sequelize.where(Sequelize.literal('EXISTS (SELECT sizeID FROM ProductSizes WHERE productID = Product.id AND sizeID = ' + bathSizeID + ' )'), true)]);
                }
                if (showerSizeID !== null) {
                    whereConditions.push([Sequelize.where(Sequelize.literal('EXISTS (SELECT sizeID FROM ProductSizes WHERE productID = Product.id AND sizeID = ' + showerSizeID + ' )'), true)]);
                }

                Product.scope("withAllFields").findAll({
                    where: whereConditions,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'deletedAt'],
                        include: [[Sequelize.literal('(SELECT SUM(price) FROM priceProducts WHERE productID = Product.id AND priceID IN (' + priceIDs.concat(61) + ') )'), 'price'], [Sequelize.literal('(SELECT SUM(price) FROM priceProducts WHERE productID = Product.id AND priceID = 62 )'), 'discount'],]
                    }, include: [{model: Plan, required: true, attributes: ["planUID"], through: {model: ProductPlan, attributes: []}}, {
                        model: Size, required: true, attributes: ["id", "name"], through: {model: ProductSize, where: {sizeID: sizeIDs}, attributes: []},
                    }, {
                        model: Price,
                        required: true,
                        attributes: [],
                        where: {isActive: true},
                        through: {model: PriceProduct, attributes: [], where: {priceID: priceIDs.concat(61, 62)},}
                    }, {
                        model: Price,
                        attributes: ['id', 'name'],
                        where: {[Op.and]: [{isActive: true}, {isAdditionalType: true}]},
                        required: false,
                        through: {model: PriceProduct, attributes: ['price']}
                    }, {
                        model: Postcode, attributes: ['id'], required: false, limit: 1, separate: false, where: {
                            name: {
                                [Op.or]: [{[Op.and]: [Sequelize.where(Sequelize.fn('char_length', Sequelize.col('Postcodes.name')), 2), {[Op.startsWith]: postCodeTxt.slice(0, 2)}]}, {
                                    [Op.and]: [Sequelize.where(Sequelize.fn('char_length', Sequelize.col('Postcodes.name')), 1), {[Op.startsWith]: postCodeTxt.slice(0, 1)}, Sequelize.where(Sequelize.literal(Number(postCodeTxt.charAt(1)) >= 0), true)]
                                },]
                            }, type: {[Op.or]: [0, 2]}, isActive: true,
                        }, through: {model: PostcodePrice, attributes: ['price']}
                    },],
                })
                    .then(async boilers => {

                        if (boilers != null) {
                            return res.send({boilers, guestResult});
                        } else {
                            return res.status(404).send();
                        }


                    })
                    .catch(next);
            } else {
                return res.status(404).send();
            }


        })
        .catch(next);


};

// Update a Product by the id in the request
exports.update = async (req, res, next) => {

    let file = null, filePath;
    if (req.file != null && req.file) {
        file = req.file;
        if (file) filePath = "./" + process.env.AVATAR_STORAGE + "/" + file.filename;
    }

    // check validation
    try {
        const {errors, isValid} = checkValidation(req, "Product");
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
        await Product.findByPk(id)
            .then(async data => {

                let imageName = data.image;
                if (imageName != null) {
                    const imagePath = "./" + process.env.AVATAR_STORAGE + "/" + imageName;
                    deleteImages([imagePath]);
                }
            })
            .catch(next);

    }

    await Product.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                Product.findByPk(id)
                    .then(async product => {
                        if ("planIDs" in body) {
                            let bulkData = body.planIDs.split(',').map((id) => {
                                return {productID: product.id, planID: Number(id)};
                            });
                            await ProductPlan.destroy({where: {productID: product.id}})
                            await ProductPlan.bulkCreate(bulkData);
                        }
                        res.status(200).send(product);
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

// Delete a Product with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await Product.restore({where: {id: arrIDs}})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update Product with ids. Maybe Product was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            const data = await Product.findAll({
                where: {id: arrIDs}, attributes: ["id", "image"], raw: true, paranoid: false,
            });
            await Product.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        let images = [], arrIDs = [];
                        data.map((row) => {
                            images.push("./" + process.env.AVATAR_STORAGE + "/" + row.image);
                            arrIDs.push(row.id);
                        });
                        deleteImages(images);
                        res.send({
                            message: "Product was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Product with range ids. Maybe Product was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await Product.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Product with range ids. Maybe Product was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};


function destroyImages(docImages, images) {
    docImages.map((image) => images.push("./" + (process.env.AVATAR_STORAGE + "/" + image.filename)));
    deleteImages(images);
}
