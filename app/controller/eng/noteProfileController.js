const {checkValidation, deleteFromBody} = require("../../services/globalFunction");
const {NoteProfile} = require("../../../models");

exports.findAll = async (req, res, next) => {
    NoteProfile.findAll({
        order: [['createdAt', 'DESC']],
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};


// Create and Save a new NoteProfile
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "NoteProfile");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const data = req.body;

    await NoteProfile.create({
        profileID: data.profileID, title: data.title, body: data.body,
    })
        .then(async data => {
            res.send();

        })
        .catch(next);
};

// Update a NoteProfile by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "NoteProfile");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await NoteProfile.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                NoteProfile.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                res.status(406).send({
                    message: `Cannot update NoteProfile with id=${id}. Maybe NoteProfile was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete a NoteProfile with the specified id in the request
exports.delete = async (req, res, next) => {
    const id = req.params.id;

    await NoteProfile.destroy({where: {id} })
        .then((num) => {
            if (Number(num) >= 1) {
                // req.app.get("socketIO").emit("destroyCity", data);
                res.send({
                    message: "Data was deleted successfully!",
                });
            } else {
                res.status(400).send({
                    message: `Cannot delete Data with range ids. Maybe Data was not found!`,
                });
            }
        })
        .catch(next);

};



