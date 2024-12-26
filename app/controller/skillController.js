const {checkValidation, deleteFromBody} = require("../services/globalFunction");
const {Skill} = require("../../models");

exports.findAll = async (req, res, next) => {

    Skill.findAll({
        order: [['createdAt', 'DESC']]
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};


// Create and Save a new Skill
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Skill");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    await Skill.create({
        name: req.body.name, parentID: req.body.parentID, isActive: req.body.isActive,
    })
        .then(async data => {
            res.send();

        })
        .catch(next);


};

// Update a Skill by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Skill");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await Skill.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                Skill.findByPk(id)
                    .then(async data => {
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                res.status(406).send({
                    message: `Cannot update Skill with id=${id}. Maybe Skill was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete a Skill with the specified id in the request
exports.delete = async (req, res, next) => {

    const id = req.params.id;

    await Skill.destroy({
        where: {id}
    })
        .then(num => {
            if (Number(num) === 1) {

                res.send({
                    message: "Skill was deleted successfully!"
                });

            } else {
                res.status(400).send({
                    message: `Cannot delete Skill with id=${id}. Maybe Skill was not found!`
                });
            }
        })
        .catch(next);


};
