const {checkValidation, deleteFromBody} = require("../services/globalFunction");
const {Role, Permission, PermissionRole, Order} = require("../../models");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";
    const withPermissionID = req.params.withPermissionID === "true";
    const withAllFields = req.params.withAllFields === "true";
    Role.findAll({
        order: [['createdAt', 'DESC']],
        attributes: withAllFields ? null : ['id', 'displayName'],
        include: !withPermissionID ? [] : [{model: Permission, attributes: ["id"], through: {model: PermissionRole, attributes: []}}],
        paranoid: isShowDeleted,
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};


// Create and Save a new Role
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Role");
    if (!isValid) {
        return res.status(400).json(errors);
    }


    const body = req.body;
    await Role.create({
        slug: body.slug, displayName: body.displayName,
    })
        .then(async role => {
            let bulkData = [];
            if (body.selectedPermissions) {
                bulkData = body.selectedPermissions.map((e) => {
                    return {permissionID: e, roleID: role.id};
                });

                if (bulkData.length > 0) {
                    await PermissionRole.bulkCreate(bulkData);
                }
            }
            res.send(role);

        })
        .catch(next);


};

// Update a Role by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Role");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await Role.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                Role.findByPk(id)
                    .then(async data => {
                        await PermissionRole.destroy({where: {roleID: id}});
                        if (body.selectedPermissions) {
                            let bulkData = [];
                            bulkData = body.selectedPermissions.map((e) => {
                                return {permissionID: e, roleID: id};
                            });

                            if (bulkData.length > 0) {
                                await PermissionRole.bulkCreate(bulkData);
                            }
                        }
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                res.status(406).send({
                    message: `Cannot update Role with id=${id}. Maybe Role was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete a Role with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await Role.restore({where: {id: arrIDs}})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update Role with ids. Maybe Role was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            await Role.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.send({
                            message: "Role was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Role with range ids. Maybe Role was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await Role.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Role with range ids. Maybe Role was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};



