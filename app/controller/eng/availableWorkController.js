const {checkValidation, deleteFromBody} = require("../../services/globalFunction");
const {AvailableWork} = require("../../../models");
const moment = require("moment");
const {Op} = require("sequelize");
const {isHaveRole} = require("../../middlewares/roleAccessControl");

exports.findAll = async (req, res, next) => {
    const id = (req.params.id && req.params.id !== 0 && isHaveRole(req.roles, 'admin')) ? req.params.id : req.userID;

    AvailableWork.findAll({
        where: {userID: id},
        order: [['createdAt', 'DESC']]
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);
};


// Create and Save a new AvailableWork
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "AvailableWork");
    if (!isValid) {
        return res.status(400).json(errors);
    }
    let body = req.body;
    const id = (body.userID && isHaveRole(req.roles, 'admin')) ? body.userID : req.userID;

    let startDay = body.startDate;
    if (startDay < new Date().toISOString().slice(0, 10)) {
        res.status(400).send({errors: {error: 'the date is passed , select another date'}});
    } else {

        if (body.isAllDays) {
            let currentDay = Number(startDay.slice(8, 10));
            const daysMonth = Number(new Date(startDay.slice(0, 4), startDay.slice(5, 7), 0).getDate());
            let bulkData = [], day, endMonthDate;
            endMonthDate = new Date(startDay.slice(0, 4) + "/" + startDay.slice(5, 7) + "/" + daysMonth);
            await AvailableWork.destroy({where: {userID: id, startDate: {[Op.and]: [{[Op.gte]: startDay}, {[Op.lte]: endMonthDate}]}}});


            while (currentDay <= daysMonth) {
                day = new Date(startDay.slice(0, 4) + "/" + startDay.slice(5, 7) + "/" + currentDay);
                bulkData.push({
                    userID: id, startDate: day, endDate: day, isActive: body.isActive,
                });
                currentDay++;
            }
            if (bulkData.length > 0) {
                await AvailableWork.bulkCreate(bulkData);
                res.status(200).send();
            } else {
                res.status(204).send();
            }

        } else if (body.isRangeDate) {
            let bulkData = [], day, differentDays, currentDay = 0;

            let firstDate = new Date(startDay),
                secondDate = new Date(body.endDate),
                timeDifference = Math.abs(secondDate.getTime() - firstDate.getTime());

            differentDays = Math.ceil(timeDifference / (1000 * 3600 * 24));


            await AvailableWork.destroy({where: {userID: id, startDate: {[Op.and]: [{[Op.gte]: startDay}, {[Op.lte]: body.endDate}]}}});

            while (currentDay <= differentDays) {

                firstDate = new Date(startDay);

                day = new Date(firstDate.setDate(firstDate.getDate() + currentDay));

                bulkData.push({userID: id, startDate: day, endDate: day, isActive: body.isActive});
                currentDay++;
            }
            if (bulkData.length > 0) {
                await AvailableWork.bulkCreate(bulkData);
                res.status(200).send();
            } else {
                res.status(204).send();
            }
        } else {
            await AvailableWork.destroy({where: {userID: id, startDate: body.startDate}});

            await AvailableWork.create({
                userID: id, startDate: body.startDate, endDate: body.endDate, isActive: body.isActive,
            })
                .then(async data => {
                    res.send(data);

                })
                .catch(next);
        }


    }


};

