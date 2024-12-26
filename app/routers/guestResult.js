const guestResultController = require("../controller/guestResultController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl");
const cityController = require("../controller/cityController");

module.exports = app => {
    const routeName = "GuestResult";
    let router = require("express").Router();

    router.post("/create", guestResultController.create)
        .get("/:slug", guestResultController.findOne)
        .put("/update/:slug", guestResultController.update);

    app.use('/' + routeName, router);
};
