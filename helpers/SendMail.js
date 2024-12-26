const sgMail = require('@sendgrid/mail')
const path = require("path");
const fs = require("fs");
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");
const crypto = require("crypto");
const {ImageOrder} = require("../models");
const {isNumber} = require("lodash");


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function getTemplateHtml(data, isPdfTemplate, type) {

    try {
        const invoicePath = path.join(__dirname, '..', process.env.MAIL_STORAGE, (isPdfTemplate === false) ? 'global.html' : (type === 5) ? 'quote.html' : 'invoice.html');
        const file = fs.readFileSync(invoicePath, 'utf8');
        const template = handlebars.compile(file, {strict: true});
        return template(data);
    } catch (err) {
        return console.log(err.toString());
    }
}

async function generatePdf(html, pdfName, type) {
    try {
        const browser = await puppeteer.launch({
            headless: "new", // args: ['--no-sandbox', '--disable-setuid-sandbox'],
            executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        });
        const page = await browser.newPage();

        await page.setContent(html);

        await page.pdf({
            path: path.join(__dirname, '..', type === 5 ? process.env.QUOTE_STORAGE : process.env.INVOICE_STORAGE, pdfName + '.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true
        })

        await browser.close();
    } catch (err) {
        console.log(err.toString());
    }

}

function getPdfFile(name, type) {
    return fs.readFileSync(path.join(__dirname, '..', type === 5 ? process.env.QUOTE_STORAGE : process.env.INVOICE_STORAGE, name + '.pdf')).toString("base64");
}

function getImage(imagePath, imageName) {
    return "data:image/png;base64," + fs.readFileSync(path.join(__dirname, '..', imagePath, imageName)).toString("base64");
}

function getMailContent(type, name, data = null) {
    let title = null, body = null;
    switch (type) {
        case 1:
            title = "Welcome to Let's Heat!";
            body = "Good News!<br><br>Your account has been approved, and you can use application to manage your availability. It's important that you keep this information up to date, or we may not be able to assign installations to you.";
            break;
        case 2:
            title = data.mailTitle;
            body = data.mailContent;
            break;
        case 3:
            title = "An update on your Let's Heat application";
            body = "We just thought you'd like to know that your boiler installation has been confirmed and your installation will take place on " + data.installDate + "<br><br>Your engineer will be, " + data.engName + " and they will be in touch with more information soon.";
            break;
        case 4:
            title = "Let's Heat: Please submit your photos before so we can confirm your installation.";
            body = "Thank you for your order with Let's Heat. For us to process your order, we need you to submit some photographs of your boiler and your property<br><br>To ensure we can install on your chosen day, you'll need to submit these within the next 4 hours.<br><br> <a href=" + data.imageUploadUrl + ">Click here </a> to submit your photos.";
            break;
        case 5:
            title = "Your quote from Let's Heat";
            body = "Here's the quote which you saved (LH" + (data.id) + ")<br><br>Pick a date today, and your new boiler could be installed as quickly as tomorrow. You can pay in full, or spread the cost with low monthly payments.";
            break;
        case 6:
            title = "Your new boiler order confirmation";
            body = "Thank you for choosing Let's Heat to install your brand-new " + data.manufactureName + " boiler!<br><br>This is a confirmation of your order, please check everything is correct below, and if something isn't quite right, please call 03301 746 700 as soon as possible.<br><br>Installation date: " + data.installDate + "<br><br>If you have chosen the finance payment option, you will receive a separate email from our finance partner. You must continue your application directly, and your order will be processed once we receive confirmation from them.";
            break;
        case 7:
            title = "Request a call back";
            body = "A new customer has requested a call back, please log in and follow up on this request.";
            break;
        case 8:
            title = "New photos uploaded";
            body = "A customer has uploaded new photos for the job # " + data.id + ", please log in and check out the photos.";
            break;
        default:
            title = "Your Let's Heat Application";
            body = "Thank you for applying to be a Let's Heat engineer.<br>We're reviewing your application and will be in touch shortly.";
    }

    const append1 = "<p>Hi " + name + "!<br><br>";
    const append2 = "<br><br>If you have any questions in the meantime, please call our team on 03301 746 700</p>";
    body = append1 + body + append2;

    return {title, body};
}

const sendMail = async (type, email, name, map) => {

    let mailContent, data;
    mailContent = getMailContent(type, name, map);

    data = {"dateYear": new Date().getFullYear(), "body": mailContent.body};
    const htmlTemplate = await getTemplateHtml(data, false, type);

    let pdfName = null;
    if (type === 5 || type === 6) {
        let pdfTemplate;
        if (type === 5) {
            data = {
                "boilerName": map.boilerName,
                "id": map.id,
                "customerEmail": map.customerEmail,
                "customerPhone": map.customerPhone,
                "createdAt": map.createdAt,
                "total": map.total,
                "boilerPrice": map.boilerPrice,
                "boilerImage": getImage(process.env.AVATAR_STORAGE, map.boilerImage),
                "questions": map.questions,
                "phoneIcon": getImage(process.env.MAIL_STORAGE, 'icons/pdf/icon2.png'),
                "webIcon": getImage(process.env.MAIL_STORAGE, 'icons/pdf/icon3.png'),
                "mailIcon": getImage(process.env.MAIL_STORAGE, 'icons/pdf/icon4.png'),
                "safeIcon": getImage(process.env.MAIL_STORAGE, 'icons/pdf/safe-logo.jpg'),
            };
        } else {
            data = map;
        }
        pdfTemplate = await getTemplateHtml(data, true, type);

        const bytes = crypto.pseudoRandomBytes(32);
        pdfName = crypto.createHash('MD5').update(bytes).digest('hex');

        await generatePdf(pdfTemplate, pdfName, type);
    }

    const msg = {
            To: email,
            from: process.env.SENDMAIL_FROM,
            cc: ((type === 7) || (type === 8)) ? null : process.env.SENDMAIL_CC,
        subject: mailContent.title,
        html: htmlTemplate,
        attachments: ((type !== 6 && type !== 5) || (Number(map.paymentType) === 4)) ? [] : [{
                content: getPdfFile(pdfName, type), filename: "document.pdf", type: "application/pdf", disposition: "attachment"
            }],
        };
        try {
            await sgMail.send(msg);
        } catch (e) {
            console.error(e.message);
        }

    if (type === 6) {
        await ImageOrder.create({
            orderID: Number(map.id), imageTypeID: process.env.IMAGE_TYPE_ID, image: pdfName + '.pdf', title: process.env.INVOICE_TITLE
        });
    }
}

module.exports = {sendMail}