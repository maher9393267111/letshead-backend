let _ = require('lodash');
// const multer = (...args) => import('multer').then(({default: fetch}) => fetch(...args));
const multer = require('multer');
let crypto = require('crypto');


let AvatarStorage = require('../../helpers/AvatarStorage');
let path = require('path');

const imageFilter = (req, file, callback) => {
    // supported image file mimetypes
    let allowedMimes = ['image/jpeg', 'image/png', 'image/svg+xml'];

    if (_.includes(allowedMimes, file.mimetype)) {
        return callback(null, true);
    } else {
        req.fileValidationError = 'Image format is not supported';
        return callback(null, false, new Error('Image format is not supported'));
    }
};

let limitsImage = {
    files: 1, // allow only 1 file per request
    fileSize: (1024 * 1024) * 2, // 1 MB (max file size)
};
const oneImage = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, path.resolve(__dirname, '../..', process.env.AVATAR_STORAGE));
        }, filename: (req, file, callback) => {
            let bytes = crypto.pseudoRandomBytes(32);
            // create the md5 hash of the random bytes
            let checksum = crypto.createHash('MD5').update(bytes).digest('hex');
            callback(null, (_.includes([".svg", "image/svg+xml"], file.mimetype)) ? checksum + ".svg" : checksum + ".png");
        },
    }), // AvatarStorage({quality: 80, defaultName: false, responsive: false, sharpResizing: false, threshold: 350,}),
    limits: limitsImage, fileFilter: imageFilter,
}).single(process.env.INPUT_UPLOAD_IMAGE);

let limitsImages = {
    files: 40, // allow only 1 file per request
    fileSize: (1024 * 1024) * 20, // 1 MB (max file size)
};

// setup multer
const multiImages = multer({
    storage: AvatarStorage({quality: 100, defaultName: false, responsive: false, sharpResizing: false, threshold: 1000,}),
    limits: limitsImages, fileFilter: imageFilter,
}).fields([{name: process.env.INPUT_UPLOAD_IMAGE, maxCount: limitsImage.files}, {name: process.env.INPUT_UPLOAD_IMAGES, maxCount: limitsImages.files}])
const uploadImages = (req, res, next) => {

    multiImages(req, res, err => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({errors: {error: err.message}});
        } else if (err || req.fileValidationError) {
            return res.status(400).json({errors: {error: req.fileValidationError}});
        }
        next();

    });
};
const uploadImage = (req, res, next) => {
    oneImage(req, res, err => {

        if (err instanceof multer.MulterError) {
            return res.status(400).json({errors: {error: err.message}});
        } else if (err || req.fileValidationError) {
            return res.status(400).json({errors: {error: req.fileValidationError}});
        } else if (req.file === undefined) {
            req.file = null;
        }

        next();
    });
};

//////////////////////////////// CSV File Code ////////////////////////

const csvFilter = (req, file, callback) => {

    let allowedMimes = [".csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];

    if (_.includes(allowedMimes, file.mimetype)) {
        return callback(null, true);
    } else {
        req.fileValidationError = 'Image format is not supported';
        return callback(null, false, new Error('Image format is not supported'));
    }
};

const oneFile = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, path.resolve(__dirname, '../..', process.env.FILE_STORAGE));
        }, filename: (req, file, callback) => {
            callback(null, `${Date.now()}` + ".csv");
        },
    }), limits: limitsImage, fileFilter: csvFilter,
}).single(process.env.INPUT_UPLOAD_FILE);

const uploadFile = (req, res, next) => {

    oneFile(req, res, err => {

        if (err instanceof multer.MulterError) {
            return res.status(400).json({errors: {error: err.message}});
        } else if (err || req.fileValidationError) {
            return res.status(400).json({errors: {error: req.fileValidationError}});
        }

        next();

    });

};

//////////////////////////////// mix PDF and Image ////////////////////////

const mixFilter = (req, file, callback) => {

    let allowedMimes = [".pdf", "application/pdf", 'image/jpeg', 'image/png'];

    if (_.includes(allowedMimes, file.mimetype)) {
        return callback(null, true);
    } else {
        req.fileValidationError = 'File format is not correct';
        return callback(null, false, new Error('File format is not correct'));
    }
};

const mixFile = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            if (_.includes([".pdf", "application/pdf"], file.mimetype)) {
                callback(null, path.resolve(__dirname, '../..', process.env.FILE_STORAGE));
            } else {
                callback(null, path.resolve(__dirname, '../..', process.env.AVATAR_STORAGE));
            }

        }, filename: (req, file, callback) => {
            let bytes = crypto.pseudoRandomBytes(32);
            // create the md5 hash of the random bytes
            let checksum = crypto.createHash('MD5').update(bytes).digest('hex');

            callback(null, (_.includes([".pdf", "application/pdf"], file.mimetype)) ? checksum + ".pdf" : checksum + ".png");

        },
    }), limits: limitsImage, fileFilter: mixFilter,
}).single(process.env.INPUT_UPLOAD_FILE);

const uploadMixFile = (req, res, next) => {

    mixFile(req, res, err => {

        if (err instanceof multer.MulterError) {
            return res.status(400).json({errors: {error: err.message}});
        } else if (err || req.fileValidationError) {
            return res.status(400).json({errors: {error: req.fileValidationError}});
        }

        next();

    });

};


const mixFiles = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            if (_.includes([".pdf", "application/pdf"], file.mimetype)) {
                callback(null, path.resolve(__dirname, '../..', process.env.FILE_STORAGE));
            } else {
                callback(null, path.resolve(__dirname, '../..', process.env.AVATAR_STORAGE));
            }

        }, filename: (req, file, callback) => {
            let bytes = crypto.pseudoRandomBytes(32);
            // create the md5 hash of the random bytes
            let checksum = crypto.createHash('MD5').update(bytes).digest('hex');

            callback(null, (_.includes([".pdf", "application/pdf"], file.mimetype)) ? checksum + ".pdf" : checksum + ".png");

        },
    }), limits: limitsImages, fileFilter: mixFilter,
}).fields([{name: process.env.INPUT_UPLOAD_IMAGE, maxCount: limitsImage.files}, {name: process.env.INPUT_UPLOAD_IMAGES, maxCount: limitsImages.files}])

const uploadMixFiles = (req, res, next) => {

    mixFiles(req, res, err => {

        if (err instanceof multer.MulterError) {
            return res.status(400).json({errors: {error: err.message}});
        } else if (err || req.fileValidationError) {
            return res.status(400).json({errors: {error: req.fileValidationError}});
        }

        next();

    });

};


module.exports = {
    uploadImage: uploadImage, uploadImages: uploadImages, uploadFile: uploadFile, uploadMixFile: uploadMixFile, uploadMixFiles: uploadMixFiles,
};
