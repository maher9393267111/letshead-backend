const http = require("https");
const axios = require("axios");
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);


const options = {
    "method": "GET",  // required
    "hostname": process.env.FINANCE_HOSTNAME,
    "port": null, "path": "", // required
    "headers": {
        "x-divido-api-key": process.env.FINANCE_KEY,
        "content-type": "application/json; charset=UTF-8",
    }
};
exports.plans = async (req, res, next) => {
    options["path"] = "/finance-plans";
    http.request(options, function (response) {
        response.setEncoding('utf8');
        response.on('data', async function (chunk) {
            const plans = await JSON.parse(chunk).data.filter(e => e.active === true);
            res.send(plans);
        });
    }).end();

};

// Create and Save a new Addon
exports.create = async (req, res, next) => {

    const body = req.body;
    const jsonObject = JSON.stringify({
        "finance_plan_id": body.planID, "deposit_percentage": body.deposit_percentage, "applicants": body.applicants, "order_items": body.items, "urls": {
            "merchant_redirect_url": "https://app.letsheat.co.uk/quote/order",
            "merchant_checkout_url": "",
            "merchant_response_url": ""
        }
    });

    options["path"] = "/applications";
    options["method"] = "POST";
    options["body"] = JSON.stringify(req.body);
    options["headers"]["Content-Length"] = Buffer.byteLength(jsonObject, 'utf8');

    let reqPost = http.request(options, function (response) {
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            res.send(chunk);
        });
    });

    reqPost.write(jsonObject);
    reqPost.end();
    reqPost.on('error', function (e) {
        console.error(e);
    });


};

exports.createStripe = async (req, res, next) => {

    const {token, amount, name, phone} = req.body;

    try {
        const customer = await stripe.customers.create({name, phone});


        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'gbp',
            confirm: true,
            payment_method_types: ['card'],
            payment_method_data: {type: 'card', card: {token},},
            payment_method_options: {card: {request_three_d_secure: 'any',},},
            customer: customer.id,
        });
        // console.log(paymentIntent);

        res.status(200).send({clientSecret: paymentIntent.client_secret});
    } catch (error) {
        console.error(error);
        res.status(error.statusCode).json({message: error.message});
    }


};

exports.createKlarna = async (req, res, next) => {


    const orderData = req.body;
    const klarnaApiUrl = process.env.KLARNA_APP_URL_SESSION;
    const klarnaUsername = process.env.KLARNA_USERNAME;
    const klarnaPassword = process.env.KLARNA_PASSWORD;

    try {
        const response = await axios.post(klarnaApiUrl, orderData, {
            headers: {
                'Content-Type': 'application/json', 'Authorization': 'Basic ' + Buffer.from(`${klarnaUsername}:${klarnaPassword}`).toString('base64'),
            }
        });
        res.status(201).json(response.data);
    } catch (error) {
        console.error('Error creating Klarna order:', error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({message: 'An error occurred while creating the order.'});
        }
    }


};

exports.createKlarnaOrder = async (req, res, next) => {


    const orderData = req.body.orderData;
    const authToken = req.body.authToken;
    const klarnaApiUrlOrder = process.env.KLARNA_APP_URL_ORDER;
    const klarnaUsername = process.env.KLARNA_USERNAME;
    const klarnaPassword = process.env.KLARNA_PASSWORD;

    try {
        const response = await axios.post(klarnaApiUrlOrder + authToken + "/order", orderData, {
            headers: {
                'Content-Type': 'application/json', 'Authorization': 'Basic ' + Buffer.from(`${klarnaUsername}:${klarnaPassword}`).toString('base64'),
            }
        });
        res.status(200).send();
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json({message: 'An error occurred with response while creating the order.'});
        } else {
            res.status(500).json({message: 'An error occurred while creating the order.'});
        }
    }


};


