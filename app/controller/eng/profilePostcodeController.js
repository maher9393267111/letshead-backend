const {checkValidation, deleteFromBody} = require("../../services/globalFunction");
const {PostcodeProfile, Postcode, Profile} = require("../../../models");


// Create and Save a new FuelType
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "profilePostcode");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = req.body;
    let profile = await Profile.findOne({where: {userID: req.userID}, attributes: ["id"]});
    if (profile != null && "postcodeIDs" in body && body.postcodeIDs !== "null" && body.postcodeIDs !== "") {

        let bulkData = body.postcodeIDs.split(",").map((postcodeID) => {
            return {profileID: profile.id, postcodeID: Number(postcodeID)};
        });

        await PostcodeProfile.bulkCreate(bulkData);

        return res.status(200).json();
    } else return res.status(400).json();

};

// Update a FuelType by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "profilePostcode");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    let profile = await Profile.findOne({where: {userID: req.userID}, attributes: ["id"]});
    if (profile != null && "postcodeIDs" in body && body.postcodeIDs !== "null" && body.postcodeIDs !== "") {

        PostcodeProfile.destroy({where: {profileID: profile.id}});
        let bulkData = body.postcodeIDs.split(",").map((postcodeID) => {
            return {profileID: profile.id, postcodeID: Number(postcodeID)};
        });

        await PostcodeProfile.bulkCreate(bulkData);

        return res.status(200).json();
    } else return res.status(400).json();

};


