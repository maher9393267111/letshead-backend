const {checkValidation, deleteFromBody, deleteImages} = require("../../services/globalFunction");
const {Customer, User, RoleUser, Role} = require("../../../models");
const bcrypt = require("bcrypt");
const BCRYPT_SALT_ROUNDS = 12;

exports.findAll = async (req, res, next) => {
    const isShowDeleted = req.params.isShowDeleted !== "true";

    Customer.findAll({
        order: [['createdAt', 'DESC']], paranoid: isShowDeleted, include: {model: User},
    })
        .then(data => {
            res.send(data);
        })
        .catch(next);


};


// Create and Save a new Customer
exports.create = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Customer");
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const body = req.body;
    let user;

    if (!body.userID && body.userID == null) {
        await bcrypt.hash(new Date().getMilliseconds().toString(), BCRYPT_SALT_ROUNDS).then(async hashedPassword => {
            user = await User.create({
                name: body.name, email: body.email, username: body.name, password: hashedPassword
            }).then(async user => {
                const role = await Role.findByPk(process.env.CUSTOMER_ROLE_ID);
                if (role) {
                    await RoleUser.create({roleID: role.id, userID: user.id});
                }
                await createCustomer(res, next, body, user);
            }).catch(next);
        });
    } else {
        createCustomer(res,next,body);
    }


};

// Update a Customer by the id in the request
exports.update = async (req, res, next) => {

    const {errors, isValid} = checkValidation(req, "Customer");
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let body = deleteFromBody(req.body);
    const id = req.params.id;

    await Customer.update(body, {where: {id}})
        .then(num => {
            if (Number(num) === 1) {
                Customer.findByPk(id)
                    .then(async data => {
                        await User.update({name: body.name}, {where: {id}});
                        res.status(200).send(data);
                    })
                    .catch(next);

            } else {
                res.status(406).send({
                    message: `Cannot update Customer with id=${id}. Maybe Customer was not found or req.body is empty!`
                });
            }
        })
        .catch(next);

};

// Delete an Customer with the specified id in the request
exports.delete = async (req, res, next) => {
    const ids = req.params.ids;
    const isForce = req.params.isForce === "true";
    const isRestore = req.params.isRestore === "true";
    let arrIDs = [];

    ids.split(",").map((id) => {
        arrIDs.push(Number(id));
    });

    if (isRestore) {
        await Customer.restore({where: {id: arrIDs}})
            .then((num) => {
                if (Number(num) >= 1) {
                    res.status(200).send();
                } else {
                    res.status(406).send({
                        message: `Cannot update Customer with ids. Maybe Customer was not found or req.body is empty!`,
                    });
                }
            })
            .catch(next);
    } else {
        if (isForce) {
            const data = await Customer.findAll({
                where: {id: arrIDs}, attributes: ["id", "image"], raw: true, paranoid: false,
            });
            await Customer.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        let images = [], arrIDs = [];
                        data.map((row) => {
                            images.push("./" + process.env.AVATAR_STORAGE + "/" + row.image);
                            arrIDs.push(row.id);
                        });
                        deleteImages(images);
                        res.send({
                            message: "Customer was deleted successfully!",
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Customer with range ids. Maybe Customer was not found!`,
                        });
                    }
                })
                .catch(next);
        } else {
            await Customer.destroy({where: {id: arrIDs}, force: isForce})
                .then((num) => {
                    if (Number(num) >= 1) {
                        res.status(200).send();
                    } else {
                        res.status(400).send({
                            message: `Cannot delete Customer with range ids. Maybe Customer was not found!`,
                        });
                    }
                })
                .catch(next);
        }
    }
};



async function createCustomer(res,next,body, user) {
    await Customer.create({
        title: body.title,
        userID: (Number(body.userID) > 0) ? body.userID : user["id"],
        phone: body.phone,
        mobile: body.mobile,
        addressLine1: body.addressLine1,
        addressLine2: body.addressLine2,
        city: body.city,
        postcode: body.postcode,
        installLine1: body.installLine1,
        installLine2: body.installLine1,
        installCity: body.installCity,
        installPostcode: body.installPostcode,
        isActive: body.isActive,
        isSameInstall: body.isSameInstall,
    }).then(async data => {
        res.send(data);

    })
        .catch(next);

}

