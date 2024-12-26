const auth = require("../controller/authController.js");
module.exports = app => {
    let router = require("express").Router();

    router.post("/login", auth.login)
    .post("/register", auth.register)
    .post("/info", auth.findUser);
    app.use('/auth', router);
};
