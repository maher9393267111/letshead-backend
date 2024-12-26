const {checkValidation, deleteFromBody} = require("../services/globalFunction");
const {AvailableInstallation} = require("../../models");
const moment = require("moment");
const {Op} = require("sequelize");

exports.findAll = async (req, res, next) => {

    AvailableInstallation.findAll({
        order: [['createdAt', 'DESC']]
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);

};

exports.show = async (req, res, next) => {

    const dayIndex = new Date().getDay();
    const hours = new Date().getHours();
    let currentDate;
    if (dayIndex === 0 || dayIndex === 6 || (dayIndex === 5 && hours >= 15)) {
        currentDate = new Date().setDate(new Date().getDate() + ((dayIndex === 5) ? 4 : ((dayIndex === 6) ? 3 : 2)));
    } else {
        currentDate = new Date().setDate(new Date().getDate() + (hours >= 15 ? 2 : 1));
    }

    const isAllDates = req.params.isFirstDate !== "true";
    const query = isAllDates ? AvailableInstallation.findAll({where: {startDate: {[Op.gte]: currentDate}}}) : AvailableInstallation.findOne({
        where: {
            startDate: {[Op.gte]: currentDate}, isActive: true
        }, attributes: ["startDate"]
    });
    await query.then(data => {
        res.send(data);
    })
        .catch(next);
};


// Create and Save a new AvailableInstallation
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "AvailableInstallation");
    if (!isValid) {
        return res.status(400).json(errors);
    }
    let body = req.body;
    let startDay = body.startDate;
    if (startDay < new Date().toISOString().slice(0, 10)) res.status(400).send({errors: {error: 'the date is passed , select another date'}});

    else {

        if (body.isAllDays) {
            let currentDay = Number(startDay.slice(8, 10));
            const daysMonth = Number(new Date(startDay.slice(0, 4), startDay.slice(5, 7), 0).getDate());
            let bulkData = [], day, endMonthDate;
            endMonthDate = new Date(startDay.slice(0, 4) + "/" + startDay.slice(5, 7) + "/" + daysMonth);
            await AvailableInstallation.destroy({where: {startDate: {[Op.and]: [{[Op.gte]: startDay}, {[Op.lte]: endMonthDate}]}}});


            while (currentDay <= daysMonth) {
                day = new Date(startDay.slice(0, 4) + "/" + startDay.slice(5, 7) + "/" + currentDay);
                bulkData.push({
                    price: body.price, startDate: day, endDate: day, isActive: body.isActive,
                });
                currentDay++;
            }
            if (bulkData.length > 0) {
                await AvailableInstallation.bulkCreate(bulkData);
                res.status(200).send();
            } else {
                res.status(204).send();
            }

        } else {
            await AvailableInstallation.create({
                price: body.price, startDate: body.startDate, endDate: body.endDate, isActive: body.isActive,
            })
                .then(async data => {
                    res.send();

                })
                .catch(next);
        }


    }


};

// Update a AvailableInstallation by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "AvailableInstallation");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    if (body.isAllDays) {
        let startDay = body.startDate;
        let currentDay = Number(startDay.slice(8, 10));
        const daysMonth = Number(new Date(startDay.slice(0, 4), startDay.slice(5, 7), 0).getDate());
        let bulkData = [], day, endMonthDate;
        endMonthDate = new Date(startDay.slice(0, 4) + "/" + startDay.slice(5, 7) + "/" + daysMonth);
        await AvailableInstallation.destroy({where: {startDate: {[Op.and]: [{[Op.gte]: startDay}, {[Op.lte]: endMonthDate}]}}});


        while (currentDay <= daysMonth) {
            day = new Date(startDay.slice(0, 4) + "/" + startDay.slice(5, 7) + "/" + currentDay);
            bulkData.push({
                price: body.price, startDate: day, endDate: day, isActive: body.isActive,
            });
            currentDay++;
        }
        if (bulkData.length > 0) {
            await AvailableInstallation.bulkCreate(bulkData);
            res.status(200).send();
        } else {
            res.status(204).send();
        }

    } else {
        await AvailableInstallation.update(body, {where: {id}})
            .then(num => {
                if (Number(num) === 1) {
                    AvailableInstallation.findByPk(id)
                        .then(async data => {
                            res.status(200).send(data);
                        })
                        .catch(next);

                } else {
                    res.status(406).send({
                        message: `Cannot update AvailableInstallation with id=${id}. Maybe AvailableInstallation was not found or req.body is empty!`
                    });
                }
            })
            .catch(next);
    }

};

// Delete a AvailableInstallation with the specified id in the request
exports.delete = async (req, res, next) => {

    const id = req.params.id;

    await AvailableInstallation.destroy({
        where: {id}
    })
        .then(num => {
            if (Number(num) === 1) {

                res.send({
                    message: "AvailableInstallation was deleted successfully!"
                });

            } else {
                res.status(400).send({
                    message: `Cannot delete AvailableInstallation with id=${id}. Maybe AvailableInstallation was not found!`
                });
            }
        })
        .catch(next);


};
