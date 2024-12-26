const roleController = require("../controller/roleController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "Roles";
    let router = require("express").Router();

    router.get("/:withAllFields/:withPermissionID/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), roleController.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), roleController.create)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), roleController.update)
        .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), roleController.delete);
    app.use("/" + routeName, router);
};
