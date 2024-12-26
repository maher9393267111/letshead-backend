const serviceController = require("../../controller/localServices/serviceController.js");
const {allowIfLoggedIn, hasPermission} = require("../../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "Services";
    let router = require("express").Router();

    router.get("/", allowIfLoggedIn, hasPermission("findAll" + routeName), serviceController.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), serviceController.create)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), serviceController.update)
        .delete("/:id", allowIfLoggedIn, hasPermission("delete" + routeName), serviceController.delete);
    app.use("/localServices/" + routeName , router);
};
