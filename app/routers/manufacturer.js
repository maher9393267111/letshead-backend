const manufacturerController = require("../controller/manufacturerController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");
const uploadController = require("../controller/uploadController");

module.exports = app => {
    const routeName = "Manufacturers";
    let router = require("express").Router();

    router.get("/show/:isForAddon?",   manufacturerController.show)
        .get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), manufacturerController.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), uploadController.uploadImage, manufacturerController.create)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), uploadController.uploadImage, manufacturerController.update)
        .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), manufacturerController.delete);
    app.use("/" + routeName , router);
};
