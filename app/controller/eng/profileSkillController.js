const {checkValidation, deleteFromBody} = require("../../services/globalFunction");
const {ProfileSkill, Skill, Profile} = require("../../../models");


// Create and Save a new FuelType
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "profileSkill");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = req.body;
    let profile = await Profile.findOne({where: {userID: req.userID}, attributes: ["id"]});
    if (profile != null && "skillIDs" in body && body.skillIDs !== "null" && body.skillIDs !== "") {

        let bulkData = body.skillIDs.split(",").map((skillID) => {
            return {profileID: profile.id, skillID: Number(skillID)};
        });

        await ProfileSkill.bulkCreate(bulkData);

        return res.status(200).json();
    } else return res.status(400).json();

};

// Update a FuelType by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "profileSkill");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    let profile = await Profile.findOne({where: {userID: req.userID}, attributes: ["id"]});
    if (profile != null && "skillIDs" in body && body.skillIDs !== "null" && body.skillIDs !== "") {

        ProfileSkill.destroy({where: {profileID: profile.id}});
        let bulkData = body.skillIDs.split(",").map((skillID) => {
            return {profileID: profile.id, skillID: Number(skillID)};
        });

        await ProfileSkill.bulkCreate(bulkData);

        return res.status(200).json();
    } else return res.status(400).json();

};


