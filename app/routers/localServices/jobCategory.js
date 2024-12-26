const jobCategoryController = require("../../controller/localServices/jobCategoryController.js");
const {allowIfLoggedIn, hasPermission} = require("../../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "JobCategories";
    let router = require("express").Router();

    router.get("/", allowIfLoggedIn, hasPermission("findAll" + routeName), jobCategoryController.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), jobCategoryController.create)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), jobCategoryController.update)
        .delete("/:id", allowIfLoggedIn, hasPermission("delete" + routeName), jobCategoryController.delete);
    app.use('/localServices/'+routeName, router);
};
