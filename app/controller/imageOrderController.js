const {deleteFromBody, checkValidation, deleteImages} = require("../services/globalFunction");
const {ImageOrder, Order} = require("../../models");

const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const {sendMail} = require("../../helpers/SendMail");

exports.findAll = async (req, res, next) => {

    ImageOrder.findAll({
        order: [['createdAt', 'DESC']]
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};


// Create and Save a new Profile
exports.create = async (req, res, next) => {

    let images = [], docIDS = [], statusImages = [], docTitles = [], docImages = [], docNames = [], bulkData = [];
    let body = req.body;

    if ("docTitles" in body) {
        docTitles = body.docTitles.split(",");
    }
    if ("docIDS" in body) {
        docIDS = body.docIDS.split(",");
        statusImages = body.statusImages.split(",");
        docNames = body.docNames.split(",");
        if (req.files && process.env.INPUT_UPLOAD_IMAGES in req.files) docImages = req.files[process.env.INPUT_UPLOAD_IMAGES];
    }

    // check validation
    // try {
    //     const {errors, isValid} = checkValidation(req, "ImageOrder");
    //     if (!isValid) {
    //         destroyImages(docImages, images);
    //         return res.status(400).json(errors);
    //     }
    // } catch (e) {
    //     destroyImages(docImages, images);
    //     return res.status(400).json();
    // }

    if (docIDS.length > 0) {


        let transIndex = 0;

        docIDS.map(async (galleryID, i) => {
            if (Number(statusImages[i]) === 2) transIndex--;
            let galleryImage = docImages.find((e) => e.originalname === docNames[i + transIndex]);

            if (Number(statusImages[i]) === 1 && galleryImage) {
                bulkData.push({orderID: body.orderID, imageTypeID: Number(galleryID), image: galleryImage.filename, title: docTitles[i] ?? null});
            } else if (Number(statusImages[i]) === 2 || Number(statusImages[i]) === 3) {
                const whereCondition = {where: {orderID: body.orderID, imageTypeID: Number(galleryID)}};
                await ImageOrder.findOne(whereCondition)
                    .then(async data => {
                        if (data != null) {

                            let imageName = data.image;
                            if (imageName != null) {
                                const file_extension = imageName.slice(((imageName.lastIndexOf('.') - 1) >>> 0) + 2);
                                const imagePath = "./" + ((_.includes(["pdf"], file_extension)) ? process.env.FILE_STORAGE : process.env.AVATAR_STORAGE) + "/" + imageName;
                                deleteImages([imagePath]);
                            }

                            if (Number(statusImages[i]) === 3 && galleryImage) {
                                let cols = {image: galleryImage.filename};
                                await ImageOrder.update(cols, whereCondition);
                            } else {
                                await ImageOrder.destroy(whereCondition)
                            }
                        }
                    });
            }

            // if (galleryImage || docNames[i] === "") {
            //     console.log(docNames[i] === "");
            //     console.log(galleryImage);
            //     const whereCondition = {where: {orderID: body.orderID, imageTypeID: Number(galleryID)}};
            //     await ImageOrder.findOne(whereCondition)
            //         .then(async data => {
            //             console.log(data);
            //             if (data != null) {
            //
            //                 let imageName = data.image;
            //                 if (imageName != null) {
            //                     const file_extension = imageName.slice(((imageName.lastIndexOf('.') - 1) >>> 0) + 2);
            //                     const imagePath = "./" + ((_.includes(["pdf"], file_extension)) ? process.env.FILE_STORAGE : process.env.AVATAR_STORAGE) + "/" + imageName;
            //                     deleteImages([imagePath]);
            //                     console.log(imagePath);
            //                 }
            //
            //                 if (galleryImage) {
            //                     let cols = {image: galleryImage.filename};
            //                     await ImageOrder.update(cols, whereCondition);
            //                 } else {
            //                     await ImageOrder.destroy(whereCondition)
            //                 }
            //             }
            //         });
            //
            // } else if (docImages[i] && docImages[i] !== "") {
            //     bulkData.push({orderID: body.orderID, imageTypeID: Number(galleryID), image: docImages[i].filename, title: docTitles[i] ?? null});
            //     console.log(bulkData);
            // }
        });

        if (bulkData.length > 0) await ImageOrder.bulkCreate(bulkData);


        if (body.isSaveMode === 'false') {
            await Order.update({"imageEvidenceStatus": 0}, {where: {id: body.orderID}});
        }

            res.status(200).json();
            if ("isCustomerImage" in body) await sendMail(8, process.env.SENDMAIL_FROM, "Admin");

    } else {
            destroyImages(docImages, images);
        return res.status(400).json();
    }

};

// Find a single Tutorial with an id
exports.show = async (req, res, next) => {

    const id = req.params.id;

    await ImageOrder.findAll({
        where: {orderID: id},
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};

// Update a Profile by the id in the request
exports.update = async (req, res, next) => {

    let images = [], docIDS = [], docImages = [], docNames = [];
    let body = req.body;
    if ("docIDS" in body) {
        docIDS = body.docIDS.split(",");
        docNames = body.docNames.split(",");
        if (req.files) docImages = req.files[process.env.INPUT_UPLOAD_IMAGES];
    }

    // check validation
    // try {
    //     const {errors, isValid} = checkValidation(req, "ImageOrder");
    //     if (!isValid) {
    //         destroyImages(docImages, images);
    //         return res.status(400).json(errors);
    //     }
    // } catch (e) {
    //     destroyImages(docImages, images);
    //     return res.status(400).json();
    // }


    docIDS.map(async (galleryID, i) => {

        if (docNames[i] && docNames[i] !== "") {
            let galleryImage = docImages.find((e) => e.originalname === docNames[i]);

            if (galleryImage) {
                await ImageOrder.findOne({where: {orderID: body.orderID, imageTypeID: Number(galleryID)}})
                    .then(async data => {

                        if (data != null) {

                            let imageName = data.image;
                            if (imageName != null) {
                                const file_extension = imageName.slice(((imageName.lastIndexOf('.') - 1) >>> 0) + 2);
                                const imagePath = "./" + ((_.includes(["pdf"], file_extension)) ? process.env.FILE_STORAGE : process.env.AVATAR_STORAGE) + "/" + imageName;
                                deleteImages([imagePath]);
                            }

                            let cols = {image: galleryImage.filename};


                            await ImageOrder.update(cols, {where: {orderID: body.orderID, imageTypeID: Number(galleryID)}});
                        }


                    });

            }
        }
    });

    if (body.isSaveMode === 'false') {
        await Order.update({"imageEvidenceStatus": 0}, {where: {id: body.orderID}});
    }

    return res.status(200).json();


};

// Delete a Profile with the specified id in the request
exports.delete = async (req, res, next) => {

    const id = req.params.id;
    const imageOrder = await ImageOrder.findByPk(id, {attributes: ["image", "imageTypeID"], paranoid: false,});
    await ImageOrder.destroy({where: {id}})
        .then((num) => {
            if (Number(num) >= 1) {
                // req.app.get("socketIO").emit("destroyCity", data);
                res.send({
                    message: "Data was deleted successfully!",
                });
                if (imageOrder != null) {

                    let imageName = imageOrder.image;
                    if (imageName != null) {
                        let imagePath = null;
                        if (imageOrder.imageTypeID === process.env.IMAGE_TYPE_ID) {
                            imagePath = "./" + process.env.INVOICE_STORAGE + "/" + imageName;
                        } else {
                            const file_extension = imageName.slice(((imageName.lastIndexOf('.') - 1) >>> 0) + 2);
                            imagePath = "./" + ((_.includes(["pdf"], file_extension)) ? process.env.FILE_STORAGE : process.env.AVATAR_STORAGE) + "/" + imageName;
                        }
                        deleteImages([imagePath]);
                    }
                }

            } else {
                res.status(400).send({
                    message: `Cannot delete Data with range ids. Maybe Data was not found!`,
                });
            }
        })
        .catch(next);


};

function destroyImages(docImages, images) {
    docImages.map((image) => images.push("./" + ((_.includes([".pdf", "application/pdf"], image.mimetype) ? process.env.FILE_STORAGE : process.env.AVATAR_STORAGE) + "/" + image.filename)));
    deleteImages(images);
}

