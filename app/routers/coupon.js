const couponController = require("../controller/couponController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "Coupons";
    let router = require("express").Router();

    router.get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), couponController.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), couponController.create)
        .get("/apply/:productID/:slug", allowIfLoggedIn, couponController.apply)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), couponController.update)
        .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), couponController.delete);
    app.use("/" + routeName , router);
};
