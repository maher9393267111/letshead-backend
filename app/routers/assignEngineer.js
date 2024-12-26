const assignEngineerController = require("../controller/assignEngineerController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "AssignEngineers";
    let router = require("express").Router();

    router.get("/", allowIfLoggedIn, hasPermission("findAll" + routeName), assignEngineerController.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), assignEngineerController.create)
        .get("/:id", allowIfLoggedIn, hasPermission("show" + routeName), assignEngineerController.show)
        .get("/order/:id", allowIfLoggedIn, hasPermission("findOneOrder" + routeName), assignEngineerController.findOrder)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), allowIfLoggedIn, assignEngineerController.update)
        .delete("/:id", allowIfLoggedIn, hasPermission("delete" + routeName), assignEngineerController.delete);
    app.use("/" + routeName, router);
};
