const {checkValidation, deleteFromBody, getFreeAddons, getDayName, deleteImages} = require("../services/globalFunction");
const {
    Order,
    Addon,
    AddressOrder,
    AddonOrder,
    InstallAnswer,
    InstallQuestion,
    ImageOrder,
    ImageType,
    OrderQuestion,
    AssignEngineer,
    AvailableInstallation,
    Coupon,
    Product,
    Price,
    PriceProduct,
    Postcode, PostcodePrice, Question, User, Manufacturer, NoteOrder, EmailOrder, Plan, CouponProduct, GuestResult,
} = require("../../models");
const {Sequelize, Op} = require("sequelize");
const {sendMail} = require("../../helpers/SendMail");
const {isHavePermission} = require("../middlewares/roleAccessControl");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";
    Order.findAll({
        include: [{model: AddressOrder, attributes: ['installPostcode']},],
        attributes: ['id', 'userID', 'installDate', 'type', 'status', 'createdAt', 'deletedAt'],
        order: [['createdAt', 'DESC']],
        paranoid: isShowDeleted,
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};


// Create and Save a new Order Manual
exports.manualCreate = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Order");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = req.body;

    if (Number(body.type) === 0 && isHavePermission(req.roles, "createManualOrders")) {
            Order.create({
            userID: body.userID,
            installDate: body.installDate,
            installPrice: body.installPrice,
            productID: body.productID,
            productTotalPrice: body.productTotalPrice,
            postcodePrice: body.postcodePrice,
            discount: body.discount ?? 0,
            tax: body.tax,
            total: body.productTotalPrice + Number(body.installPrice) + body.postcodePrice,
            subPostcode: body.subPostcode,
            type: body.type ?? 1,
            note: body.note,
        })
            .then(async order => {

                await AddressOrder.create({
                    orderID: order.id,
                    installLine1: body.installLine1,
                    installLine2: body.installLine2,
                    installCity: body.installCity,
                    installPostcode: body.installPostcode,
                    addressLine1: body.addressLine1,
                    addressLine2: body.addressLine2,
                    city: body.city,
                    postcode: body.postcode,
                    isSameInstall: body.isSameInstall,
                });

                let bulkData = [];
                if (body.addons) {
                    let totalAddons = 0;
                    bulkData = body.addons.map((e, index) => {
                        totalAddons = totalAddons + e.total;
                        return {
                            orderID: order.id, addonID: e.addon.id, price: e.addon.price, amount: e.number, total: e.total,
                        };
                    });

                    if (bulkData.length > 0) {
                        await AddonOrder.bulkCreate(bulkData);
                        await order.increment('total', {by: totalAddons});
                        await order.reload();
                    }

                }

                if (body.answerIDs != null) {
                    const questions = await Question.findAll({
                        where: {id: body.answerIDs, isActive: true}, attributes: ['id'], include: [{model: Question, as: 'Parent'}],
                    });

                    if (questions != null) {
                        bulkData = [];
                        bulkData = questions.map((e) => {
                            return {
                                orderID: order.id, questionID: e.Parent.id, answerID: e.id,
                            };
                        });
                        if (bulkData.length > 0) await OrderQuestion.bulkCreate(bulkData);
                    }
                }

                res.send();
                await generateEmail(order.id);

            })
            .catch(next);

    } else {
        res.status(400).send({
            message: 'The data sent by admin is invalid'
        });
    }

};

// Create and Save a new Order Automatic
exports.automaticCreate = async (req, res, next) => {
    try {
        const slug = req.params.slug;
        const guestResult = await GuestResult.findOne({where: {resultUID: slug}});
        if (guestResult == null) {
            return res.status(400).send();
        }

        const postCodeTxt = guestResult.postcode;


        const selectedEvent = guestResult.event;
        const event = await AvailableInstallation.findByPk(selectedEvent.id);

        const product = await Question.findAll({
            where: {id: guestResult.answerIDs.split(','), isQuestion: false},
            attributes: ["dependenceType", "dependenceID"],
            raw: true
        }).then(async dependences => {

            if (dependences != null) {

                let priceIDs = [];
                dependences.map((dependence) => {
                    if (dependence.dependenceType === 2) {
                        priceIDs.push(dependence.dependenceID);
                    }
                });

                return await Product.findOne({
                    where: {id: guestResult.productID, isActive: true}, attributes: {
                        exclude: ['createdAt', 'updatedAt', 'deletedAt'],
                        include: [[Sequelize.literal('(SELECT SUM(price) FROM priceProducts WHERE productID = Product.id AND priceID IN (' + priceIDs.concat(61) + ') )'), 'price'], [Sequelize.literal('(SELECT SUM(price) FROM priceProducts WHERE productID = Product.id AND priceID = 62 )'), 'discount'],]
                    }, include: [{
                        model: Price, required: true, attributes: [], where: {isActive: true}, through: {
                            model: PriceProduct, attributes: [], where: {priceID: priceIDs.concat(61, 62)},
                        }
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
                            }, type: {[Op.or]: [0, 2]}
                        }, through: {model: PostcodePrice, attributes: ['price']}
                    }],
                });
            } else {
                return null;
            }
        }).catch(() => {
            return null;
        });


        if (event != null && product != null) {

            let coupon = null, couponPrice = 0, finalTotal, additionalPowerPrice = 0;
            let additionalPrice = guestResult.additionalPrice;
            if (additionalPrice != null) {
                additionalPrice = product.Prices.find((e) => e.id === additionalPrice.id);
                if (additionalPrice != null) {
                    additionalPowerPrice = additionalPrice.PriceProduct.price;
                }
            }

            const productDiscount = Number(product.get('discount') ?? 0);
            const installDate = event.startDate;
            const installPrice = Number(event.price ?? 0);
            const postcodePrice = Number(product.Postcodes.length > 0 ? product.Postcodes[0].PostCodePrice.price : 0);
            const productTotalPrice = Number(product.get('price')) - productDiscount;
            finalTotal = productTotalPrice + installPrice + postcodePrice + additionalPowerPrice;

            const paymentInfo = guestResult.payment;
            if (paymentInfo.couponSlug != null) {
                const currentDate = new Date().toLocaleDateString('en-CA');
                coupon = await Coupon.findOne({
                    where: {code: paymentInfo.couponSlug, isActive: true, expire: {[Op.gt]: currentDate}},
                    attributes: ["isPercent", "value"],
                    include: [{model: Product, attributes: [], through: {model: CouponProduct, attributes: [], where: {productID: product.id}}}],
                });

                if (coupon != null) {
                    couponPrice = Number(coupon.isPercent === true ? (finalTotal * (coupon.value / 100)) : coupon.value);
                }
            }

            let planID;
            if (paymentInfo.planID) {
                const plan = await Plan.findOne({where: {planUID: paymentInfo.planID}});
                if (plan) {
                    planID = plan.id;
                }
            }

            finalTotal = finalTotal - couponPrice;
            await Order.create({
                userID: req.userID,
                couponID: coupon != null ? coupon.id : null,
                couponPrice: couponPrice,
                installDate: installDate,
                installPrice: installPrice,
                productID: guestResult.productID,
                productTotalPrice: productTotalPrice,
                postcodePrice: postcodePrice,
                discount: productDiscount,
                tax: paymentInfo.tax,
                total: finalTotal,
                subPostcode: postCodeTxt,
                type: paymentInfo.type ?? 1,
                note: guestResult.address.note, planID: planID, additionalPrice: additionalPrice,
                status: (Number(paymentInfo.type) === 5 && Number(paymentInfo.status) === 5) ? 5 : 0,
            })
                .then(async order => {
                    const selectedAddress = guestResult.address;

                    await AddressOrder.create({
                        orderID: order.id,
                        installLine1: selectedAddress.installLine1,
                        installLine2: selectedAddress.installLine2,
                        installCity: selectedAddress.installCity,
                        installPostcode: selectedAddress.installPostcode,
                        addressLine1: selectedAddress.addressLine1,
                        addressLine2: selectedAddress.addressLine2,
                        city: selectedAddress.city,
                        postcode: selectedAddress.postcode,
                        isSameInstall: selectedAddress.isSameInstall,
                    });

                    let addonIDs = [], addonAmounts = [];
                    const selectedAddons = guestResult.addons;
                    selectedAddons.map(e => {
                        addonIDs.push(e.id);
                        addonAmounts.push(e.amount);
                    });

                    let bulkData = [];
                    if (addonIDs.length > 0) {
                        let totalAddons = 0;
                        let addonTotal = 0;
                        const addons = await Addon.findAll({
                            where: {id: addonIDs}, attributes: ['price'], order: Sequelize.literal("FIELD(id," + addonIDs.join(',') + ")")
                        });
                        if (addons != null) {
                            bulkData = selectedAddons.map((e, index) => {
                                addonTotal = addons[index].price * addonAmounts[index];
                                totalAddons = totalAddons + addonTotal;
                                return {
                                    orderID: order.id, addonID: e.id, price: addons[index].price, amount: addonAmounts[index], total: addonTotal,
                                };
                            });

                            if (bulkData.length > 0) {
                                await AddonOrder.bulkCreate(bulkData);
                                await order.increment('total', {by: totalAddons});
                                await order.reload();
                            }
                        }

                    }

                    if (guestResult.answerIDs != null) {

                        const questions = await Question.findAll({
                            where: {id: guestResult.answerIDs.split(','), isActive: true}, attributes: ['id'], include: [{model: Question, as: 'Parent'}],
                        });

                        if (questions != null) {
                            bulkData = [];
                            bulkData = questions.map((e) => {
                                return {
                                    orderID: order.id, questionID: e.Parent.id, answerID: e.id,
                                };
                            });
                            if (bulkData.length > 0) await OrderQuestion.bulkCreate(bulkData);
                        }
                    }

                    res.send({id: order.id, orderID: order.uuid, name: product.name, quantity: 1, price: order.total});

                    await guestResult.destroy();
                    await generateEmail(order.id);

                })
                .catch(next);
        } else {
            res.status(400).send({
                message: 'The data sent by client is invalid'
            });
        }
    } catch (e) {
        return res.status(400).json('Something wrong in processing data ... try again later');
    }

};

// Find a single Order with an id
exports.show = async (req, res, next) => {

    const id = req.params.id;

    Order.findOne({
        where: {id}, include: [AddressOrder, AddonOrder, OrderQuestion, AssignEngineer, NoteOrder, EmailOrder, {
            model: InstallAnswer, include: [{model: InstallQuestion, attributes: ['name', 'isPreInstall', 'type']},]
        }, {
            model: ImageOrder, include: [{model: ImageType, attributes: ['parentID']},]
        }, {
            model: Plan,  attributes: ['name'],
        }],

        order: [['createdAt', 'DESC']],
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};

// Update an Order by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Order");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await Order.update(body, {where: {id}}) // some field sent by another name must be renamed to be same name of columns in database
        .then(num => {
            if (Number(num) === 1) {

                Order.findByPk(id)
                    .then(async order => {
                        if (("preQuestionStatus" in body) || ("postQuestionStatus" in body) || ("imageEvidenceStatus" in body)) {
                            res.status(200).send(order);
                        } else {
                            await AddressOrder.update({
                                orderID: id,
                                installLine1: body.installLine1,
                                installLine2: body.installLine2,
                                installCity: body.installCity,
                                installPostcode: body.installPostcode,
                                addressLine1: body.addressLine1,
                                addressLine2: body.addressLine2,
                                city: body.city,
                                postcode: body.postcode,
                            }, {where: {orderID: id}});

                            await AddonOrder.destroy({where: {orderID: id}})

                            let bulkData = null;
                            bulkData = body.addons.map((data) => {
                                return {
                                    orderID: order.id, addonID: data.addon.id, price: data.addon.price, amount: data.number, total: data.total,
                                };
                            });
                            await AddonOrder.bulkCreate(bulkData);


                            await OrderQuestion.destroy({where: {orderID: id}})
                            bulkData = body.questions.map((question) => {
                                return {
                                    orderID: order.id, questionID: question.questionID, answerID: question.answerID,
                                };
                            });
                            await OrderQuestion.bulkCreate(bulkData);
                            res.status(200).send(order);
                        }


                    })
                    .catch(next);


            } else {
                res.status(406).send({
                    message: `Cannot update Order with id=${id}. Maybe Order was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete an Order with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await Order.restore({where: {id: arrIDs}})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update Order with ids. Maybe Order was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            await Order.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.send({
                            message: "Order was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Order with range ids. Maybe Order was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await Order.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Order with range ids. Maybe Order was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};


async function generateEmail(id) {
    const order = await Order.findByPk(id, {
        include: [{
            model: Product, attributes: ['id', 'image', 'name'], include: [{model: Manufacturer, attributes: ['name']}]
        }, {model: User, attributes: ['name', 'email']}, {
            model: AddonOrder, attributes: ['price', 'amount'], include: [{model: Addon, attributes: ['name']}]
        }, {
            model: AddressOrder, attributes: ['addressLine1', 'addressLine2', 'postcode', 'city',]
        }]
    });


    let addons = [];
    let addonTotal = 0;
    await order.AddonOrders.map((e, index) => {
        addons.push({name: e.Addon.name, price: e.price, amount: e.amount, total: Number(e.price) * Number(e.amount)});
        addonTotal = addonTotal + addons[index].total;
    });

    const subTotal = addonTotal + Number(order.productTotalPrice) + Number(order.installPrice) + Number(order.postcodePrice);
    const total = subTotal - Number(order.discount) - Number(order.couponPrice);

    const additionalPrice = order.additionalPrice;
    let prefixName = "";
    if (additionalPrice != null) {
        prefixName = additionalPrice.name;
    }
    const data = {
        id: order.id,
        createdAt: new Date(order.createdAt).toLocaleDateString(),
        manufactureName: order.Product.Manufacturer.name,
        name: order.User.name,
        email: order.User.email,
        subTotal: subTotal,
        discount: order.discount,
        couponPrice: Number(order.couponPrice),
        total: total,
        paymentType: order.type,
        invoiceItems: [{name: order.Product.name + prefixName, price: order.productTotalPrice, quantity: 1, priceTotal: order.productTotalPrice}],
        addons: addons,
        freeAddons: getFreeAddons(),
        withInstallPrice: order.installPrice > 0,
        installPrice: order.installPrice,
        installDate: order.installDate,
        installDateName: getDayName(new Date(order.installDate)),
        billingAddress: order.AddressOrder.addressLine1 + " " + order.AddressOrder.addressLine2,
        billingPostcode: order.AddressOrder.postcode,
        billingCity: order.AddressOrder.city,
        imageUploadUrl: process.env.URL_PATH_IMAGES_UPLOAD + order.uuid,
    };
    await sendMail(6, order.User.email, order.User.name, data);
    await sendMail(4, order.User.email, order.User.name, data);
}
