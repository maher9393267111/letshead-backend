const {deleteFromBody, checkValidation, deleteImages} = require("../../services/globalFunction");
const {Profile, PostcodeProfile, ProfileSkill, Skill, Postcode, ImageProfile,} = require("../../../models");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");


// Create and Save a new Profile
exports.create = async (req, res, next) => {

    let images = [], docIDS = [], docExpires = [], docImages = [];
    let body = req.body;
    if ("docIDS" in body) {
        docIDS = body.docIDS.split(",");
        docExpires = body.docExpires.split(",");
        docImages = req.files[process.env.INPUT_UPLOAD_IMAGES];
    }

    // // check validation
    // try {
    //     const {errors, isValid} = checkValidation(req, "ImageProfile");
    //     if (!isValid) {
    //         destroyImages(docImages, images);
    //         return res.status(400).json(errors);
    //     }
    // } catch (e) {
    //     destroyImages(docImages, images);
    //     return res.status(400).json();
    // }

    await Profile.findOne({where: {userID: req.userID}})
        .then(async profile => {
            if (profile != null) {

                if (docIDS.length > 0) {
                    let bulkData = docIDS.map((galleryID, i) => {
                        return {profileID: profile.id, imageTypeID: Number(galleryID), image: docImages[i].filename, expire: docExpires[i]};
                    });

                    await ImageProfile.bulkCreate(bulkData).then(() => {
                        return res.status(200).json();
                    }).catch(function (err) {
                        destroyImages(docImages, images);

                        return next(err);
                    });
                }
            } else {
                destroyImages(docImages, images);
                return res.status(400).json();

            }

        }).catch(function (err) {
            destroyImages(docImages, images);
            return next(err);
        });


};

// Update a Profile by the id in the request
exports.update = async (req, res, next) => {

    let images = [], docIDS = [], docExpires = [], docImages = [], docNames = [];
    let body = req.body;
    if ("docIDS" in body) {
        docIDS = body.docIDS.split(",");
        docNames = body.docNames.split(",");
        docExpires = body.docExpires.split(",");
        if (req.files) docImages = req.files[process.env.INPUT_UPLOAD_IMAGES];
    }

    // // check validation
    // try {
    //     const {errors, isValid} = checkValidation(req, "Profile");
    //     if (!isValid) {
    //         destroyImages(docImages, images);
    //         return res.status(400).json(errors);
    //     }
    // } catch (e) {
    //     destroyImages(docImages, images);
    //     return res.status(400).json();
    // }

    await Profile.findOne({where: {userID: req.userID}})
        .then(async profile => {
            if (profile != null) {

                docIDS.map(async (galleryID, i) => {

                    if (docNames[i] && docNames[i] !== "") {
                        let galleryImage = docImages.find((e) => e.originalname === docNames[i]);

                        if (galleryImage) {
                            await ImageProfile.findOne({where: {profileID: profile.id, imageTypeID: Number(galleryID)}})
                                .then(async data => {

                                    if (data != null) {

                                        let imageName = data.image;
                                        if (imageName != null) {
                                            const file_extension = imageName.slice(((imageName.lastIndexOf('.') - 1) >>> 0) + 2);
                                            const imagePath = "./" + ((_.includes(["pdf"], file_extension)) ? process.env.FILE_STORAGE : process.env.AVATAR_STORAGE) + "/" + imageName;
                                            deleteImages([imagePath]);
                                        }

                                        let cols = {image: galleryImage.filename};
                                        if (docExpires[i] !== "") {
                                            cols["expire"] = docExpires[i];
                                        }

                                        await ImageProfile.update(cols, {where: {profileID: profile.id, imageTypeID: Number(galleryID)}});
                                    }


                                });

                        }
                    } else {
                        await ImageProfile.update({expire: docExpires[i]}, {where: {profileID: profile.id, imageTypeID: Number(galleryID)}});
                    }

                    res.status(200).send();
                });
            } else {
                destroyImages(docImages, images);
                return res.status(400).json();
            }

        }).catch(function (err) {
            destroyImages(docImages, images);
            return next(err);
        });


};

// Delete a Profile with the specified id in the request
exports.delete = async (req, res, next) => {

    const id = req.params.id;

    await Profile.destroy({
        where: {id}
    })
        .then(num => {
            if (Number(num) === 1) {
                // req.app.get('socketIO').emit("destroyProfile", data);

                res.send({
                    message: "Profile was deleted successfully!"
                });

            } else {
                res.status(400).send({
                    message: `Cannot delete Profile with id=${id}. Maybe Profile was not found!`
                });
            }
        })
        .catch(next);


};

function destroyImages(docImages, images) {
    docImages.map((image) => images.push("./" + ((_.includes([".pdf", "application/pdf"], image.mimetype) ? process.env.FILE_STORAGE : process.env.AVATAR_STORAGE) + "/" + image.filename)));
    deleteImages(images);
}

