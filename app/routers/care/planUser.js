const planUserController = require("../../controller/care/planUserController.js");
const {allowIfLoggedIn, hasPermission} = require("../../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "PlanUsers";
    let router = require("express").Router();

    router.get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), planUserController.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), planUserController.create)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), planUserController.update)
        .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), planUserController.delete);
    app.use("/" + routeName , router);
};
