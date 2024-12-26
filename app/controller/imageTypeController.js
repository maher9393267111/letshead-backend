const {checkValidation, deleteFromBody, deleteImages} = require("../services/globalFunction");
const {ImageType, ImageOrder, Order} = require("../../models");
const {Op} = require("sequelize");
const _ = require("lodash");
const {sendMail} = require("../../helpers/SendMail");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";

    ImageType.findAll({
        order: [['createdAt', 'DESC']], paranoid: isShowDeleted,

    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};

exports.findAllOrder = async (req, res, next) => {

    ImageType.findAll({
        where: {parentID: {[Op.in]: [0, 1]}, isActive: true}, attributes: ["id", "name", "parentID"], order: [['createdAt', 'DESC']]
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};

exports.findAllSubmitImagesType = async (req, res, next) => {

    const uuid = req.params.id;

    ImageType.findAll({
        where: {parentID: 0, isActive: true}, attributes: ["id", "name", "isRequired"], order: [['orderNum', 'ASC']]
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};


// Create and Save a new ImageType
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "ImageType");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    await ImageType.create({
        name: req.body.name, parentID: req.body.parentID, orderNum: req.body.orderNum, maxAllowed: req.body.maxAllowed, isActive: req.body.isActive,isRequired: req.body.isRequired,
    })
        .then(async data => {
            res.send();

        })
        .catch(next);


};

// Create and Save a new Profile
exports.createSubmit = async (req, res, next) => {

    let images = [], docIDS = [], docImages = [];
    let body = req.body;
    let id = req.params.id;

    if ("docIDS" in body) {
        docIDS = body.docIDS.split(",");
        if (req.files) docImages = req.files[process.env.INPUT_UPLOAD_IMAGES];
    }

    const order = await Order.findOne({where: {uuid: id, imageSubmitStatus: false}, attributes: ['id']});

    // check validation
    // try {
    //     const {errors, isValid} = checkValidation(req, "Profile");
    //     if (!isValid || order == null) {
    //         destroyImages(docImages, images);
    //         return res.status(order == null ? 202  : 400).json(errors);
    //     }
    // } catch (e) {
    //     destroyImages(docImages, images);
    //     return res.status(400).json();
    // }

    if (docIDS.length > 0) {

        let bulkData = docIDS.map((galleryID, index) => {
            return {orderID: order.id, imageTypeID: Number(galleryID), image: docImages[index].filename};
        });
        await ImageOrder.bulkCreate(bulkData).then(async (data) => {
            await Order.update({imageSubmitStatus: true}, {where: {id: order.id}});
            res.status(200).json();
            await sendMail(8, process.env.SENDMAIL_FROM, "Admin",{id:order.id});
        }).catch(function (err) {
            destroyImages(docImages, images);
            return next(err);
        });
    }

};


// Update a ImageType by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "ImageType");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await ImageType.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                ImageType.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                res.status(406).send({
                    message: `Cannot update ImageType with id=${id}. Maybe ImageType was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete an ImageType with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await ImageType.restore({where: {id: arrIDs}})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update ImageType with ids. Maybe ImageType was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            await ImageType.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.send({
                            message: "ImageType was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete ImageType with range ids. Maybe ImageType was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await ImageType.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete ImageType with range ids. Maybe ImageType was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};



function destroyImages(docImages, images) {
    docImages.map((image) => images.push("./" + ((_.includes([".pdf", "application/pdf"], image.mimetype) ? process.env.FILE_STORAGE : process.env.AVATAR_STORAGE) + "/" + image.filename)));
    deleteImages(images);
}

