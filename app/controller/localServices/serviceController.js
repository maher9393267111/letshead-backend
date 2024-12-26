const {checkValidation, deleteFromBody} = require("../../services/globalFunction");
const {Service} = require("../../../models");

exports.findAll = async (req, res, next) => {

    Service.findAll({
        order: [['createdAt', 'DESC']]
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};


// Create and Save a new Service
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Service");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    await Service.create({
        userID: req.body.userID,
        typeID: req.body.typeID,
        categoryID: req.body.categoryID,
        price: req.body.price,
        note: req.body.note,
        bookingDate: req.body.bookingDate,
        priority: req.body.priority,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        isActive: req.body.isActive,
    })
        .then(async data => {
            res.send(data);

        })
        .catch(next);


};

// Update a Service by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Service");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await Service.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                Service.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                res.status(406).send({
                    message: `Cannot update Service with id=${id}. Maybe Service was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete a Service with the specified id in the request
exports.delete = async (req, res, next) => {

    const id = req.params.id;

    await Service.destroy({
        where: {id}
    })
        .then(num => {
            if (Number(num) === 1) {

                res.send({
                    message: "Service was deleted successfully!"
                });

            } else {
                res.status(400).send({
                    message: `Cannot delete Service with id=${id}. Maybe Service was not found!`
                });
            }
        })
        .catch(next);


};
