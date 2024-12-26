const {deleteFromBody, checkValidation, deleteImages} = require("../../services/globalFunction");
const {Profile, PostcodeProfile, ProfileSkill, Skill, Postcode, ImageProfile, User, NoteProfile} = require("../../../models");
const fs = require("fs");
const path = require("path");
const {sendMail} = require("../../../helpers/SendMail");
const {isHaveRole, isHavePermission} = require("../../middlewares/roleAccessControl");


// Find a single Tutorial with an id
exports.show = async (req, res, next) => {

    const id = (req.params.id && req.params.id !== 0 && isHaveRole(req.roles, 'admin')) ? req.params.id : req.userID;

    Profile.findOne({
        where: {userID: id}, order: [['createdAt', 'DESC']], include: [{model: Skill, attributes: ["id"], through: {model: ProfileSkill, attributes: []}}, {
            model: Postcode, attributes: ["id"], through: {model: PostcodeProfile, attributes: []}
        }, {model: ImageProfile, attributes: ["imageTypeID", "image", "expire"]}, {model: NoteProfile, attributes: ["id", "title", "body", "createdAt"]}],

    }).then(data => {
        res.send(data);
    })
        .catch(next);


};


// Create and Save a new Profile
exports.create = async (req, res, next) => {

    const file = req.file;
    const filePath = "./" + process.env.AVATAR_STORAGE + "/" + file.filename;

    // check validation
    try {
        const {errors, isValid} = checkValidation(req, "Profile");
        if (!isValid) {
            deleteImages([filePath]);
            return res.status(400).json(errors);
        }
    } catch (e) {
        deleteImages([filePath]);
        return res.status(400).json();
    }

    let body = req.body;

    await Profile.create({
        userID: req.userID,
        image: file?.filename,
        companyName: body.companyName,
        companyGasNumber: body.companyGasNumber,
        companyLicenseNumber: body.companyLicenseNumber,
        companyAddress1: body.companyAddress1,
        companyAddress2: body.companyAddress2,
        companyCity: body.companyCity,
        companyPostcode: body.companyPostcode,
        isLimitedCompany: body.isLimitedCompany,
        isVatRegistered: body.isVatRegistered,
        companyNumber: Number(body.companyNumber),
        vatNumber: Number(body.vatNumber),
        accountName: body.accountName,
        accountCode: body.accountCode,
        accountNumber: body.accountNumber,
        houseNumber: body.houseNumber,
        isActive: false,
    })
        .then(async profile => {
            return res.send(profile);
        })
        .catch(function (err) {
            deleteImages([filePath]);
            return next(err);
        });


};

// Update a Profile by the id in the request
exports.approve = async (req, res, next) => {

    const id = req.params.id;

    await Profile.update({isActive: req.body.isActive}, {where: {userID: id}})
        .then(async num => {
            if (Number(num) === 1) {
                res.status(200).send();
                const user = await User.scope('withEmail').findByPk(id);
                await sendMail(1, user.email, user.name);

            } else {
                return res.status(406).send({
                    message: `Cannot update Profile . Maybe it was not found or req.body is empty!`
                });
            }
        }).catch(next);

};

// Update a Profile by the id in the request
exports.update = async (req, res, next) => {

    let file = null, filePath;
    if (req.file != null && req.file) {
        file = req.file;
        if (file) filePath = "./" + process.env.AVATAR_STORAGE + "/" + file.filename;
    }

    // check validation
    try {
        const {errors, isValid} = checkValidation(req, "Profile");
        if (!isValid) {
            if (file) deleteImages([filePath]);
            return res.status(400).json(errors);
        }
    } catch (e) {
        if (file) deleteImages([filePath]);
        return res.status(400).json();
    }

    let body = deleteFromBody(req.body);
    const id = (isHaveRole(req.roles, "admin")) ? req.params.id : req.userID;

    if (file !== null) {

        body["image"] = file.filename;
        await Profile.findOne({where: {userID: id}})
            .then(async data => {

                let imageName = data.image;
                if (imageName != null) {
                    const imagePath = "./" + process.env.AVATAR_STORAGE + "/" + imageName;
                    deleteImages([imagePath]);
                }
            })
            .catch(function (err) {
                if (file) deleteImages([filePath]);
                return next(err);
            });

    }

    await Profile.update(body, {where: {userID: id}})
        .then(async num => {
            if (Number(num) === 1) {
                res.status(200).send();

            } else {
                if (file) deleteImages([filePath]);
                return res.status(406).send({
                    message: `Cannot update Profile . Maybe it was not found or req.body is empty!`
                });
            }
        })
        .catch(function (err) {
            if (file) deleteImages([filePath]);
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

