const postcodeController = require("../controller/postcodeController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "Postcodes";
    let router = require("express").Router();

    router.get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), postcodeController.findAll)
        .get("/coverage/:postcode", postcodeController.show)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), postcodeController.create)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), postcodeController.update)
        .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), postcodeController.delete);
    app.use("/" + routeName , router);
};
