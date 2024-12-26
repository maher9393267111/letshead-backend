const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");
 const quoteController = require("../controller/quoteController");

module.exports = app => {
    const routeName = "Quotes";
    let router = require("express").Router();
    router.get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), quoteController.findAll)
        .post("/create", quoteController.create)
        .get("/:id", allowIfLoggedIn, hasPermission("show" + routeName), quoteController.show)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), quoteController.update)
        .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), quoteController.delete);

    app.use("/" + routeName , router);
};
