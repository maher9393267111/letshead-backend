const optionController = require("../controller/optionController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "Options";
    let router = require("express").Router();

    router.get("/show", optionController.show)
        .get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), optionController.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), optionController.create)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), optionController.update)
        .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), optionController.delete);

    app.use("/" + routeName, router);
};
