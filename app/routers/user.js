const userController = require("../controller/userController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "Users";
    let router = require("express").Router();

    router
        .get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), userController.findAll)
        .get("/roles/:roleName/:withAllInfo?", allowIfLoggedIn, hasPermission("findAllRoles" + routeName), userController.findAllBasedOnRole)
        .get("/engineers/:postcode/:date", allowIfLoggedIn, hasPermission("findAllEngineersPostcode" + routeName), userController.findEngineer)
        .get("/show", allowIfLoggedIn, hasPermission("show" + routeName), userController.show)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), userController.update)
        .delete("/destroy/", allowIfLoggedIn, hasPermission("destroy" + routeName), userController.destroy)
        .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), userController.delete);

    app.use("/" + routeName , router);
};
