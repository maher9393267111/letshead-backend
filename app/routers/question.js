const questionController = require("../controller/questionController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");
const uploadController = require("../controller/uploadController");

module.exports = app => {
    const routeName = "Questions";
    let router = require("express").Router();

    router.post("/answers", questionController.answer)
        .get("/show", questionController.show)
        .get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), questionController.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), uploadController.uploadImage, questionController.create)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), uploadController.uploadImage, questionController.update)
        .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), questionController.delete);
    app.use("/" + routeName , router);
};
