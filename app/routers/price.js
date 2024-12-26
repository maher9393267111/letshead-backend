const priceController = require("../controller/priceController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "Prices";
    let router = require("express").Router();

    router.get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), priceController.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), priceController.create)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), priceController.update)
        .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), priceController.delete);
    app.use("/" + routeName , router);
};
