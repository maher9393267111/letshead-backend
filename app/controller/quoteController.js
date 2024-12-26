const {checkValidation, deleteFromBody} = require("../services/globalFunction");
const {
    Quote, QuoteQuestion, Question, Product, Price, PriceProduct, Postcode, PostcodePrice, Order, Manufacturer, User, OrderQuestion
} = require("../../models");
const {Op, Sequelize} = require("sequelize");
const {sendMail} = require("../../helpers/SendMail");
const axios = require("axios");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";
    Quote.findAll({
        order: [['createdAt', 'DESC']],
        paranoid: isShowDeleted,
        include:[{model: Product,attributes:['name']},{model: QuoteQuestion}]
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};


// Create and Save a new Quote
exports.create = async (req, res, next) => {

    // const {errors, isValid} = checkValidation(req, "Quote");
    // if (!isValid) {
    //     return res.status(400).json(errors);
    // }

    try {


    const body = req.body;
        const postCodeTxt = body.subPostcode;
        const productID = body.productID;
        let product;
        if (productID && productID !== "") {
            product = await Question.findAll({
                where: {id: body.answerIDs, isQuestion: false}, attributes: ["dependenceType", "dependenceID"], raw: true
            }).then(async dependences => {

                if (dependences != null) {


                    let priceIDs = [];
                    dependences.map((dependence) => {
                        if (dependence.dependenceType === 2) {
                            priceIDs.push(dependence.dependenceID);
                        }
                    });

                    return await Product.findOne({
                        where: {id: Number(body.productID), isActive: true}, attributes: {
                            exclude: ['createdAt', 'updatedAt', 'deletedAt'],
                            include: [[Sequelize.literal('(SELECT SUM(price) FROM priceProducts WHERE productID = Product.id AND priceID IN (' + priceIDs.concat(61) + ') )'), 'price'], [Sequelize.literal('(SELECT SUM(price) FROM priceProducts WHERE productID = Product.id AND priceID = 62 )'), 'discount'],]
                        }, include: [{
                            model: Price, required: true, attributes: [], where: {isActive: true}, through: {
                                model: PriceProduct, attributes: [], where: {priceID: priceIDs.concat(61, 62)},
                            }
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

            if (product != null) {

                body["postcodePrice"] = (("Postcodes" in product) && Number(product.Postcodes.length > 0) ? product.Postcodes[0].PostCodePrice.price : 0);
                body["productTotalPrice"] = Number(product.get('price')) - Number(product.get('discount'));
            } else {
                return res.status(400).send({
                    message: 'The data sent by client is invalid'
                });
            }
        }


        let date = new Date();
        date.setDate(date.getDate() + 10);

        await Quote.create({
            email: body.email, phoneNumber: body.phone, name: body.name, lastName: body.lastName, productID: productID, uuid: body.slug,
            productTotalPrice: body.productTotalPrice,
            subPostcode: body.subPostcode,
            postcodePrice: body.postcodePrice,
            expiredAt: date.toISOString().split("T")[0],
        })
            .then(async quote => {

                if (body.answerIDs != null) {

                    const questions = await Question.findAll({
                        where: {id: body.answerIDs, isActive: true}, include: [{model: Question, as: 'Parent'}],
                    });

                    if (questions != null) {
                        let bulkData = [];
                        bulkData = questions.map((e) => {
                            return {
                                quoteID: quote.id, questionID: e.Parent.id, answerID: e.id,
                            };
                        });
                        if (bulkData.length > 0) await QuoteQuestion.bulkCreate(bulkData);
                    }
                }

                res.send({quoteID: quote.id, name: quote.name});
                await generateEmailQuote(quote.id);


            })
            .catch(next);
    } catch (error) {
        console.error(error);
        res.status(error.statusCode).json({message: error.message});
    }

};

// Find a single Tutorial with an id
exports.show = async (req, res, next) => {

    const id = req.params.id;

    await Quote.findAll({
        where: {orderID: id}
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};


// Update a Quote by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Quote");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await Quote.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                Quote.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                res.status(406).send({
                    message: `Cannot update Quote with id=${id}. Maybe Quote was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete a Quote with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await Quote.restore({where: {id: arrIDs}, individualHooks: true})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update Quote with ids. Maybe Quote was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            await Quote.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.send({
                            message: "Quote was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Quote with range ids. Maybe Quote was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await Quote.destroy({where: {id: arrIDs}, force: isForce, individualHooks: true})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Quote with range ids. Maybe Quote was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};



async function generateEmailQuote(id) {
    const quote = await Quote.findByPk(id, {
        include: [{
            model: Product, attributes: ['id', 'image', 'name'], include: [{model: Manufacturer, attributes: ['name']}]
        }]
    });
    const data = {
        id: quote.id,
        createdAt: new Date(quote.createdAt).toLocaleDateString(),
        installDate: quote.installDate,
        total: quote.productTotalPrice + quote.postcodePrice,
        boilerPrice: quote.productTotalPrice,
        customerEmail: quote.email,
        customerPhone: quote.phoneNumber,
        customerFirstName: quote.name,
        customerLastName: quote.lastName,
        expiredAt: quote.expiredAt,
        boilerID: quote.productID,
        manufactureName: quote.Product?.Manufacturer.name,
        boilerName: quote.Product?.name,
        boilerImage: process.env.URL_PATH_BOILER_IMAGE + quote.Product?.image,
        boilerUrl: process.env.URL_PATH_BOILER_DETAILS + quote.uuid,
        resultUrl: process.env.URL_PATH_BOILER_RESULTS + quote.uuid,
    };

    const apiUrl = process.env.HIGH_LEVEL_URL_EMAIL_QUOTE;

    try {
        await axios.post(apiUrl, data);
    } catch (error) {
        console.log(error);
    }
}






