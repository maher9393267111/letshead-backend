const statistController = require("../controller/statistController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "Statistics";
    let router = require("express").Router();

    router.get("/", allowIfLoggedIn, hasPermission("findAll" + routeName), statistController.findAll);

    app.use('/' + routeName, router);
};
