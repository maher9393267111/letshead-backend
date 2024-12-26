const AvailableInstallationController = require("../controller/availableInstallationController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "AvailableInstallations";
    let router = require("express").Router();

    router .get("/show/:isFirstDate?",   AvailableInstallationController.show)
     .get("/", allowIfLoggedIn,  hasPermission("findAll" + routeName), AvailableInstallationController.findAll)
     .post("/create", allowIfLoggedIn,  hasPermission("create" + routeName), AvailableInstallationController.create)
     .put("/update/:id", allowIfLoggedIn,  hasPermission("update" + routeName), AvailableInstallationController.update)
     .delete("/:id", allowIfLoggedIn,  hasPermission("delete" + routeName), AvailableInstallationController.delete);
    app.use("/" + routeName , router);
};
