const installQuestionController = require("../controller/installQuestionController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "InstallQuestions";
    let router = require("express").Router();

    router.get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), installQuestionController.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), installQuestionController.create)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), installQuestionController.update)
        .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), installQuestionController.delete);
    app.use("/" + routeName , router);
};
