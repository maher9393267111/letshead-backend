const imageOrderController = require("../controller/imageOrderController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");
const uploadController = require("../controller/uploadController");
const noteOrderController = require("../controller/noteOrderController");

module.exports = app => {
    const routeName = "ImageOrders";
    let router = require("express").Router();
    router.get("/", allowIfLoggedIn, hasPermission("findAll" + routeName), imageOrderController.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), uploadController.uploadMixFiles, imageOrderController.create)
        .get("/:id", allowIfLoggedIn, hasPermission("show" + routeName), imageOrderController.show)
        .put("/update", allowIfLoggedIn, hasPermission("update" + routeName), uploadController.uploadMixFiles, imageOrderController.update)
        .delete("/:id", allowIfLoggedIn, hasPermission("delete" + routeName), imageOrderController.delete);

    app.use("/" + routeName , router);
};
