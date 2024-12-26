const controller = require("../../controller/eng/noteProfileController.js");
const {allowIfLoggedIn, hasPermission} = require("../../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "NoteProfiles";
    let router = require("express").Router();
    router.get("/", allowIfLoggedIn, hasPermission("findAll" + routeName), controller.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), controller.create)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), controller.update)
        .delete("/:id", allowIfLoggedIn, hasPermission("delete" + routeName), controller.delete);

    app.use("/" + routeName , router);
};
