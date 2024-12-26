const sizeController = require("../controller/sizeController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "Sizes";
    let router = require("express").Router();

    router.get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), sizeController.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), sizeController.create)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), sizeController.update)
        .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), sizeController.delete);
    app.use("/" + routeName, router);
};
