require("sequelize");
const JwtStrategy = require('passport-jwt').Strategy, opts = require("../../config/jwtConfig"),
    bcrypt = require("bcrypt"), LocalStrategy = require('passport-local').Strategy, passport = require('passport');

const BCRYPT_SALT_ROUNDS = 12;
const {User, Role, Permission, PermissionRole,RoleUser} = require("../../models");
const {Op} = require("sequelize");

passport.use("analysisJWT", new JwtStrategy(opts, async function (jwt_payload, next) {
    try {
        await User.scope('withActive').findOne({
            where: {id: jwt_payload.id,isActive:true}
            , include: [{model: Role, attributes: ['slug'], through: {model: RoleUser, attributes: []},include: [{model: Permission, attributes: ['slug'],through: {model: PermissionRole, attributes: []}}]}]
        }).then(user => {
             if (user) {
                next(null, user);
            } else {
                next(null, false);
            }
        });
    } catch (err) {
        next(err, false);
    }
}));

passport.use('loginUsingJWT', new LocalStrategy(opts, async (username, password, next) => {

    try {
        await User.scope('withActivePassword').findOne({
            where: {username, isActive: true},
        }).then(user => {
            if (user === null) {
                next(null, false, {message: 'bad username'});
            } else bcrypt.compare(password, user.password).then(response => {

                if (!response) {
                    next(null, false, {message: 'passwords do not match'});
                } else next(null, user);
            }).catch(err => {
                 console.log("catchError -- " + err);
                next(null, false, {message: 'bad username OR password'});
            });
        });
    } catch (err) {
        next(err, false);
    }
},),);

passport.use('registerUsingJWT', new LocalStrategy({
    passReqToCallback: true, session: false
}, async function (req, username, password, next) {
    try {

        await User.findOne({
            where: {[Op.or]: [{username: username}, {email: req.body.email}]},
        }).then(async user => {
            if (user != null) {
                throw ({message: 'phone number or email already taken'});

            }

            await bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS).then(async hashedPassword => {

                await User.create({
                    username,
                    password: hashedPassword,
                    name: req.body.name,
                    email: req.body.email,
                }).then(async user => {
                    const role = await Role.findByPk(process.env.CUSTOMER_ROLE_ID);
                    if (role) {
                        await RoleUser.create({roleID: role.id, userID: user.id});
                    }
                    next(null, user);
                });
            });
        });
    } catch (err) {
        next(null, false, err);
    }
}));




