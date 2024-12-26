const cityController = require("../controller/cityController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "Cities";
    let router = require("express").Router();

    router.get("/postcodes/:isTypeEng?", allowIfLoggedIn, hasPermission("findAllPostcodes" + routeName), cityController.findPostcodesInCity)
        .get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), cityController.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), cityController.create)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), cityController.update)
        .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), cityController.delete);
    app.use('/'+routeName, router);
};
