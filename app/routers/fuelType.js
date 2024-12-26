const fuelTypeController = require("../controller/fuelTypeController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "FuelTypes";
    let router = require("express").Router();

    router.get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), fuelTypeController.findAll)
    .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), fuelTypeController.create)
    .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), fuelTypeController.update)
    .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), fuelTypeController.delete) ;
    app.use("/" + routeName , router);
};
