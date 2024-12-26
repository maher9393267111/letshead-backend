const permissionController = require("../controller/permissionController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "Permissions";
    let router = require("express").Router();

    router.get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName),  permissionController.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName),   permissionController.create)
        .put("/update/:id",  allowIfLoggedIn, hasPermission("update" + routeName), permissionController.update)
        .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName),   permissionController.delete);
    app.use("/" + routeName , router);
};
