const installAnswerController = require("../controller/installAnswerController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "InstallAnswers";
    let router = require("express").Router();

    router.get("/", allowIfLoggedIn, hasPermission("findAll" + routeName), installAnswerController.findAll)
    .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), installAnswerController.create)
    .delete("/:id", allowIfLoggedIn, hasPermission("delete" + routeName), installAnswerController.delete);
    app.use("/" + routeName , router);
};
