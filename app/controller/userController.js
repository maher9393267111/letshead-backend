const {checkValidation, deleteFromBody} = require("../services/globalFunction");
const {User, Profile, Skill, ProfileSkill, PostcodeProfile, Postcode, AvailableWork, Role, RoleUser, PermissionRole} = require("../../models");
const {Op, Sequelize} = require("sequelize");
const {isHavePermission} = require("../middlewares/roleAccessControl");

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";

    User.scope('withAllInfo').findAll({
        order: [['createdAt', 'DESC']], paranoid: isShowDeleted, include: [{model: Profile, attributes: ['id', 'isActive', 'companyGasNumber']}, {
            model: Role, attributes: ["id", "displayName"], through: {model: RoleUser, attributes: []}
        }],
    }).then(data => {
        res.send(data);
    })
        .catch(next);
};

exports.findAllBasedOnRole = async (req, res, next) => {

    const roleName = req.params.roleName;
    const withAllInfo = req.params.withAllInfo === "true";

    let scopeUser = User;
    if (withAllInfo) {
        scopeUser = User.scope('withAllInfo');
    }

    scopeUser.findAll({
        order: [['createdAt', 'DESC']],
        include: [{model: Role, where: (roleName === "all") ? null : {slug: roleName}, attributes: [], through: {model: RoleUser, attributes: []}}],
    }).then(data => {
        res.send(data);
    })
        .catch(next);
};


// Find a single Tutorial with an id
exports.show = async (req, res, next) => {

    const id = req.userID;

    await User.findByPk(id, {
        include: [{model: Profile, include: [{model: Skill, attributes: ["name"], through: ProfileSkill}]}]
    })
        .then(data => {
            res.send();
        })
        .catch(next);
};

// Update a Tutorial by the id in the request
exports.update = async (req, res, next) => {

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    let condition;

    if ("password" in body) delete body.password;
    if (isHavePermission(req.roles, "updateOtherUsers")) {
        condition = {id: id};

        if ("name" in body) delete body.name;

        if ("username" in body) delete body.username;

    } else {
        if ("isActive" in body) delete body.isActive;

        condition = {id: req.userID};
    }

    const {errors, isValid} = checkValidation(req, "register");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    await User.scope('withActiveUsername').update(body, {where: condition})
        .then(async num => {
            if (Number(num) === 1) {
                if (isHavePermission(req.roles, "updateOtherUsers")) {
                    await RoleUser.destroy({where: {userID: id}});
                    if (body.selectedRoles) {
                        let bulkData = [];
                        bulkData = body.selectedRoles.map((e) => {
                            return {roleID: e, userID: id};
                        });
                        if (bulkData.length > 0) {
                            await RoleUser.bulkCreate(bulkData);
                        }
                    }
                }
                // req.app.get('socketIO').emit("updateUser", data);
                res.send();

            } else {
                res.send({
                    message: `Cannot update User with id=${condition.id}. Maybe User was not found or req.body is empty!`
                });
            }
        })
        .catch(next);
};

// Find a single Tutorial with an id
exports.destroy = async (req, res, next) => {

    const id = req.userID;

    await User.scope('withActive').update({isActive: false, username: Math.random().toFixed(9)}, {where: {id: id, isActive: true}})
        .then(num => {
            if (Number(num) === 1) {
                res.send();
            } else {
                res.status(403).send();
            }
        })
        .catch(next);
};

// Delete a User with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await User.restore({where: {id: arrIDs}, individualHooks: true})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update User with ids. Maybe User was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            await User.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.send({
                            message: "User was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete User with range ids. Maybe User was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await User.destroy({where: {id: arrIDs}, force: isForce, individualHooks: true})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete User with range ids. Maybe User was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};



exports.findEngineer = async (req, res, next) => {

    const postCodeTxt = req.params.postcode;
    const installDate = req.params.date;


    Postcode.findAll({
        where: {
            name: {
                [Op.or]: [{[Op.and]: [Sequelize.where(Sequelize.fn('char_length', Sequelize.col('name')), 2), {[Op.startsWith]: postCodeTxt.slice(0, 2)}]}, {
                    [Op.and]: [Sequelize.where(Sequelize.fn('char_length', Sequelize.col('name')), 1), {[Op.startsWith]: postCodeTxt.slice(0, 1)}, Sequelize.where(Sequelize.literal(Number(postCodeTxt.charAt(1)) >= 0), true)]
                },]
            }, type: {[Op.or]: [0, 1]}, isActive: true,
        }, attributes: ["id"]
    })
        .then(data => {

            if (data != null) {

                let ids = [];
                data.map((e) => ids.push(e.id));
                User.scope('withActive').findAll({
                    where: {isActive: true}, attributes: ["id", "name"], order: [['createdAt', 'DESC']], include: [{
                        model: Profile, where: {isActive: true}, attributes: [], include: {
                            model: Postcode, attributes: [], required: true, through: {model: PostcodeProfile, attributes: [], where: {postcodeID: ids}},
                        },
                    }, {model: AvailableWork, attributes: [], where: {isActive: true, startDate: installDate},}]
                })
                    .then(data => {
                        res.send(data);
                    })
                    .catch(next);
            }

        })
        .catch(next);


};








