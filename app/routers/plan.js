const PlanController = require("../controller/planController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "Plans";
    let router = require("express").Router();

    router.get("/active", PlanController.findAllActive)
        .get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), PlanController.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), PlanController.create)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), PlanController.update)
        .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), PlanController.delete);
    app.use("/" + routeName , router);
};
