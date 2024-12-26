const planServiceController = require("../../controller/care/planServiceController.js");
const {allowIfLoggedIn, hasPermission} = require("../../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "PlanServices";
    let router = require("express").Router();

    router.get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), planServiceController.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), planServiceController.create)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), planServiceController.update)
        .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), planServiceController.delete);
    app.use("/" + routeName , router);
};
