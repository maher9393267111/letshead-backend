const emailTemplateController = require("../controller/emailTemplateController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "EmailTemplates";
    let router = require("express").Router();

    router.get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), emailTemplateController.findAll)
    .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), emailTemplateController.create)
    .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), emailTemplateController.update)
    .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), emailTemplateController.delete)
    app.use("/" + routeName , router);
};
