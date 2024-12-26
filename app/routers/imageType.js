const imageTypeController = require("../controller/imageTypeController.js");
const uploadController = require("../controller/uploadController");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "ImageTypes";
    let router = require("express").Router();

    router.get("/orders", allowIfLoggedIn, hasPermission("findAllOrder" + routeName), imageTypeController.findAllOrder)
        .get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), imageTypeController.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), imageTypeController.create)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), imageTypeController.update)
        .get("/submit/:id", imageTypeController.findAllSubmitImagesType) // allowIfLoggedIn, hasPermission("findSubmit" + routeName),
        .post("/submit/create/:id", uploadController.uploadImages, imageTypeController.createSubmit) // allowIfLoggedIn, hasPermission("createSubmit" + routeName),
        .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), imageTypeController.delete);
    app.use("/" + routeName , router);
};
