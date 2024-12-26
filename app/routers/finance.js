const financeController = require("../controller/financeController.js");
const {allowIfLoggedIn, hasPermission} = require("../middlewares/roleAccessControl.js");

module.exports = app => {
    const routeName = "Finances";
    let router = require("express").Router();

    router.get("/finance-plans", allowIfLoggedIn, hasPermission("findAllPlans" + routeName), financeController.plans)
        .post("/create", allowIfLoggedIn, hasPermission("create" + routeName), financeController.create)
        .post("/stripeProcess", allowIfLoggedIn, hasPermission("createStripe" + routeName), financeController.createStripe);
    // .post("/klarnaProcess", allowIfLoggedIn, hasPermission("createKlarna" + routeName), financeController.createKlarna)
    // .post("/klarnaOrder", allowIfLoggedIn, hasPermission("createKlarna" + routeName), financeController.createKlarnaOrder);

    app.use("/" + routeName, router);
};
