const {checkValidation, deleteFromBody, deleteImages} = require("../services/globalFunction");
const {Question, Profile} = require("../../models");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";

    Question.findAll({
        order: [['createdAt', 'DESC']], paranoid: isShowDeleted,
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};

exports.show = async (req, res, next) => {

    Question.scope('userShow').findAll({
        where: {isActive: true}, order: [
            ['createdAt', 'DESC']
        ],
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};


// Create and Save a new Question
exports.create = async (req, res, next) => {

    let file = null, filePath;
    if (req.file != null && req.file) {
        file = req.file;
        if (file) filePath = "./" + process.env.AVATAR_STORAGE + "/" + file.filename;
    }

    // check validation
    try {
        const {errors, isValid} = checkValidation(req, "Question");
        if (!isValid) {
            if (file) deleteImages([filePath]);
            return res.status(400).json(errors);
        }
    } catch (e) {
        if (file) deleteImages([filePath]);
        return res.status(400).json();
    }

    let body = req.body;

    await Question.create({
        name: body.name,
        orderNum: body.orderNum,
        isShowHelpText: body.isShowHelpText,
        isShowHelpVideo: body.isShowHelpVideo,
        helpText: body.helpText,
        helpVideo: body.helpVideo,
        image: file?.filename,
        parentID: body.parentID,
        destinationID: body.destinationID,
        dependenceType: body.dependenceType,
        dependenceID: body.dependenceID,
        optStatus: body.optStatus,
        isActive: body.isActive,
    })
        .then(async data => {
            res.send();

        })
        .catch(function (err) {
            deleteImages([filePath]);
            return next(err);
        });


};

// get result of query products in frontend
exports.answer = async (req, res, next) => {

    const ids = req.body.ids;


    Question.findAll({
        where: {id: ids, isActive: true},attributes:["id","name","parentID"], include: [{model: Question, as: 'Parent',attributes:["id","name"]}],
    })
        .then(questions => {

            if (questions != null) {
                return res.send(questions);
            } else {
                return res.status(204).send();
            }
        })
        .catch(next);
};

// Update a Question by the id in the request
exports.update = async (req, res, next) => {

    let file = null, filePath;
    if (req.file != null && req.file) {
        file = req.file;
        if (file) filePath = "./" + process.env.AVATAR_STORAGE + "/" + file.filename;
    }

    // check validation
    try {
        const {errors, isValid} = checkValidation(req, "Question");
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
        await Question.findByPk(id)
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

    await Question.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                Question.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                if (file) deleteImages([filePath]);
                return res.status(406).send({
                    message: `Cannot update Question . Maybe it was not found or req.body is empty!`
                });
            }
        })
        .catch(function (err) {
            if (file) deleteImages([filePath]);
            return next(err);
        });

};

// Delete a Question with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await Question.restore({where: {id: arrIDs}})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update Question with ids. Maybe Question was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            const data = await Question.findAll({
                where: {id: arrIDs}, attributes: ["id", "image"], raw: true, paranoid: false,
            });
            await Question.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        let images = [], arrIDs = [];
                        data.map((row) => {
                            images.push("./" + process.env.AVATAR_STORAGE + "/" + row.image);
                            arrIDs.push(row.id);
                        });
                        deleteImages(images);
                        res.send({
                            message: "Question was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Question with range ids. Maybe Question was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await Question.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Question with range ids. Maybe Question was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};


