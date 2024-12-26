const contactController = require("../controller/contactController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");
const uploadController = require("../controller/uploadController");

module.exports = app => {
    const routeName = "Contacts";
    let router = require("express").Router();

    router.get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), contactController.findAll)
        .post("/create", uploadController.uploadMixFile, contactController.create)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), uploadController.uploadMixFile, contactController.update)
        .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), contactController.delete);
    app.use("/" + routeName , router);
};
