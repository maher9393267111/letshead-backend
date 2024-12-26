const validator = require('validatorjs');
const isEmpty = require("./isEmpty");

function validateForm(req, type) {
    let errors, data, validation, validationRule = {}, validationData = {};

    data = req.body;

    if (req.method === "POST") {

        switch (type) {
            case "register":
            case "login":
            case "checkUser":

                validationRule.username = "required|string|min:11|max:11";
                validationData.username = data.username;

                if (type === "login" || type === "register") {
                    validationRule.password = "required|string";
                    validationData.password = data.password;
                } else if (type === "register") {
                    validationRule.name = "required|string|min:3|max:150";
                    validationData.name = data.name;

                    validationRule.email = "required|string|email|min:1";
                    validationData.email = data.email;
                }


                break;
            case "City":
            case "Subject":
            case "Contact":
            case "Skill":
            case "Size":
            case "Manufacturer":
            case "JobCategory":
            case "InstallQuestion":
            case "ImageType":
            case "FuelType":
            case "Category":
            case "EmailTemplate":
            case "BoilerType":

                validationRule.name = "required|string|min:3|max:150";
                validationData.name = data.name;

                validationRule.isActive = "boolean";
                validationData.isActive = data.isActive;
                if (type === "Contact") {
                    validationRule.email = "required|string|email|min:1";
                    validationData.email = data.email;

                    validationRule.address = "string|min:1|max:150";
                    validationData.address = data.address;

                    validationRule.postcode = "string|min:1|max:150";
                    validationData.postcode = data.postcode;

                    validationRule.phone = "required|string|min:11|max:11";
                    validationData.phone = data.phone;

                    validationRule.address = "string";
                    validationData.address = data.address;

                    validationRule.postcode = "string";
                    validationData.postcode = data.postcode;

                    validationRule.body = "string";
                    validationData.body = data.body;

                    validationRule.subjectID = "numeric";
                    validationData.subjectID = data.subjectID;

                    validationRule.enquiryID = "numeric";
                    validationData.enquiryID = data.enquiryID;

                    validationRule.image = "string";
                    validationData.image = data.image;

                    validationRule.note = "string";
                    validationData.note = data.note;

                } else if (type === "EmailTemplate") {
                    validationRule.templateTitle = "required|string";
                    validationData.templateTitle = data.templateTitle;

                    validationRule.templateContent = "required|string";
                    validationData.templateContent = data.templateContent;

                } else if (type === "Category") {
                    validationRule.isDynamicSelect = "required|boolean";
                    validationData.isDynamicSelect = data.isDynamicSelect;

                    validationRule.orderAt = "required|numeric";
                    validationData.orderAt = data.orderAt;

                } else if (type === "Subject") {
                    validationRule.isTypeEnquiry = "required|boolean";
                    validationData.isTypeEnquiry = data.isTypeEnquiry;
                } else if (type === "BoilerType") {
                    validationRule.parentID = "required|numeric";
                    validationData.parentID = data.parentID;
                } else if (type === "Skill") {
                    validationRule.parentID = "required|numeric";
                    validationData.parentID = data.parentID;
                } else if (type === "Manufacturer") {
                    validationRule.isForAddon = "required|boolean";
                    validationData.isForAddon = data.isForAddon;
                } else if (type === "JobCategory") {
                    validationRule.isTypeCategory = "required|boolean";
                    validationData.isTypeCategory = data.isTypeCategory;
                } else if (type === "InstallQuestion") {
                    validationRule.isPreInstall = "required|boolean";
                    validationData.isPreInstall = data.isPreInstall;
                    validationRule.type = "required|numeric";
                    validationData.type = data.type;
                    validationRule.orderNum = "required|numeric";
                    validationData.orderNum = data.orderNum;
                } else if (type === "ImageType") {

                    validationRule.parentID = "required|numeric";
                    validationData.parentID = data.parentID;

                    validationRule.orderNum = "required|numeric";
                    validationData.orderNum = data.orderNum;

                    validationRule.maxAllowed = "required|numeric";
                    validationData.maxAllowed = data.maxAllowed;

                    validationRule.isRequired = "required|boolean";
                    validationData.isRequired = data.isRequired;

                } else if (type === "Size") {
                    validationRule.parentID = "required|numeric";
                    validationData.parentID = data.parentID;
                    validationRule.type = "required|numeric";
                    validationData.type = data.type;
                    validationRule.value = "required|numeric";
                    validationData.value = data.value;
                }

                break;
            case "Service":

                validationRule.userID = "required|numeric";
                validationData.userID = data.userID;

                validationRule.typeID = "required|numeric";
                validationData.typeID = data.typeID;

                validationRule.categoryID = "required|numeric";
                validationData.categoryID = data.categoryID;

                validationRule.price = "required|numeric";
                validationData.price = data.price;

                validationRule.priority = "required|numeric";
                validationData.priority = data.priority;

                validationRule.note = "required|string|max:1000";
                validationData.note = data.note;

                validationRule.bookingDate = "required|date";
                validationData.bookingDate = data.bookingDate;

                validationRule.startTime = "required|string";
                validationData.startTime = data.startTime;

                validationRule.endTime = "required|string";
                validationData.endTime = data.endTime;

                validationRule.isActive = "boolean";
                validationData.isActive = data.isActive;

                break;

            case "QuoteQuestion":
                validationRule.quoteID = "required|numeric";
                validationData.quoteID = data.quoteID;

                validationRule.questionID = "required|numeric";
                validationData.questionID = data.questionID;

                validationRule.answerID = "required|numeric";
                validationData.answerID = data.answerID;

                break;

            case "Quote":

                validationRule.productID = "required|numeric";
                validationData.productID = data.productID;

                validationRule.subPostcode = "required|string";
                validationData.subPostcode = data.subPostcode;

                validationRule.name = "required|string";
                validationData.name = data.name;

                validationRule.email = "required|email";
                validationData.email = data.email;

                validationRule.phone = "required|string|min:11|max:11";
                validationData.phone = data.phone;


                break;

            case "Question":
                validationRule.orderNum = "required|numeric";
                validationData.orderNum = data.orderNum;

                validationRule.isShowHelpText = "required|boolean";
                validationData.isShowHelpText = data.isShowHelpText;

                validationRule.isShowHelpVideo = "required|boolean";
                validationData.isShowHelpVideo = data.isShowHelpVideo;

                validationRule.helpText = "required|string|max:1000";
                validationData.helpText = data.helpText;

                validationRule.helpVideo = "required|string";
                validationData.helpVideo = data.helpVideo;

                validationRule.parentID = "required|numeric";
                validationData.parentID = data.parentID;

                validationRule.destinationID = "required|numeric";
                validationData.destinationID = data.destinationID;

                validationRule.dependenceType = "required|numeric";
                validationData.dependenceType = data.dependenceType;

                validationRule.dependenceID = "required|numeric";
                validationData.dependenceID = data.dependenceID;

                validationRule.optStatus = "required|numeric";
                validationData.optStatus = data.optStatus;

                validationRule.isQuestion = "required|boolean";
                validationData.isQuestion = data.isQuestion;

                break;

            case "ProfileSkill":
            case "PostcodeProfile":

                validationRule.profileID = "required|numeric";
                validationData.profileID = data.profileID;

                if (type === "ProfileSkill") {
                    validationRule.skillID = "required|numeric";
                    validationData.skillID = data.skillID;
                } else if (type === "PostcodeProfile") {
                    validationRule.postcodeID = "required|numeric";
                    validationData.postcodeID = data.postcodeID;
                }

                break;

            case "ProductSize":
            case "ProductPlan":
            case "PostcodePrice":
            case "ImageProduct":
            case "AddonProduct":

                validationRule.productID = "required|numeric";
                validationData.productID = data.productID;

                if (type === "ProductPlan") {
                    validationRule.planID = "required|numeric";
                    validationData.planID = data.planID;
                } else if (type === "ProductSize") {
                    validationRule.sizeID = "required|numeric";
                    validationData.sizeID = data.sizeID;
                } else if (type === "PostcodePrice") {
                    validationRule.postCodeID = "required|numeric";
                    validationData.postCodeID = data.postCodeID;
                    validationRule.price = "required|numeric";
                    validationData.price = data.price;
                } else if (type === "ImageProduct") {
                    validationRule.image = "required|string";
                    validationData.image = data.image;

                } else if (type === "AddonProduct") {
                    validationRule.addonID = "required|numeric";
                    validationData.addonID = data.addonID;

                    validationRule.isDefault = "required|boolean";
                    validationData.isDefault = data.isDefault;


                }

                break;

            case "Profile":

                validationRule.houseNumber = "string";
                validationData.houseNumber = data.houseNumber;

                validationRule.image = "string";
                validationData.image = data.image;

                validationRule.companyName = "required|string";
                validationData.companyName = data.companyName;

                validationRule.companyGasNumber = "required|numeric";
                validationData.companyGasNumber = data.companyGasNumber;

                validationRule.companyLicenseNumber = "required|numeric";
                validationData.companyLicenseNumber = data.companyLicenseNumber;

                validationRule.companyAddress2 = "string";
                validationData.companyAddress2 = data.companyAddress2;

                validationRule.companyCity = "required|string";
                validationData.companyCity = data.companyCity;

                validationRule.companyPostcode = "required|string";
                validationData.companyPostcode = data.companyPostcode;

                validationRule.isLimitedCompany = "required|boolean";
                validationData.isLimitedCompany = data.isLimitedCompany;

                validationRule.isVatRegistered = "required|boolean";
                validationData.isVatRegistered = data.isVatRegistered;

                validationRule.companyNumber = "numeric";
                validationData.companyNumber = data.companyNumber;

                validationRule.vatNumber = "numeric";
                validationData.vatNumber = data.vatNumber;

                validationRule.accountName = "required|string";
                validationData.accountName = data.accountName;

                validationRule.accountCode = "required|numeric";
                validationData.accountCode = data.accountCode;

                validationRule.accountNumber = "required|numeric";
                validationData.accountNumber = data.accountNumber;

                break;

            case "Product":

                validationRule.manufacturerID = "required|numeric";
                validationData.manufacturerID = data.manufacturerID;

                validationRule.fuelTypeID = "required|numeric";
                validationData.fuelTypeID = data.fuelTypeID;

                validationRule.boilerTypeID = "required|numeric";
                validationData.boilerTypeID = data.boilerTypeID;

                validationRule.wattage = "required|numeric";
                validationData.wattage = data.wattage;

                validationRule.warranty = "required|numeric";
                validationData.warranty = data.warranty;

                validationRule.warrantyImage = "required|string";
                validationData.warrantyImage = data.warrantyImage;

                validationRule.isRecommend = "required|boolean";
                validationData.isRecommend = data.isRecommend;

                validationRule.efficiencyRating = "required|string";
                validationData.efficiencyRating = data.efficiencyRating;

                validationRule.dimension = "required|string";
                validationData.dimension = data.dimension;

                validationRule.flowRate = "required|numeric";
                validationData.flowRate = data.flowRate;

                validationRule.opt1 = "required|string";
                validationData.opt1 = data.opt1;

                validationRule.opt2 = "required|string";
                validationData.opt2 = data.opt2;

                break;

            case "PriceProduct":
                validationRule.productID = "required|numeric";
                validationData.productID = data.productID;

                validationRule.priceID = "required|numeric";
                validationData.priceID = data.priceID;

                validationRule.price = "required|numeric";
                validationData.price = data.price;

                break;
            case "Addon":

                validationRule.name = "required|string";
                validationData.name = data.name;

                validationRule.manufacturerID = "required|numeric";
                validationData.manufacturerID = data.manufacturerID;

                validationRule.categoryID = "required|numeric";
                validationData.categoryID = data.categoryID;

                validationRule.wattage = "required|numeric";
                validationData.wattage = data.wattage;

                validationRule.warranty = "required|numeric";
                validationData.warranty = data.warranty;

                break;

            case "InstallAnswer":
                validationRule.orderID = "required|numeric";
                validationData.orderID = data.orderID;

                // can not validate inside array of questions.
                // validationRule.installQuestionID = "required|numeric";
                // validationData.installQuestionID = data.installQuestionID;
                //
                // validationRule.multiChoiceAnswer = "required|numeric";
                // validationData.multiChoiceAnswer = data.multiChoiceAnswer;
                //
                // validationRule.shortAnswer = "required|numeric";
                // validationData.shortAnswer = data.shortAnswer;

                break;
            case "Price":
                validationRule.parentID = "required|numeric";
                validationData.parentID = data.parentID;

                validationRule.isMain = "required|boolean";
                validationData.isMain = data.isMain;

                validationRule.isDiscount = "required|boolean";
                validationData.isDiscount = data.isDiscount;

                validationRule.isAdditionalType = "required|boolean";
                validationData.isAdditionalType = data.isAdditionalType;

                validationRule.slug = "string";
                validationData.slug = data.slug;



                break;
            case "Postcode":
                validationRule.cityID = "required|numeric";
                validationData.cityID = data.cityID;

                validationRule.type = "required|numeric";
                validationData.type = data.type;

                break;
            case "PlanUser":

                validationRule.userID = "required|numeric";
                validationData.userID = data.userID;

                validationRule.planServiceID = "required|numeric";
                validationData.planServiceID = data.planServiceID;

                validationRule.price = "required|numeric";
                validationData.price = data.price;

                validationRule.discount = "required|numeric";
                validationData.discount = data.discount;

                validationRule.startedAt = "required|date";
                validationData.startedAt = data.startedAt;

                validationRule.expireAt = "required|date";
                validationData.expireAt = data.expireAt;

                validationRule.status = "required|numeric";
                validationData.status = data.status;

                break;
            case "PlanService":
                validationRule.price = "required|numeric";
                validationData.price = data.price;

                validationRule.discount = "required|numeric";
                validationData.discount = data.discount;

                break;
            case "Plan":
                validationRule.isActive = "boolean";
                validationData.isActive = data.isActive;

                validationRule.planUID = "required|string";
                validationData.planUID = data.planUID;

                validationRule.name = "required|string";
                validationData.name = data.name;

                validationRule.content = "required|string";
                validationData.content = data.content;

                break;
            case "OrderQuestion":
            case "ImageOrder":
                validationRule.orderID = "required|numeric";
                validationData.orderID = data.orderID;

                if (type === "OrderQuestion") {
                    validationRule.questionID = "required|numeric";
                    validationData.questionID = data.questionID;

                    validationRule.answerID = "required|numeric";
                    validationData.answerID = data.answerID;
                } else if (type === "OrderQuestion") {
                    validationRule.imageTypeID = "required|numeric";
                    validationData.imageTypeID = data.imageTypeID;

                    validationRule.image = "required|string";
                    validationData.image = data.image;

                    validationRule.title = "required|string";
                    validationData.title = data.title;
                }

                break;
            case "Order":

                validationRule.uuid = "string";
                validationData.uuid = data.uuid;

                validationRule.userID = "required|numeric";
                validationData.userID = data.userID;

                validationRule.couponID = "numeric";
                validationData.couponID = data.couponID;

                validationRule.couponPrice = "numeric";
                validationData.couponPrice = data.couponPrice;

                validationRule.productID = "required|numeric";
                validationData.productID = data.productID;

                validationRule.productTotalPrice = "required|numeric";
                validationData.productTotalPrice = data.productTotalPrice;

                validationRule.total = "required|numeric";
                validationData.total = data.total;

                validationRule.subPostcode = "required|string";
                validationData.subPostcode = data.subPostcode;

                validationRule.installDate = "required|date";
                validationData.installDate = data.installDate;

                validationRule.installPrice = "required|numeric";
                validationData.installPrice = data.installPrice;

                validationRule.postcodePrice = "required|numeric";
                validationData.postcodePrice = data.postcodePrice;

                validationRule.discount = "required|numeric";
                validationData.discount = data.discount;

                validationRule.tax = "required|numeric";
                validationData.tax = data.tax;

                validationRule.preQuestionStatus = "numeric";
                validationData.preQuestionStatus = data.preQuestionStatus;

                validationRule.postQuestionStatus = "numeric";
                validationData.postQuestionStatus = data.postQuestionStatus;

                validationRule.imageEvidenceStatus = "numeric";
                validationData.imageEvidenceStatus = data.imageEvidenceStatus;

                validationRule.preQuestionCancelReason = "string";
                validationData.preQuestionCancelReason = data.preQuestionCancelReason;

                validationRule.postQuestionCancelReason = "string";
                validationData.postQuestionCancelReason = data.postQuestionCancelReason;

                validationRule.imageEvidenceCancelReason = "string";
                validationData.imageEvidenceCancelReason = data.imageEvidenceCancelReason;

                validationRule.note = "string";
                validationData.note = data.note;

                validationRule.cancelReason = "string";
                validationData.cancelReason = data.cancelReason;

                validationRule.type = "required|numeric";
                validationData.type = data.type;

                validationRule.imageSubmitStatus = "boolean";
                validationData.imageSubmitStatus = data.imageSubmitStatus;

                validationRule.planID = "string";
                validationData.planID = data.planID;

                break;
            case "Option":
                validationRule.key = "required|string";
                validationData.key = data.key;

                validationRule.value = "required|string";
                validationData.value = data.value;

                break;
            case "NoteOrder":
                validationRule.orderID = "required|numeric";
                validationData.orderID = data.orderID;

                validationRule.title = "required|string";
                validationData.title = data.title;

                validationRule.body = "required|string";
                validationData.body = data.body;

                break;
            // case "ImageProfile":
            //     validationRule.profileID = "required|numeric";
            //     validationData.profileID = data.profileID;
            //
            //     validationRule.imageTypeID = "required|numeric";
            //     validationData.imageTypeID = data.imageTypeID;
            //
            //     validationRule.image = "required|string";
            //     validationData.image = data.image;
            //
            //     validationRule.expire = "required|date";
            //     validationData.expire = data.expire;
            //
            //     break;

            case "EmailOrder":
                validationRule.userID = "required|numeric";
                validationData.userID = data.userID;

                validationRule.orderID = "required|numeric";
                validationData.orderID = data.orderID;

                validationRule.templateID = "required|numeric";
                validationData.templateID = data.templateID;

                validationRule.mailTitle = "required|string";
                validationData.mailTitle = data.mailTitle;

                validationRule.mailContent = "required|string";
                validationData.mailContent = data.mailContent;

                break;
            case "AvailableWork":
            case "AvailableInstallation":

                validationRule.startDate = "required|date";
                validationData.startDate = data.startDate;

                validationRule.endDate = "required|date";
                validationData.endDate = data.endDate;


                break;

            case "AssignEngineer":
                validationRule.orderID = "required|numeric";
                validationData.orderID = data.orderID;

                validationRule.userID = "required|numeric";
                validationData.userID = data.userID;

                validationRule.price = "required|numeric";
                validationData.price = data.price;

                validationRule.isVerticalFlue = "required|boolean";
                validationData.isVerticalFlue = data.isVerticalFlue;

                validationRule.engNote = "string";
                validationData.engNote = data.engNote;

                validationRule.status = "numeric";
                validationData.status = data.status;

                break;
            case "Appliance":
                validationRule.name = "required|string";
                validationData.name = data.name;

                validationRule.planUserID = "required|numeric";
                validationData.planUserID = data.planUserID;

                validationRule.applianceService = "required|numeric";
                validationData.applianceService = data.applianceService;

                validationRule.location = "required|string";
                validationData.location = data.location;

                validationRule.type = "required|string";
                validationData.type = data.type;

                validationRule.model = "required|string";
                validationData.model = data.model;

                validationRule.additional = "required|string";
                validationData.additional = data.additional;

                validationRule.warrantyStartedAt = "required|date";
                validationData.warrantyStartedAt = data.warrantyStartedAt;

                validationRule.warrantyEndedAt = "required|date";
                validationData.warrantyEndedAt = data.warrantyEndedAt;

                break;
            case "AddonOrder":
                validationRule.orderID = "required|numeric";
                validationData.orderID = data.orderID;

                validationRule.addonID = "required|numeric";
                validationData.addonID = data.addonID;

                validationRule.price = "required|numeric";
                validationData.price = data.price;

                validationRule.amount = "required|numeric";
                validationData.amount = data.amount;

                validationRule.total = "required|numeric";
                validationData.total = data.total;

                break;
            case "Customer":
            case "AddressOrder":
                if (type === "Customer") {
                    validationRule.title = "required|numeric";
                    validationData.title = data.title;

                    validationRule.userID = "required|numeric";
                    validationData.userID = data.userID;

                    validationRule.mobile = "required|string";
                    validationData.mobile = data.mobile;

                    validationRule.phone = "required|string";
                    validationData.phone = data.phone;


                } else {
                    validationRule.orderID = "required|numeric";
                    validationData.orderID = data.orderID;
                }
                validationRule.title = "required|numeric";
                validationData.title = data.title;

                validationRule.userID = "required|numeric";
                validationData.userID = data.userID;

                validationRule.mobile = "required|string";
                validationData.mobile = data.mobile;

                validationRule.phone = "required|string";
                validationData.phone = data.phone;

                validationRule.addressLine1 = "required|string";
                validationData.addressLine1 = data.addressLine1;

                validationRule.addressLine2 = "required|string";
                validationData.addressLine2 = data.addressLine2;

                validationRule.city = "required|string";
                validationData.city = data.city;

                validationRule.postcode = "required|string";
                validationData.postcode = data.postcode;

                validationRule.installLine1 = "required|string";
                validationData.installLine1 = data.installLine1;

                validationRule.installLine2 = "required|string";
                validationData.installLine2 = data.installLine2;

                validationRule.installCity = "required|string";
                validationData.installCity = data.installCity;

                validationRule.installPostcode = "required|string";
                validationData.installPostcode = data.installPostcode;

                validationRule.isSameInstall = "required|boolean";
                validationData.isSameInstall = data.isSameInstall;

                break;

            case "Coupon":
                validationRule.code = "required|string";
                validationData.code = data.code;

                validationRule.value = "required|numeric";
                validationData.value = data.value;

                validationRule.expire = "required|date";
                validationData.expire = data.expire;

                validationRule.isPercent = "required|boolean";
                validationData.isPercent = data.isPercent;
                break;

            case "Role":
            case "Permission":
                validationRule.slug = "required|string";
                validationData.slug = data.slug;

                validationRule.displayName = "string";
                validationData.displayName = data.displayName;

                break;

            case "ManualQuoteStatus":
                validationRule.isAccepted = "required|boolean";
                validationData.isAccepted = data.isAccepted;
                break;

        }


    } else {

        if (!isEmpty(data.name) || data.name != null) {
            validationRule.name = "required|string|min:1|max:150";
            validationData.name = data.name;
        }

        if (!isEmpty(data.isActive) || data.isActive != null) {
            validationRule.isActive = "required|boolean";
            validationData.isActive = data.isActive;
        }

        switch (type) {
            case "register":

                if (!isEmpty(data.role) || data.role != null) {
                    validationRule.role = "required|string|min:3|in:basic,staff,supervisor,admin";
                    validationData.role = data.role;
                }

                if (!isEmpty(data.username) || data.username != null) {
                    validationRule.username = "required|string|min:11|max:11";
                    validationData.username = data.username;
                }


                if (!isEmpty(data.password) || data.password != null) {
                    validationRule.password = "required|string";
                    validationData.password = data.password;
                }

                break;
            case "Subject":
                if (!isEmpty(data.isTypeEnquiry) || data.isTypeEnquiry != null) {
                    validationRule.isTypeEnquiry = "required|boolean";
                    validationData.isTypeEnquiry = data.isTypeEnquiry;
                }

                break;
            case "Skill":
                if (!isEmpty(data.parentID) || data.parentID != null) {
                    validationRule.parentID = "required|numeric";
                    validationData.parentID = data.parentID;
                }

                break;
            case "Manufacturer":
                if (!isEmpty(data.isForAddon) || data.isForAddon != null) {
                    validationRule.isForAddon = "required|boolean";
                    validationData.isForAddon = data.isForAddon;
                }

                break;
            case "BoilerType":
                if (!isEmpty(data.parentID) || data.parentID != null) {
                    validationRule.parentID = "required|numeric";
                    validationData.parentID = data.parentID;
                }

                break;
            case "EmailTemplate":
                if (!isEmpty(data.templateTitle) || data.templateTitle != null) {
                    validationRule.templateTitle = "required|string";
                    validationData.templateTitle = data.templateTitle;
                }
                if (!isEmpty(data.templateContent) || data.templateContent != null) {
                    validationRule.templateContent = "required|string";
                    validationData.templateContent = data.templateContent;
                }

                break;
            case "Category":
                if (!isEmpty(data.isDynamicSelect) || data.isDynamicSelect != null) {
                    validationRule.isDynamicSelect = "required|boolean";
                    validationData.isDynamicSelect = data.isDynamicSelect;
                }
                if (!isEmpty(data.orderAt) || data.orderAt != null) {
                    validationRule.orderAt = "required|numeric";
                    validationData.orderAt = data.orderAt;
                }

                break;
            case "JobCategory":
                if (!isEmpty(data.isTypeCategory) || data.isTypeCategory != null) {
                    validationRule.isTypeCategory = "required|boolean";
                    validationData.isTypeCategory = data.isTypeCategory;
                }

                break;
            case "InstallQuestion":
                if (!isEmpty(data.isPreInstall) || data.isPreInstall != null) {
                    validationRule.isPreInstall = "required|boolean";
                    validationData.isPreInstall = data.isPreInstall;
                }
                if (!isEmpty(data.type) || data.type != null) {
                    validationRule.type = "required|numeric";
                    validationData.type = data.type;
                }
                if (!isEmpty(data.orderNum) || data.orderNum != null) {
                    validationRule.orderNum = "required|numeric";
                    validationData.orderNum = data.orderNum;
                }

                break;

            case "Size":
                if (!isEmpty(data.parentID) || data.parentID != null) {
                    validationRule.parentID = "required|numeric";
                    validationData.parentID = data.parentID;
                }
                if (!isEmpty(data.type) || data.type != null) {
                    validationRule.type = "required|numeric";
                    validationData.type = data.type;
                }
                if (!isEmpty(data.value) || data.value != null) {
                    validationRule.value = "required|numeric";
                    validationData.value = data.value;
                }


                break;
            case "QuoteQuestion":
                if (!isEmpty(data.quoteID) || data.quoteID != null) {
                    validationRule.quoteID = "required|numeric";
                    validationData.quoteID = data.quoteID;
                }
                if (!isEmpty(data.questionID) || data.questionID != null) {
                    validationRule.questionID = "required|numeric";
                    validationData.questionID = data.questionID;
                }
                if (!isEmpty(data.answerID) || data.answerID != null) {
                    validationRule.answerID = "required|numeric";
                    validationData.answerID = data.answerID;
                }

                break;
            case "Service":
                if (!isEmpty(data.userID) || data.userID != null) {
                    validationRule.userID = "required|numeric";
                    validationData.userID = data.userID;
                }
                if (!isEmpty(data.typeID) || data.typeID != null) {
                    validationRule.typeID = "required|numeric";
                    validationData.typeID = data.typeID;
                }
                if (!isEmpty(data.categoryID) || data.categoryID != null) {
                    validationRule.categoryID = "required|numeric";
                    validationData.categoryID = data.categoryID;
                }
                if (!isEmpty(data.price) || data.price != null) {
                    validationRule.price = "required|numeric";
                    validationData.price = data.price;
                }
                if (!isEmpty(data.priority) || data.priority != null) {
                    validationRule.priority = "required|numeric";
                    validationData.priority = data.priority;
                }
                if (!isEmpty(data.note) || data.note != null) {
                    validationRule.note = "required|string|max:1000";
                    validationData.note = data.note;
                }
                if (!isEmpty(data.bookingDate) || data.bookingDate != null) {
                    validationRule.bookingDate = "required|date";
                    validationData.bookingDate = data.bookingDate;
                }
                if (!isEmpty(data.startTime) || data.startTime != null) {
                    validationRule.startTime = "required|string";
                    validationData.startTime = data.startTime;
                }
                if (!isEmpty(data.endTime) || data.endTime != null) {
                    validationRule.endTime = "required|string";
                    validationData.endTime = data.endTime;
                }

                break;

            case "Quote":

                if (!isEmpty(data.productID) || data.productID != null) {
                    validationRule.productID = "required|numeric";
                    validationData.productID = data.productID;
                }

                if (!isEmpty(data.subPostcode) || data.subPostcode != null) {
                    validationRule.subPostcode = "required|string";
                    validationData.subPostcode = data.subPostcode;
                }
                if (!isEmpty(data.name) || data.name != null) {
                    validationRule.name = "required|string";
                    validationData.name = data.name;
                }
                if (!isEmpty(data.email) || data.email != null) {
                    validationRule.email = "required|email";
                    validationData.email = data.email;
                }
                if (!isEmpty(data.phone) || data.phone != null) {
                    validationRule.phone = "required|string|min:11|max:11";
                    validationData.phone = data.phone;
                }

                break;
            case "Question":
                if (!isEmpty(data.orderNum) || data.orderNum != null) {
                    validationRule.orderNum = "required|numeric";
                    validationData.orderNum = data.orderNum;
                }
                if (!isEmpty(data.isShowHelpText) || data.isShowHelpText != null) {
                    validationRule.isShowHelpText = "required|boolean";
                    validationData.isShowHelpText = data.isShowHelpText;
                }
                if (!isEmpty(data.isShowHelpVideo) || data.isShowHelpVideo != null) {
                    validationRule.isShowHelpVideo = "required|boolean";
                    validationData.isShowHelpVideo = data.isShowHelpVideo;
                }
                if (!isEmpty(data.helpText) || data.helpText != null) {
                    validationRule.helpText = "required|string|max:1000";
                    validationData.helpText = data.helpText;
                }
                if (!isEmpty(data.helpVideo) || data.helpVideo != null) {
                    validationRule.helpVideo = "required|string";
                    validationData.helpVideo = data.helpVideo;
                }
                if (!isEmpty(data.image) || data.image != null) {
                    validationRule.image = "string|max:1000";
                    validationData.image = data.image;
                }
                if (!isEmpty(data.parentID) || data.parentID != null) {
                    validationRule.parentID = "required|numeric";
                    validationData.parentID = data.parentID;
                }
                if (!isEmpty(data.destinationID) || data.destinationID != null) {
                    validationRule.destinationID = "required|numeric";
                    validationData.destinationID = data.destinationID;
                }
                if (!isEmpty(data.dependenceType) || data.dependenceType != null) {
                    validationRule.dependenceType = "required|numeric";
                    validationData.dependenceType = data.dependenceType;
                }
                if (!isEmpty(data.dependenceID) || data.dependenceID != null) {
                    validationRule.dependenceID = "required|numeric";
                    validationData.dependenceID = data.dependenceID;
                }
                if (!isEmpty(data.optStatus) || data.optStatus != null) {
                    validationRule.optStatus = "required|numeric";
                    validationData.optStatus = data.optStatus;
                }
                if (!isEmpty(data.isQuestion) || data.isQuestion != null) {
                    validationRule.isQuestion = "required|boolean";
                    validationData.isQuestion = data.isQuestion;
                }

                break;
            case "ProfileSkill":
            case "PostcodeProfile":

                if (!isEmpty(data.profileID) || data.profileID != null) {
                    validationRule.profileID = "required|numeric";
                    validationData.profileID = data.profileID;
                }
                if (!isEmpty(data.skillID) || data.skillID != null) {
                    validationRule.skillID = "required|numeric";
                    validationData.skillID = data.skillID;
                }
                if (!isEmpty(data.postcodeID) || data.postcodeID != null) {
                    validationRule.postcodeID = "required|numeric";
                    validationData.postcodeID = data.postcodeID;
                }


                break;

            case "ProductSize":
            case "ProductPlan":
            case "ImageProduct":
            case "AddonProduct":
                if (!isEmpty(data.productID) || data.productID != null) {
                    validationRule.productID = "required|numeric";
                    validationData.productID = data.productID;
                }

                if (!isEmpty(data.sizeID) || data.sizeID != null) {
                    validationRule.sizeID = "required|numeric";
                    validationData.sizeID = data.sizeID;
                }
                if (!isEmpty(data.planID) || data.planID != null) {
                    validationRule.planID = "required|numeric";
                    validationData.planID = data.planID;
                }
                if (!isEmpty(data.postCodeID) || data.postCodeID != null) {
                    validationRule.postCodeID = "required|numeric";
                    validationData.postCodeID = data.postCodeID;
                }
                if (!isEmpty(data.price) || data.price != null) {
                    validationRule.price = "required|numeric";
                    validationData.price = data.price;
                }
                if (!isEmpty(data.image) || data.image != null) {
                    validationRule.image = "required|string";
                    validationData.image = data.image;
                }
                if (!isEmpty(data.addonID) || data.addonID != null) {
                    validationRule.addonID = "required|numeric";
                    validationData.addonID = data.addonID;
                }
                if (!isEmpty(data.isDefault) || data.isDefault != null) {
                    validationRule.isDefault = "required|boolean";
                    validationData.isDefault = data.isDefault;
                }

                break;
            case "Profile":
                if (!isEmpty(data.houseNumber) || data.houseNumber != null) {
                    validationRule.houseNumber = "required|string";
                    validationData.houseNumber = data.houseNumber;
                }
                if (!isEmpty(data.image) || data.image != null) {
                    validationRule.image = "required|string";
                    validationData.image = data.image;
                }
                if (!isEmpty(data.companyName) || data.companyName != null) {
                    validationRule.companyName = "required|string";
                    validationData.companyName = data.companyName;
                }
                if (!isEmpty(data.companyGasNumber) || data.companyGasNumber != null) {
                    validationRule.companyGasNumber = "required|numeric";
                    validationData.companyGasNumber = data.companyGasNumber;
                }
                if (!isEmpty(data.companyLicenseNumber) || data.companyLicenseNumber != null) {
                    validationRule.companyLicenseNumber = "required|numeric";
                    validationData.companyLicenseNumber = data.companyLicenseNumber;
                }
                if (!isEmpty(data.companyAddress2) || data.companyAddress2 != null) {
                    validationRule.companyAddress2 = "required|string";
                    validationData.companyAddress2 = data.companyAddress2;
                }
                if (!isEmpty(data.companyCity) || data.companyCity != null) {
                    validationRule.companyCity = "required|string";
                    validationData.companyCity = data.companyCity;
                }
                if (!isEmpty(data.companyPostcode) || data.companyPostcode != null) {
                    validationRule.companyPostcode = "required|string";
                    validationData.companyPostcode = data.companyPostcode;
                }
                if (!isEmpty(data.isLimitedCompany) || data.isLimitedCompany != null) {
                    validationRule.isLimitedCompany = "required|boolean";
                    validationData.isLimitedCompany = data.isLimitedCompany;
                }
                if (!isEmpty(data.isVatRegistered) || data.isVatRegistered != null) {
                    validationRule.isVatRegistered = "required|boolean";
                    validationData.isVatRegistered = data.isVatRegistered;
                }
                if (!isEmpty(data.companyNumber) || data.companyNumber != null) {
                    validationRule.companyNumber = "required|numeric";
                    validationData.companyNumber = data.companyNumber;
                }
                if (!isEmpty(data.vatNumber) || data.vatNumber != null) {
                    validationRule.vatNumber = "required|numeric";
                    validationData.vatNumber = data.vatNumber;
                }


                if (!isEmpty(data.accountName) || data.accountName != null) {
                    validationRule.accountName = "required|string";
                    validationData.accountName = data.accountName;
                }

                if (!isEmpty(data.accountCode) || data.accountCode != null) {
                    validationRule.accountCode = "required|numeric";
                    validationData.accountCode = data.accountCode;
                }

                if (!isEmpty(data.accountNumber) || data.accountNumber != null) {
                    validationRule.accountNumber = "required|numeric";
                    validationData.accountNumber = data.accountNumber;
                }

                break;

            case "Product":

                if (!isEmpty(data.manufacturerID) || data.manufacturerID != null) {
                    validationRule.manufacturerID = "required|numeric";
                    validationData.manufacturerID = data.manufacturerID;
                }
                if (!isEmpty(data.fuelTypeID) || data.fuelTypeID != null) {
                    validationRule.fuelTypeID = "required|numeric";
                    validationData.fuelTypeID = data.fuelTypeID;
                }
                if (!isEmpty(data.boilerTypeID) || data.boilerTypeID != null) {
                    validationRule.boilerTypeID = "required|numeric";
                    validationData.boilerTypeID = data.boilerTypeID;
                }
                if (!isEmpty(data.code) || data.code != null) {
                    validationRule.code = "string";
                    validationData.code = data.code;
                }
                if (!isEmpty(data.wattage) || data.wattage != null) {
                    validationRule.wattage = "required|numeric";
                    validationData.wattage = data.wattage;
                }
                if (!isEmpty(data.warranty) || data.warranty != null) {
                    validationRule.warranty = "required|numeric";
                    validationData.warranty = data.warranty;
                }
                if (!isEmpty(data.image) || data.image != null) {
                    validationRule.image = "string";
                    validationData.image = data.image;
                }
                if (!isEmpty(data.warrantyImage) || data.warrantyImage != null) {
                    validationRule.warrantyImage = "required|string";
                    validationData.warrantyImage = data.warrantyImage;
                }
                if (!isEmpty(data.isRecommend) || data.isRecommend != null) {
                    validationRule.isRecommend = "required|boolean";
                    validationData.isRecommend = data.isRecommend;
                }
                if (!isEmpty(data.subtitle) || data.subtitle != null) {
                    validationRule.subtitle = "string";
                    validationData.subtitle = data.subtitle;
                }
                if (!isEmpty(data.description) || data.description != null) {
                    validationRule.description = "string";
                    validationData.description = data.description;
                }
                if (!isEmpty(data.efficiencyRating) || data.efficiencyRating != null) {
                    validationRule.efficiencyRating = "required|string";
                    validationData.efficiencyRating = data.efficiencyRating;
                }
                if (!isEmpty(data.dimension) || data.dimension != null) {
                    validationRule.dimension = "required|string";
                    validationData.dimension = data.dimension;
                }
                if (!isEmpty(data.flowRate) || data.flowRate != null) {
                    validationRule.flowRate = "required|numeric";
                    validationData.flowRate = data.flowRate;
                }
                if (!isEmpty(data.opt1) || data.opt1 != null) {
                    validationRule.opt1 = "required|string";
                    validationData.opt1 = data.opt1;
                }
                if (!isEmpty(data.opt2) || data.opt2 != null) {
                    validationRule.opt2 = "required|string";
                    validationData.opt2 = data.opt2;
                }

                break;

            case "PriceProduct":
                if (!isEmpty(data.productID) || data.productID != null) {
                    validationRule.productID = "required|numeric";
                    validationData.productID = data.productID;
                }

                if (!isEmpty(data.priceID) || data.priceID != null) {
                    validationRule.priceID = "required|numeric";
                    validationData.priceID = data.priceID;
                }
                if (!isEmpty(data.price) || data.price != null) {
                    validationRule.price = "required|numeric";
                    validationData.price = data.price;
                }

                break;
            case "Price":
                if (!isEmpty(data.parentID) || data.parentID != null) {
                    validationRule.parentID = "required|numeric";
                    validationData.parentID = data.parentID;
                }

                if (!isEmpty(data.isMain) || data.isMain != null) {
                    validationRule.isMain = "required|boolean";
                    validationData.isMain = data.isMain;
                }
                if (!isEmpty(data.isDiscount) || data.isDiscount != null) {
                    validationRule.isDiscount = "required|boolean";
                    validationData.isDiscount = data.isDiscount;
                }
                if (!isEmpty(data.isAdditionalType) || data.isAdditionalType != null) {
                    validationRule.isAdditionalType = "boolean";
                    validationData.isAdditionalType = data.isAdditionalType;
                }
                if (!isEmpty(data.slug) || data.slug != null) {
                    validationRule.slug = "string";
                    validationData.slug = data.slug;
                }

                break;

            case "Addon":
                if (!isEmpty(data.name) || data.name != null) {
                    validationRule.name = "required|string";
                    validationData.name = data.name;
                }

                if (!isEmpty(data.manufacturerID) || data.manufacturerID != null) {
                    validationRule.manufacturerID = "required|numeric";
                    validationData.manufacturerID = data.manufacturerID;
                }

                if (!isEmpty(data.categoryID) || data.categoryID != null) {
                    validationRule.categoryID = "required|numeric";
                    validationData.categoryID = data.categoryID;
                }

                if (!isEmpty(data.wattage) || data.wattage != null) {
                    validationRule.wattage = "required|numeric";
                    validationData.wattage = data.wattage;
                }

                if (!isEmpty(data.warranty) || data.warranty != null) {
                    validationRule.warranty = "required|numeric";
                    validationData.warranty = data.warranty;
                }

                break;

            case "Postcode":
                if (!isEmpty(data.cityID) || data.cityID != null) {
                    validationRule.cityID = "required|numeric";
                    validationData.cityID = data.cityID;
                }

                if (!isEmpty(data.type) || data.type != null) {
                    validationRule.type = "required|numeric";
                    validationData.type = data.type;
                }

                break;
            case "PlanService":
                if (!isEmpty(data.price) || data.price != null) {
                    validationRule.price = "required|numeric";
                    validationData.price = data.price;
                }

                if (!isEmpty(data.discount) || data.discount != null) {
                    validationRule.discount = "required|numeric";
                    validationData.discount = data.discount;
                }

                break;
            case "Plan":
                if (!isEmpty(data.planUID) || data.planUID != null) {
                    validationRule.planUID = "required|string";
                    validationData.planUID = data.planUID;
                }

                if (!isEmpty(data.content) || data.content != null) {
                    validationRule.content = "required|string";
                    validationData.content = data.content;
                }

                if (!isEmpty(data.name) || data.name != null) {
                    validationRule.name = "required|string";
                    validationData.name = data.name;
                }

                break;
            case "NoteOrder":
                if (!isEmpty(data.orderID) || data.orderID != null) {
                    validationRule.orderID = "required|numeric";
                    validationData.orderID = data.orderID;
                }

                if (!isEmpty(data.title) || data.title != null) {
                    validationRule.title = "required|string";
                    validationData.title = data.title;
                }
                if (!isEmpty(data.body) || data.body != null) {
                    validationRule.body = "required|string";
                    validationData.body = data.body;
                }

                break;
            case "OrderQuestion":
            case "ImageOrder":
                if (!isEmpty(data.orderID) || data.orderID != null) {
                    validationRule.orderID = "required|numeric";
                    validationData.orderID = data.orderID;
                }
                if (!isEmpty(data.questionID) || data.questionID != null) {
                    validationRule.questionID = "required|numeric";
                    validationData.questionID = data.questionID;
                }
                if (!isEmpty(data.answerID) || data.answerID != null) {
                    validationRule.answerID = "required|numeric";
                    validationData.answerID = data.answerID;
                }
                if (!isEmpty(data.imageTypeID) || data.imageTypeID != null) {
                    validationRule.imageTypeID = "required|numeric";
                    validationData.imageTypeID = data.imageTypeID;
                }
                if (!isEmpty(data.image) || data.image != null) {
                    validationRule.image = "required|string";
                    validationData.image = data.image;
                }
                if (!isEmpty(data.title) || data.title != null) {
                    validationRule.title = "required|string";
                    validationData.title = data.title;
                }

                break;
            case "Option":
                if (!isEmpty(data.key) || data.key != null) {
                    validationRule.key = "required|string";
                    validationData.key = data.key;
                }
                if (!isEmpty(data.value) || data.value != null) {
                    validationRule.value = "required|string";
                    validationData.value = data.value;
                }

                break;
            case "PlanUser":
                if (!isEmpty(data.userID) || data.userID != null) {
                    validationRule.userID = "required|numeric";
                    validationData.userID = data.userID;
                }
                if (!isEmpty(data.planServiceID) || data.planServiceID != null) {
                    validationRule.planServiceID = "required|numeric";
                    validationData.planServiceID = data.planServiceID;
                }
                if (!isEmpty(data.price) || data.price != null) {
                    validationRule.price = "required|numeric";
                    validationData.price = data.price;
                }
                if (!isEmpty(data.discount) || data.discount != null) {
                    validationRule.discount = "required|numeric";
                    validationData.discount = data.discount;
                }
                if (!isEmpty(data.startedAt) || data.startedAt != null) {
                    validationRule.startedAt = "required|date";
                    validationData.startedAt = data.startedAt;
                }
                if (!isEmpty(data.expireAt) || data.expireAt != null) {
                    validationRule.expireAt = "required|date";
                    validationData.expireAt = data.expireAt;
                }
                if (!isEmpty(data.status) || data.status != null) {
                    validationRule.status = "required|numeric";
                    validationData.status = data.status;
                }

                break;
            case "Order":
                if (!isEmpty(data.uuid) || data.uuid != null) {
                    validationRule.uuid = "required|string";
                    validationData.uuid = data.uuid;
                }
                if (!isEmpty(data.userID) || data.userID != null) {
                    validationRule.userID = "required|numeric";
                    validationData.userID = data.userID;
                }
                if (!isEmpty(data.couponID) || data.couponID != null) {
                    validationRule.couponID = "required|numeric";
                    validationData.couponID = data.couponID;
                }
                if (!isEmpty(data.couponPrice) || data.couponPrice != null) {
                    validationRule.couponPrice = "required|numeric";
                    validationData.couponPrice = data.couponPrice;
                }
                if (!isEmpty(data.productID) || data.productID != null) {
                    validationRule.productID = "required|numeric";
                    validationData.productID = data.productID;
                }
                if (!isEmpty(data.productTotalPrice) || data.productTotalPrice != null) {
                    validationRule.productTotalPrice = "required|numeric";
                    validationData.productTotalPrice = data.productTotalPrice;
                }
                if (!isEmpty(data.total) || data.total != null) {
                    validationRule.total = "required|numeric";
                    validationData.total = data.total;
                }
                if (!isEmpty(data.subPostcode) || data.subPostcode != null) {
                    validationRule.subPostcode = "required|string";
                    validationData.subPostcode = data.subPostcode;
                }
                if (!isEmpty(data.installDate) || data.installDate != null) {
                    validationRule.installDate = "required|date";
                    validationData.installDate = data.installDate;
                }
                if (!isEmpty(data.installPrice) || data.installPrice != null) {
                    validationRule.installPrice = "required|numeric";
                    validationData.installPrice = data.installPrice;
                }
                if (!isEmpty(data.postcodePrice) || data.postcodePrice != null) {
                    validationRule.postcodePrice = "required|numeric";
                    validationData.postcodePrice = data.postcodePrice;
                }
                if (!isEmpty(data.discount) || data.discount != null) {
                    validationRule.discount = "required|numeric";
                    validationData.discount = data.discount;
                }
                if (!isEmpty(data.tax) || data.tax != null) {
                    validationRule.tax = "required|numeric";
                    validationData.tax = data.tax;
                }
                if (!isEmpty(data.status) || data.status != null) {
                    validationRule.status = "required|numeric";
                    validationData.status = data.status;
                }
                if (!isEmpty(data.preQuestionStatus) || data.preQuestionStatus != null) {
                    validationRule.preQuestionStatus = "required|numeric";
                    validationData.preQuestionStatus = data.preQuestionStatus;
                }
                if (!isEmpty(data.postQuestionStatus) || data.postQuestionStatus != null) {
                    validationRule.postQuestionStatus = "required|numeric";
                    validationData.postQuestionStatus = data.postQuestionStatus;
                }
                if (!isEmpty(data.imageEvidenceStatus) || data.imageEvidenceStatus != null) {
                    validationRule.imageEvidenceStatus = "required|numeric";
                    validationData.imageEvidenceStatus = data.imageEvidenceStatus;
                }
                if (!isEmpty(data.preQuestionCancelReason) || data.preQuestionCancelReason != null) {
                    validationRule.preQuestionCancelReason = "required|string";
                    validationData.preQuestionCancelReason = data.preQuestionCancelReason;
                }
                if (!isEmpty(data.postQuestionCancelReason) || data.postQuestionCancelReason != null) {
                    validationRule.postQuestionCancelReason = "required|string";
                    validationData.postQuestionCancelReason = data.postQuestionCancelReason;
                }
                if (!isEmpty(data.imageEvidenceCancelReason) || data.imageEvidenceCancelReason != null) {
                    validationRule.imageEvidenceCancelReason = "required|string";
                    validationData.imageEvidenceCancelReason = data.imageEvidenceCancelReason;
                }
                if (!isEmpty(data.note) || data.note != null) {
                    validationRule.note = "required|string";
                    validationData.note = data.note;
                }
                if (!isEmpty(data.cancelReason) || data.cancelReason != null) {
                    validationRule.cancelReason = "required|string";
                    validationData.cancelReason = data.cancelReason;
                }
                if (!isEmpty(data.type) || data.type != null) {
                    validationRule.type = "required|numeric";
                    validationData.type = data.type;
                }
                if (!isEmpty(data.imageSubmitStatus) || data.imageSubmitStatus != null) {
                    validationRule.imageSubmitStatus = "required|boolean";
                    validationData.imageSubmitStatus = data.imageSubmitStatus;
                }
                if (!isEmpty(data.planID) || data.planID != null) {
                    validationRule.planID = "required|numeric";
                    validationData.planID = data.planID;
                }

                break;
            case "InstallAnswer":
                if (!isEmpty(data.orderID) || data.orderID != null) {
                    validationRule.orderID = "required|numeric";
                    validationData.orderID = data.orderID;
                }

                if (!isEmpty(data.installQuestionID) || data.installQuestionID != null) {
                    validationRule.installQuestionID = "required|numeric";
                    validationData.installQuestionID = data.installQuestionID;
                }

                if (!isEmpty(data.multiChoiceAnswer) || data.multiChoiceAnswer != null) {
                    validationRule.multiChoiceAnswer = "required|numeric";
                    validationData.multiChoiceAnswer = data.multiChoiceAnswer;
                }

                if (!isEmpty(data.shortAnswer) || data.shortAnswer != null) {
                    validationRule.shortAnswer = "required|numeric";
                    validationData.shortAnswer = data.shortAnswer;
                }

                break;
            case "ImageType":
                if (!isEmpty(data.parentID) || data.parentID != null) {
                    validationRule.parentID = "required|numeric";
                    validationData.parentID = data.parentID;
                }
                if (!isEmpty(data.orderNum) || data.orderNum != null) {
                    validationRule.orderNum = "required|numeric";
                    validationData.orderNum = data.orderNum;
                }
                if (!isEmpty(data.maxAllowed) || data.maxAllowed != null) {
                    validationRule.maxAllowed = "required|numeric";
                    validationData.maxAllowed = data.maxAllowed;
                }
                if (!isEmpty(data.isRequired) || data.isRequired != null) {
                    validationRule.isRequired = "required|boolean";
                    validationData.isRequired = data.isRequired;
                }

                break;
            // case "ImageProfile":
            //     if (!isEmpty(data.profileID) || data.profileID != null) {
            //         validationRule.profileID = "required|numeric";
            //         validationData.profileID = data.profileID;
            //     }
            //     if (!isEmpty(data.imageTypeID) || data.imageTypeID != null) {
            //         validationRule.imageTypeID = "required|numeric";
            //         validationData.imageTypeID = data.imageTypeID;
            //     }
            //     if (!isEmpty(data.image) || data.image != null) {
            //         validationRule.image = "required|string";
            //         validationData.image = data.image;
            //     }
            //     if (!isEmpty(data.expire) || data.expire != null) {
            //         validationRule.expire = "required|date";
            //         validationData.expire = data.expire;
            //     }
            //
            //     break;
            case "EmailOrder":
                if (!isEmpty(data.userID) || data.userID != null) {
                    validationRule.userID = "required|numeric";
                    validationData.userID = data.userID;
                }
                if (!isEmpty(data.orderID) || data.orderID != null) {
                    validationRule.orderID = "required|numeric";
                    validationData.orderID = data.orderID;
                }
                if (!isEmpty(data.templateID) || data.templateID != null) {
                    validationRule.templateID = "required|numeric";
                    validationData.templateID = data.templateID;
                }
                if (!isEmpty(data.mailTitle) || data.mailTitle != null) {
                    validationRule.mailTitle = "required|date";
                    validationData.mailTitle = data.mailTitle;
                }
                if (!isEmpty(data.mailContent) || data.mailContent != null) {
                    validationRule.mailContent = "required|date";
                    validationData.mailContent = data.mailContent;
                }

                break;
            case "AvailableWork":
            case "AvailableInstallation":
                if (!isEmpty(data.userID) || data.userID != null) {
                    validationRule.userID = "required|numeric";
                    validationData.userID = data.userID;
                }
                if (!isEmpty(data.price) || data.price != null) {
                    validationRule.price = "numeric";
                    validationData.price = data.price;
                }
                if (!isEmpty(data.startDate) || data.startDate != null) {
                    validationRule.startDate = "required|date";
                    validationData.startDate = data.startDate;
                }
                if (!isEmpty(data.endDate) || data.endDate != null) {
                    validationRule.endDate = "required|date";
                    validationData.endDate = data.endDate;
                }

                break;
            case "AssignEngineer":
                if (!isEmpty(data.orderID) || data.orderID != null) {
                    validationRule.orderID = "required|numeric";
                    validationData.orderID = data.orderID;
                }
                if (!isEmpty(data.userID) || data.userID != null) {
                    validationRule.userID = "required|numeric";
                    validationData.userID = data.userID;
                }
                if (!isEmpty(data.price) || data.price != null) {
                    validationRule.price = "required|numeric";
                    validationData.price = data.price;
                }
                if (!isEmpty(data.isVerticalFlue) || data.isVerticalFlue != null) {
                    validationRule.isVerticalFlue = "required|boolean";
                    validationData.isVerticalFlue = data.isVerticalFlue;
                }
                if (!isEmpty(data.engNote) || data.engNote != null) {
                    validationRule.engNote = "required|string";
                    validationData.engNote = data.engNote;
                }
                if (!isEmpty(data.status) || data.status != null) {
                    validationRule.status = "required|numeric";
                    validationData.status = data.status;
                }

                break;
            case "AddonOrder":
                if (!isEmpty(data.orderID) || data.orderID != null) {
                    validationRule.orderID = "required|numeric";
                    validationData.orderID = data.orderID;
                }
                if (!isEmpty(data.addonID) || data.addonID != null) {
                    validationRule.addonID = "required|numeric";
                    validationData.addonID = data.addonID;
                }
                if (!isEmpty(data.price) || data.price != null) {
                    validationRule.price = "required|numeric";
                    validationData.price = data.price;
                }
                if (!isEmpty(data.amount) || data.amount != null) {
                    validationRule.amount = "required|numeric";
                    validationData.amount = data.amount;
                }
                if (!isEmpty(data.total) || data.total != null) {
                    validationRule.total = "required|numeric";
                    validationData.total = data.total;
                }

                break;
            case "Appliance":
                if (!isEmpty(data.name) || data.name != null) {
                    validationRule.name = "required|string";
                    validationData.name = data.name;
                }
                if (!isEmpty(data.planUserID) || data.planUserID != null) {
                    validationRule.planUserID = "required|numeric";
                    validationData.planUserID = data.planUserID;
                }
                if (!isEmpty(data.applianceService) || data.applianceService != null) {
                    validationRule.applianceService = "required|numeric";
                    validationData.applianceService = data.applianceService;
                }
                if (!isEmpty(data.location) || data.location != null) {
                    validationRule.location = "required|string";
                    validationData.location = data.location;
                }
                if (!isEmpty(data.type) || data.type != null) {
                    validationRule.type = "required|string";
                    validationData.type = data.type;
                }
                if (!isEmpty(data.model) || data.model != null) {
                    validationRule.model = "required|string";
                    validationData.model = data.model;
                }
                if (!isEmpty(data.additional) || data.additional != null) {
                    validationRule.additional = "required|string";
                    validationData.additional = data.additional;
                }
                if (!isEmpty(data.warrantyStartedAt) || data.warrantyStartedAt != null) {
                    validationRule.warrantyStartedAt = "required|date";
                    validationData.warrantyStartedAt = data.warrantyStartedAt;
                }
                if (!isEmpty(data.warrantyEndedAt) || data.warrantyEndedAt != null) {
                    validationRule.warrantyEndedAt = "required|date";
                    validationData.warrantyEndedAt = data.warrantyEndedAt;
                }

                break;

            case "Customer":
            case "AddressOrder":
                if (type === "Customer") {
                    if (!isEmpty(data.title) || data.title != null) {
                        validationRule.title = "required|numeric";
                        validationData.title = data.title;
                    }
                    if (!isEmpty(data.userID) || data.userID != null) {
                        validationRule.userID = "required|numeric";
                        validationData.userID = data.userID;
                    }

                    if (!isEmpty(data.mobile) || data.mobile != null) {
                        validationRule.mobile = "required|string";
                        validationData.mobile = data.mobile;
                    }

                    if (!isEmpty(data.phone) || data.phone != null) {
                        validationRule.phone = "required|string";
                        validationData.phone = data.phone;
                    }

                } else {
                    if (!isEmpty(data.orderID) || data.orderID != null) {
                        validationRule.orderID = "required|numeric";
                        validationData.orderID = data.orderID;
                    }
                }


                if (!isEmpty(data.addressLine1) || data.addressLine1 != null) {
                    validationRule.addressLine1 = "required|string";
                    validationData.addressLine1 = data.addressLine1;
                }
                if (!isEmpty(data.addressLine2) || data.addressLine2 != null) {
                    validationRule.addressLine2 = "required|string";
                    validationData.addressLine2 = data.addressLine2;
                }
                if (!isEmpty(data.city) || data.city != null) {
                    validationRule.city = "required|string";
                    validationData.city = data.city;
                }
                if (!isEmpty(data.postcode) || data.postcode != null) {
                    validationRule.postcode = "required|string";
                    validationData.postcode = data.postcode;
                }
                if (!isEmpty(data.installLine1) || data.installLine1 != null) {
                    validationRule.installLine1 = "required|string";
                    validationData.installLine1 = data.installLine1;
                }
                if (!isEmpty(data.installLine2) || data.installLine2 != null) {
                    validationRule.installLine2 = "required|string";
                    validationData.installLine2 = data.installLine2;
                }
                if (!isEmpty(data.installCity) || data.installCity != null) {
                    validationRule.installCity = "required|string";
                    validationData.installCity = data.installCity;
                }
                if (!isEmpty(data.installPostcode) || data.installPostcode != null) {
                    validationRule.installPostcode = "required|string";
                    validationData.installPostcode = data.installPostcode;
                }
                if (!isEmpty(data.isSameInstall) || data.isSameInstall != null) {
                    validationRule.isSameInstall = "required|boolean";
                    validationData.isSameInstall = data.isSameInstall;
                }

                break;
            case "Coupon":
                if (!isEmpty(data.code) || data.code != null) {
                    validationRule.code = "required|string";
                    validationData.code = data.code;
                }
                if (!isEmpty(data.value) || data.value != null) {
                    validationRule.value = "required|numeric";
                    validationData.value = data.value;
                }
                if (!isEmpty(data.expire) || data.expire != null) {
                    validationRule.expire = "required|date";
                    validationData.expire = data.expire;
                }
                if (!isEmpty(data.productID) || data.productID != null) {
                    validationRule.productID = "required|numeric";
                    validationData.productID = data.productID;
                }
                if (!isEmpty(data.isPercent) || data.isPercent != null) {
                    validationRule.isPercent = "required|boolean";
                    validationData.isPercent = data.isPercent;
                }

                break;
            case "Contact":
                if (!isEmpty(data.email) || data.email != null) {
                    validationRule.email = "required|string|email|min:1";
                    validationData.email = data.email;
                }
                if (!isEmpty(data.address) || data.address != null) {
                    validationRule.address = "string|min:1|max:150";
                    validationData.address = data.address;
                }
                if (!isEmpty(data.postcode) || data.postcode != null) {
                    validationRule.postcode = "string|min:1|max:150";
                    validationData.postcode = data.postcode;
                }
                if (!isEmpty(data.phone) || data.phone != null) {
                    validationRule.phone = "required|string|min:11|max:11";
                    validationData.phone = data.phone;
                }
                if (!isEmpty(data.address) || data.address != null) {
                    validationRule.address = "string";
                    validationData.address = data.address;
                }
                if (!isEmpty(data.postcode) || data.postcode != null) {
                    validationRule.postcode = "string";
                    validationData.postcode = data.postcode;
                }
                if (!isEmpty(data.body) || data.body != null) {
                    validationRule.body = "string";
                    validationData.body = data.body;
                }
                if (!isEmpty(data.subjectID) || data.subjectID != null) {
                    validationRule.subjectID = "numeric";
                    validationData.subjectID = data.subjectID;
                }
                if (!isEmpty(data.enquiryID) || data.enquiryID != null) {
                    validationRule.enquiryID = "numeric";
                    validationData.enquiryID = data.enquiryID;
                }
                if (!isEmpty(data.image) || data.image != null) {
                    validationRule.image = "string";
                    validationData.image = data.image;
                }
                if (!isEmpty(data.note) || data.note != null) {
                    validationRule.note = "string";
                    validationData.note = data.note;
                }
                break;

            case "Role":
            case "Permission":
                if (!isEmpty(data.slug) || data.slug != null) {
                    validationRule.slug = "required|string";
                    validationData.slug = data.slug;
                }
                if (!isEmpty(data.displayName) || data.displayName != null) {
                    validationRule.displayName = "string";
                    validationData.displayName = data.displayName;
                }
                break;

        }
    }

    validation = new validator(validationData, validationRule);


    if (validation.fails()) errors = validation.errors;

    return errors;
}

module.exports = validateForm;
