const applianceController = require("../../controller/care/applianceController.js");
const {allowIfLoggedIn, hasPermission} = require("../../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "Appliances";
    let router = require("express").Router();

    router.get("/:id/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), applianceController.show)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), applianceController.create)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), applianceController.update)
        .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), applianceController.delete);
    app.use("/" + routeName , router);
};
