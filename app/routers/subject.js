const subjectController = require("../controller/subjectController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "Subjects";
    let router = require("express").Router();

    router.get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), subjectController.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), subjectController.create)
        .get("/show", subjectController.show)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), subjectController.update)
        .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), subjectController.delete);
    app.use("/" + routeName , router);
};
