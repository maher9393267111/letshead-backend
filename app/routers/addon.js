const addonController = require("../controller/addonController.js");
const uploadController = require("../controller/uploadController");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "Addons";
    let router = require("express").Router();

    router .get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), addonController.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), uploadController.uploadImage, addonController.create)
        .get("/product/:id", allowIfLoggedIn, hasPermission("findOneProduct" + routeName), addonController.findAddonsProduct)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), uploadController.uploadImage, addonController.update)
        .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), addonController.delete);
    app.use("/" + routeName , router);
};
