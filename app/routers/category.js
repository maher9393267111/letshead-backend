const categoryController = require("../controller/categoryController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "Categories";
    let router = require("express").Router();

    router.get("/addons/product/:id", categoryController.findAllAddonsProduct)
     .get("/addons", allowIfLoggedIn,  hasPermission("findAllAddons" + routeName), categoryController.findAllAddons)
     .get("/:isShowDeleted?", allowIfLoggedIn,  hasPermission("findAll" + routeName), categoryController.findAll)
     .post("/create", allowIfLoggedIn,  hasPermission("create" + routeName), categoryController.create)
     .put("/update/:id", allowIfLoggedIn,  hasPermission("update" + routeName), categoryController.update)
     .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn,  hasPermission("delete" + routeName), categoryController.delete);
    app.use('/'+routeName, router);
};
