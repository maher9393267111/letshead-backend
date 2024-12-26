const {checkValidation, deleteFromBody} = require("../services/globalFunction");
const {GuestResult, Coupon} = require("../../models");

exports.findOne = async (req, res, next) => {
    const slug = req.params.slug;

    GuestResult.findOne({where: {resultUID: slug}})
        .then(data => {
            if (data !== null && data !== undefined) {
                res.send(data);
            } else {
                res.status(404).send('Failed to find GuestResult');
            }

        })
        .catch(next);
};

// Create and Save a new
exports.create = async (req, res, next) => {

    // const {errors, isValid} = checkValidation(req, "GuestResult");
    // if (!isValid) {
    //     return res.status(400).json(errors);
    // }

    const body = req.body;
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 10);

    await GuestResult.create({
        answerIDs: body.answerIDs.join(","), sizeIDs: body.sizeIDs.join(","), lastPage: body.lastPage, expiredAt: expireDate,
    })
        .then(async data => {
            res.send(data);
        })
        .catch(next);


};

// Update a GuestResult by the id in the request
exports.update = async (req, res, next) => {

    // const {errors, isValid} = checkValidation(req, "City");
    // if (!isValid) {
    //     return res.status(400).json(errors);
    // }

    let body = deleteFromBody(req.body);
    const slug = req.params.slug;

    await GuestResult.update(body, {where: {resultUID: slug}})
        .then(num => {
            if (Number(num) === 1) {
                res.status(200).send();
            } else {
                res.status(406).send({message: `Cannot continue with slug=${slug}.`});
            }
        })
        .catch(next);

};


