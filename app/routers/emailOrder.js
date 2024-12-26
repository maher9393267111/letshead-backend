const emailOrderController = require("../controller/emailOrderController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "EmailOrders";
    let router = require("express").Router();

    router.get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), emailOrderController.findAll)
        .post("/create", emailOrderController.create)
        .get("/show/:id", allowIfLoggedIn, hasPermission("show" + routeName), allowIfLoggedIn, emailOrderController.show);
    app.use("/" + routeName , router);
};
