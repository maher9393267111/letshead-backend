const noteOrderController = require("../controller/noteOrderController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "NoteOrders";
    let router = require("express").Router();
    router.get("/", allowIfLoggedIn, hasPermission("findAll" + routeName), noteOrderController.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), noteOrderController.create)
        .get("/:id", allowIfLoggedIn, hasPermission("show" + routeName), noteOrderController.show)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), noteOrderController.update)
        .delete("/:id", allowIfLoggedIn, hasPermission("delete" + routeName), noteOrderController.delete);

    app.use("/" + routeName , router);
};
