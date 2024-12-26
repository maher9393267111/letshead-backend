const validateForm = require("../validation/validate");
const isEmpty = require("../validation/isEmpty");
const fs = require("fs");

function deleteFromBody(body) {
    if ("id" in body) delete body.id;
    if ("createdAt" in body) delete body.createdAt;
    if ("updatedAt" in body) delete body.updatedAt;
    if ("deletedAt" in body) delete body.deletedAt;
    return body;
}

function checkValidation(req, type) {
    try {
        let errors = validateForm(req, type);
        return {errors, isValid: isEmpty(errors)};
    } catch (e) {
        return {errors: e, isValid: false};
    }
}

function deleteImages(images) {
    try {
        images.forEach(path => fs.existsSync(path) && fs.unlinkSync(path))
    } catch (err) {
        console.error(err);
    }
}

function getFreeAddons() {
    return [
        {
            id: -2,
            name: "Pipework installation (upgrading to 22mm gas supply if required)",
            price: 0,
            isActiveQuantity: true,
            image: "/assets/images/addons/pipework.png",
            isStatic: true,
            isExtra: true,
            amount: 1,
        },
        {
            id: -3,
            name: "Electrical work",
            price: 0,
            image: "/assets/images/addons/electric.png",
            isStatic: true,
            isExtra: true,
            amount: 1,
        },
        {
            id: -4,
            name: "Removal of existing boiler & replace with a new boiler",
            price: 0,
            image: "/assets/images/addons/recycle.png",
            isStatic: true,
            isExtra: true,
            amount: 1,
        },
        {
            id: -6,
            name: "Boiler Fittings Pack",
            price: 0,
            image: "/assets/images/addons/package.png",
            isStatic: true,
            isExtra: true,
            amount: 1,
        },
        {
            id: -7, name: "Let's Heat to register the warranty & Building Control Certificate",
            price: 0,
            image: "/assets/images/addons/warranty.png",
            isStatic: true,
            isExtra: true,
            amount: 1,
        },
    ];
}

function getDayName(date = new Date(), locale = 'en-US') {
    return date.toLocaleDateString(locale, {weekday: 'long'});
}

module.exports = {checkValidation, deleteFromBody, deleteImages,getFreeAddons,getDayName};
