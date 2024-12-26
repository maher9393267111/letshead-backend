const {checkValidation, deleteFromBody} = require("../services/globalFunction");
const {NoteOrder} = require("../../models");

exports.findAll = async (req, res, next) => {
    NoteOrder.findAll({
        order: [['createdAt', 'DESC']],
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};


// Create and Save a new NoteOrder
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "NoteOrder");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const data = req.body;

    await NoteOrder.create({
        orderID: data.orderID, title: data.title, body: data.body,
    })
        .then(async data => {
            res.send();

        })
        .catch(next);
};

// Find a single Tutorial with an id
exports.show = async (req, res, next) => {

    const id = req.params.id;

    await NoteOrder.findAll({
        where: {orderID: id}
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};


// Update a NoteOrder by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "NoteOrder");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await NoteOrder.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                NoteOrder.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                res.status(406).send({
                    message: `Cannot update NoteOrder with id=${id}. Maybe NoteOrder was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete a NoteOrder with the specified id in the request
exports.delete = async (req, res, next) => {
    const id = req.params.id;

    await NoteOrder.destroy({where: {id} })
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



