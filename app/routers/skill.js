const skillController = require("../controller/skillController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "Skills";
    let router = require("express").Router();

    router.get("/", allowIfLoggedIn, hasPermission("findAll" + routeName), skillController.findAll)
    .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), skillController.create)
    .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), skillController.update)
    .delete("/:id", allowIfLoggedIn, hasPermission("delete" + routeName), skillController.delete);
    app.use("/" + routeName , router);
};
