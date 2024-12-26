const orderController = require("../controller/orderController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "Orders";
    let router = require("express").Router();

    router.get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), orderController.findAll)
        .get("/create/:slug", allowIfLoggedIn, hasPermission("createAutomatic" + routeName), orderController.automaticCreate)
        .post("/manual/create", allowIfLoggedIn, hasPermission("createManual" + routeName), orderController.manualCreate)
    .get("/show/:id", allowIfLoggedIn, hasPermission("show" + routeName), orderController.show)
    .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), orderController.update)
    .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), orderController.delete);
    app.use("/" + routeName , router);
};
