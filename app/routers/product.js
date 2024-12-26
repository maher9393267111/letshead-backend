const productController = require("../controller/productController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");
const uploadController = require("../controller/uploadController");

module.exports = app => {
    const routeName = "Products";
    let router = require("express").Router();

    router.post("/result/:slug", productController.result)
        .get("/sizes/:id", allowIfLoggedIn, hasPermission("findOneSize" + routeName), productController.findSize)
        .put("/update/sizes/:id", allowIfLoggedIn, hasPermission("updateSize" + routeName), productController.updateSize)
        .get("/addons/:id", allowIfLoggedIn, hasPermission("findAllAddons" + routeName), productController.findAddon)
        .put("/update/addons/:id", allowIfLoggedIn, hasPermission("updateAddon" + routeName), productController.updateAddon)
        .get("/prices/:id", allowIfLoggedIn, hasPermission("findOnePrice" + routeName), productController.findPrice)
        .get("/prices", allowIfLoggedIn, hasPermission("findAllPrices" + routeName), productController.findPrices)
        .put("/update/prices/:id", allowIfLoggedIn, hasPermission("updatePrice" + routeName), productController.updatePrice)
        .get("/prices/postcodes/:id", allowIfLoggedIn, hasPermission("findOnePricesPostcode" + routeName), productController.findPostcode)
        .put("/update/prices/postcodes/:id/:isAllProducts?", allowIfLoggedIn, hasPermission("updatePricePostcode" + routeName), productController.updatePostcode)
        .get("/images/:id", productController.findImage)
        .post("/create/images", allowIfLoggedIn, hasPermission("createImage" + routeName), uploadController.uploadImages, productController.createImage)
        .delete("/images/:id/:name", allowIfLoggedIn, hasPermission("deleteImage" + routeName), productController.deleteImage)
        .get("/:isShowDeleted?", allowIfLoggedIn, hasPermission("findAll" + routeName), productController.findAll)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), uploadController.uploadImage, productController.create)
        .put("/update/:id", allowIfLoggedIn, hasPermission("update" + routeName), uploadController.uploadImage, productController.update)
        .delete("/:ids/:isForce?/:isRestore?", allowIfLoggedIn, hasPermission("delete" + routeName), productController.delete);
    app.use("/" + routeName, router);
};
