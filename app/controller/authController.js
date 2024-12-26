const jwt = require('jsonwebtoken');
const jwtSecret = require("../../config/jwtConfig");
const passport = require("passport");
const {checkValidation} = require("../services/globalFunction");
const {User, Role, RoleUser, Permission, PermissionRole} = require("../../models");
const {sendMail} = require("../../helpers/SendMail");
const {isHavePermission, isHaveRole} = require("../middlewares/roleAccessControl");

// Login Auth.
exports.login = (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "login");
    if (!isValid) {
        return res.status(400).json(errors);
    }


    passport.authenticate('loginUsingJWT', (err, user, info) => {
        // console.log("error -- "+err);
        // console.log("info --"+info);
        // console.log("user --"+user);
        // if (info !== undefined) console.log("info --" + info.message);

        if (err) {
            res.status(500).send({error: "Server error while login operation"});

        } else if (info !== undefined) {
            res.status((info.message === 'bad username') ? 401 : 403).send({error: info.message});
        } else {

            User.scope('withActiveUsername').findByPk(user.id, {
                include: [{
                    model: Role,
                    attributes: ['slug'],
                    through: {model: RoleUser, attributes: []},
                    include: [{model: Permission, attributes: ['slug'], through: {model: PermissionRole, attributes: []}}]
                }]
            }).then(user => {

                if (user.isActive === false) {
                    res.status(202).send({
                        message: 'user was Disable by Admin',
                    });
                } else {
                    let token = jwt.sign({id: user.id}, jwtSecret.secretOrKey, {
                        expiresIn: jwtSecret.expiresIn, audience: jwtSecret.audience, issuer: jwtSecret.issuer,
                    });
                    res.status(200).json({token, user: user});
                }
            });
        }
    })(req, res, next);
};


// Register Auth.
exports.register = (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "register");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    passport.authenticate('registerUsingJWT', async (err, user, info) => {
        if (err !== null) {
            res.status(500).send({errors: err});

        } else if (info !== undefined) {
            res.status(403).send({errors: info.message});
        } else {
            User.scope('withEmail').findByPk(user.id, {
                include: [{
                    model: Role,
                    attributes: ['slug'],
                    through: {model: RoleUser, attributes: []},
                    include: [{model: Permission, attributes: ['slug'], through: {model: PermissionRole, attributes: []}}]
                }]
            }).then(async user => {
                const token = await jwt.sign({id: user.id}, jwtSecret.secretOrKey, {
                    expiresIn: jwtSecret.expiresIn, audience: jwtSecret.audience, issuer: jwtSecret.issuer,
                });

                // req.app.get('socketIO').emit("updateOption", {"key": "totalUser", "value": "1"});

                res.status(200).send({token, user: user});

                if (isHaveRole(req.roles, "engineer")) {
                    await sendMail(0, user.email, user.name);
                }

            });
        }
    })(req, res, next);
};

// Find Auth.
exports.findUser = async (req, res) => {


    const {errors, isValid} = checkValidation(req, "checkUser");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = req.body;
    if ("username" in body && body.username != null) {
        if ("email" in body && body.email != null) {
            const mailAvailable = await User.scope('withEmail').findOne({where: {email: body.email}});
            if (mailAvailable != null) {
                res.status(206).send();
            } else {
                const usernameAvailable = await User.scope('withActiveUsername').findOne({attributes: ['isActive'], where: {username: body.username}});
                res.status(usernameAvailable === null ? 200 : ((usernameAvailable['isActive'] !== true) ? 202 : 204)).send();
            }
        } else {
            User.scope('withActiveUsername').findOne({
                attributes: ['isActive'], where: {username: body.username},
            }).then((userInfo) => {
                if (userInfo != null) {
                    res.status((userInfo['isActive'] !== true) ? 202 : 200).send();
                } else {
                    console.error('no user exists in db with that username');
                    res.status(204).send();
                }
            });
        }

    } else {
        res.status(400).send();
    }


};



