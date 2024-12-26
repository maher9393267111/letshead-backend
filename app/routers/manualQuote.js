const manualQuoteController = require("../controller/manualQuoteController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");
const uploadController = require("../controller/uploadController");

module.exports = app => {
    const routeName = "ManualQuotes";
    let router = require("express").Router();

    router.get("/show/:id", manualQuoteController.show)
        .post("/status/:id", manualQuoteController.status)
        .get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), manualQuoteController.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), manualQuoteController.create)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), manualQuoteController.update)
        .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), manualQuoteController.delete);
    app.use("/" + routeName, router);
};
