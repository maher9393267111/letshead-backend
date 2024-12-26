const passport = require("passport");

function allowIfLoggedIn(req, res, next) {
    try {
        passport.authenticate('analysisJWT', {session: false}, (err, user, info) => {

            if (err) {
                return;
            } else if (info !== undefined) {
                res.status(401).send({error: info.message});
            } else if (!err) {
                req.userID = user.id;
                req.roles = user.Roles;
                next();
            }
        })(req, res, next);

    } catch (error) {
        next(error);
    }
}

function hasPermission(key) {
    return (req, res, next) => {
        try {
            const roles = req.roles;
            if (isHavePermission(roles, key)) {
                next();
            } else {
                return res.status(401).json({errors: {error: "You don't have enough permission to perform this action"}});
            }
        } catch (error) {
            return res.status(403).json(error);

        }
    };

}

function isHavePermission(roles, key) {
    if (roles && roles.length > 0) {
        let listPermissions = [];
        let permissions = [];
        roles.map(e => {
            listPermissions = e.Permissions;
            listPermissions.map(element => permissions.push(element.slug.trim()));
        });

        return permissions.indexOf(key) !== -1;
    } else {
        return false;
    }
}

function isHaveRole(roles, key) {
    if (roles && roles.length > 0) {
        let listRoles = [];
        roles.map(e => {
            listRoles.push(e.slug.trim());
        });

        return listRoles.indexOf(key) !== -1;
    } else {
        return false;
    }
}


module.exports = {allowIfLoggedIn, hasPermission,isHavePermission,isHaveRole};
