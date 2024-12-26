const express = require("express"), bodyParser = require("body-parser"), cors = require("cors"), passport = require("passport"), helmet = require("helmet"),
    path = require("path");


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const corsAllowList = ["https://boilers.letsheat.co.uk", "https://control.letsheat.co.uk", "https://boilers.letsheat.co.uk", "http://localhost:8080", "http://localhost:8081", "http://localhost:3000", "http://localhost:3001", "http://192.168.0.109:3000"];
const app = express();
// app.use(helmet({
//     contentSecurityPolicy: {directives: {"img-src": ["'self'", "https://control.letsheat.co.uk", "https://demo.letsheat.co.uk", "http://localhost:8081"],}}
// }));
app.use(helmet.hidePoweredBy());
app.use(cors({origin: corsAllowList,}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: "20mb", extended: true}));
app.use(express.static(path.join(__dirname, 'public'), {maxAge: 31557600}));
app.use(passport.initialize());
require("./app/services/passport");


// routes
const routePath = './app/routers/';
require(routePath + "city")(app);
require(routePath + "category")(app);
require(routePath + "postcode")(app);
require(routePath + "manufacturer")(app);
require(routePath + "fuelType")(app);
require(routePath + "boilerType")(app);
require(routePath + "product")(app);
require(routePath + "size")(app);
require(routePath + "price")(app);
require(routePath + "addon")(app);
require(routePath + "auth")(app);
require(routePath + "user")(app);
require(routePath + "question")(app);
require(routePath + "subject")(app);
require(routePath + "contact")(app);
require(routePath + "installQuestion")(app);
require(routePath + "installAnswer")(app);
require(routePath + "imageType")(app);
require(routePath + "coupon")(app);
require(routePath + "availableInstallations")(app);
require(routePath + "localServices/jobCategory")(app);
require(routePath + "localServices/customer")(app);
require(routePath + "localServices/service")(app);
require(routePath + "order")(app);
require(routePath + "skill")(app);
require(routePath + "eng/profile")(app);
require(routePath + "assignEngineer")(app);
require(routePath + "imageOrder")(app);
require(routePath + "finance")(app);
require(routePath + "noteOrder")(app);
require(routePath + "quote")(app);
require(routePath + "plan")(app);
require(routePath + "option")(app);
require(routePath + "emailTemplate")(app);
require(routePath + "emailOrder")(app);
require(routePath + "care/planService")(app);
require(routePath + "care/planUser")(app);
require(routePath + "care/appliance")(app);
require(routePath + "role")(app);
require(routePath + "permission")(app);
require(routePath + "eng/noteProfile")(app);
require(routePath + "statist")(app);
require(routePath + "guestResult")(app);
require(routePath + "manualQuote")(app);

// Catch Error Handle
app.use((req, res, next) => {
    let error = new Error();
    error.status = 404;
    error.message = "Not Found";
    next(error);
});

app.use((error, req, res, next) => {
    // console.log("error -- "+error);
    // console.log("next --"+next);
    if (error.type === "redirect") {
        res.redirect("/error");
    } else if (error.type === "time-out") {
        res.status(error.status || 500).send({errors: {error: error.message}});
    } else if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
        res.status(error.status || 500).send({errors: {error: error.type}});
    } else if (error.name === "SequelizeForeignKeyConstraintError") {
        res.status(error.status || 400).send({errors: {error: "Some fields are dependents on the other fields that have not been found"}});
    } else if (error.name === "SequelizeUniqueConstraintError") {
        res.status(error.status || 400).send({errors: {error: "Unique key has been duplicated"}});
    } else if (error.name === "ERR_HTTP_HEADERS_SENT") {
        res.status(error.status || 400).send({errors: {error: "There are error in processing code after sending the response"}});
    } else {
        res.status(error.status || 500).send({errors: {error: error.message}});
    }
});






// set port, listen for requests
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('Hello Worldss!');
  });

// Server for localhost or website withOut SSL
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});