const customerController = require("../../controller/localServices/customerController.js");
const {allowIfLoggedIn, hasPermission} = require("../../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "Customers";
    let router = require("express").Router();

    router.get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), customerController.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), customerController.create)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), customerController.update)
        .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), customerController.delete);
    app.use("/localServices/" + routeName , router);
};
