const {checkValidation, deleteFromBody, deleteImages} = require("../services/globalFunction");
const {Contact} = require("../../models");
const {sendMail} = require("../../helpers/SendMail");
const axios = require("axios");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";

    Contact.findAll({
        order: [['createdAt', 'DESC']], paranoid: isShowDeleted,
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};


// Create and Save a new Contact
exports.create = async (req, res, next) => {

    let file = null, filePath;
    if (req.file != null && req.file) {
        file = req.file;
        if (file) filePath = "./" + process.env.AVATAR_STORAGE + "/" + file.filename;
    }


    try {
        const {errors, isValid} = checkValidation(req, "Contact");
        if (!isValid) {
            if (file) deleteImages([filePath]);
            return res.status(400).json(errors);
        }
    } catch (e) {
        if (file) deleteImages([filePath]);
        return res.status(400).json();
    }

    const body = req.body;
    await Contact.create({
        name: body.name,
        subjectID: body.subjectID,
        enquiryID: body.enquiryID,
        phone: body.phone,
        email: body.email,
        address: body.address,
        postcode: body.postcode,
        body: body.body,
        isActive: body.isActive,
        image: file?.filename,
    })
        .then(async data => {
            res.send();
            const apiUrl = process.env.HIGH_LEVEL_URL_CONTACT;

            try {
                await axios.post(apiUrl, data);
            } catch (error) {
                console.log(error);
            }

            //  await sendMail(7, process.env.SENDMAIL_FROM, "Admin");
        })
        .catch(function (err) {
            if (file) deleteImages([filePath]);
            return next(err);
        });


};

// Update a Contact by the id in the request
exports.update = async (req, res, next) => {

    let file = null, filePath;
    if (req.file != null && req.file) {
        file = req.file;
        if (file) filePath = "./" + process.env.AVATAR_STORAGE + "/" + file.filename;
    }

    // check validation
    try {
        const {errors, isValid} = checkValidation(req, "Contact");
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
        await Contact.findByPk(id)
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
    await Contact.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                Contact.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
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
        await Contact.restore({where: {id: arrIDs}})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update Contact with ids. Maybe Contact was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            const data = await Contact.findAll({
                where: {id: arrIDs}, attributes: ["id", "image"], raw: true, paranoid: false,
            });
            await Contact.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        let images = [], arrIDs = [];
                        data.map((row) => {
                            images.push("./" + process.env.AVATAR_STORAGE + "/" + row.image);
                            arrIDs.push(row.id);
                        });
                        deleteImages(images);
                        res.send({
                            message: "Contact was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Contact with range ids. Maybe Contact was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await Contact.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Contact with range ids. Maybe Contact was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};

