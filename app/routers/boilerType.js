const boilerTypeController = require("../controller/boilerTypeController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "BoilerTypes";
    let router = require("express").Router();

    router.get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), boilerTypeController.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), boilerTypeController.create)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), boilerTypeController.update)
        .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), boilerTypeController.delete);
    app.use("/" + routeName , router);
};
