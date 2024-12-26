const profileController = require("../../controller/eng/profileController.js");
const profileSkillController = require("../../controller/eng/profileSkillController.js");
const availableWorkController = require("../../controller/eng/availableWorkController.js");
const profilePostcodeController = require("../../controller/eng/profilePostcodeController.js");
const profileDocumentController = require("../../controller/eng/profileDocumentController.js");
const {allowIfLoggedIn, hasPermission} = require("../../middlewares/roleAccessControl.js");
const uploadController = require("../../controller/uploadController");

module.exports = app => {
    const routeName = "Profile";
    let router = require("express").Router();

    router.get("/available/:id?", allowIfLoggedIn, hasPermission("findAllAvailable" + routeName), availableWorkController.findAll)
        .post("/available/create", allowIfLoggedIn, hasPermission("createAvailable" + routeName), availableWorkController.create)

        .post("/skills/create", allowIfLoggedIn, hasPermission("createSkill" + routeName), profileSkillController.create)
        .put("/skills/update", allowIfLoggedIn, hasPermission("updateSKill" + routeName), profileSkillController.update)

        .post("/postcode/create", allowIfLoggedIn, hasPermission("createPostcode" + routeName), profilePostcodeController.create)
        .put("/postcode/update", allowIfLoggedIn, hasPermission("updatePostcode" + routeName), profilePostcodeController.update)

        .post("/documents/create", allowIfLoggedIn, hasPermission("createDocument" + routeName), uploadController.uploadMixFiles, profileDocumentController.create)
        .put("/documents/update", allowIfLoggedIn, hasPermission("updateDocument" + routeName), uploadController.uploadMixFiles, profileDocumentController.update)

        .get("/:id?", allowIfLoggedIn, hasPermission("show" + routeName), profileController.show)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), uploadController.uploadImage, profileController.create)
        .put("/update/approve/:id", allowIfLoggedIn, hasPermission("updateApprove" + routeName), profileController.approve)
        .put("/update/:id?", allowIfLoggedIn, hasPermission("update" + routeName), uploadController.uploadImage, profileController.update)
        .delete("/:id", allowIfLoggedIn, hasPermission("delete" + routeName), profileController.delete);

    app.use("/" + routeName , router);
};
