const {checkValidation, deleteFromBody} = require("../services/globalFunction");
const {Coupon, CouponProduct, Product} = require("../../models");
const {Op} = require("sequelize");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";

    Coupon.findAll({
        order: [['createdAt', 'DESC']],
        paranoid: isShowDeleted,
        include: [{model: Product, attributes: ["id"], through: {model: CouponProduct, attributes: []}}],

    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};

exports.apply = async (req, res, next) => {
    const slug = req.params.slug;
    const productID = req.params.productID;
    const currentDate = new Date().toLocaleDateString('en-CA');

    Coupon.findOne({
        where: {code: slug, isActive: true, expire: {[Op.gt]: currentDate}},
        attributes: ["isPercent", "value"],
        include: [{model: Product, attributes: [], through: {model: CouponProduct, attributes: [], where: {productID}}}],
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};


// Create and Save a new Coupon
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Coupon");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = req.body;

    await Coupon.create({
        code: body.code, value: body.value, expire: body.expire, isPercent: body.isPercent, isActive: body.isActive,
    })
        .then(async coupon => {

            if ("productIDs" in body && body.productIDs !== "null" && body.productIDs !== "") {

                let bulkData = body.productIDs.map((id) => {
                    return {productID: id, couponID: coupon.id};
                });
                if (bulkData.length > 0) {
                    await CouponProduct.bulkCreate(bulkData);
                }
            }
            res.send();

            })
            .catch(next);

};

// Update a Coupon by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Coupon");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await Coupon.update(body, {where: {id}})
        .then(async num => {
            if (Number(num) === 1) {
                if ("productIDs" in body && body.productIDs !== "null" && body.productIDs !== "") {
                    await CouponProduct.destroy({where: {couponID: id}});

                    let bulkData = [];
                    bulkData = body.productIDs.map((e) => {
                        return {productID: e, couponID: id};
                    });

                    if (bulkData.length > 0) {
                        await CouponProduct.bulkCreate(bulkData);
                    }

                }
                res.status(200).send();

            } else {
                res.status(406).send({
                    message: `Cannot update Coupon with id=${id}. Maybe Coupon was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete a Coupon with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await Coupon.restore({where: {id: arrIDs}})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update Coupon with ids. Maybe Coupon was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            await Coupon.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.send({
                            message: "Coupon was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Coupon with range ids. Maybe Coupon was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await Coupon.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Coupon with range ids. Maybe Coupon was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};


