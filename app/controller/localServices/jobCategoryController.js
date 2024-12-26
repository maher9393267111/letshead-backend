const {checkValidation, deleteFromBody} = require("../../services/globalFunction");
const {JobCategory} = require("../../../models");

exports.findAll = async (req, res, next) => {

    JobCategory.findAll({
        order: [['createdAt', 'DESC']]
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};


// Create and Save a new JobCategory
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "JobCategory");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    await JobCategory.create({
        name: req.body.name, isTypeCategory: req.body.isTypeCategory, isActive: req.body.isActive,
    })
        .then(async data => {
            res.send(data);

        })
        .catch(next);


};

// Update a JobCategory by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "JobCategory");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await JobCategory.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                JobCategory.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                res.status(406).send({
                    message: `Cannot update JobCategory with id=${id}. Maybe JobCategory was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete a JobCategory with the specified id in the request
exports.delete = async (req, res, next) => {

    const id = req.params.id;

    await JobCategory.destroy({
        where: {id}
    })
        .then(num => {
            if (Number(num) === 1) {

                res.send({
                    message: "JobCategory was deleted successfully!"
                });

            } else {
                res.status(400).send({
                    message: `Cannot delete JobCategory with id=${id}. Maybe JobCategory was not found!`
                });
            }
        })
        .catch(next);


};
