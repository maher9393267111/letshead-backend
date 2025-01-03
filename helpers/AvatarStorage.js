// Load dependencies
let _ = require('lodash');
let fs = require('fs');
let path = require('path');
let Jimp = require('jimp');
let crypto = require('crypto');
let mkdirp = require('mkdirp');
let concat = require('concat-stream');
let streamifier = require('streamifier');
const sharp = require("sharp");


// Configure UPLOAD_PATH
// process.env.AVATAR_STORAGE contains uploads/avatars

let UPLOAD_PATH = path.resolve(__dirname, '..', process.env.AVATAR_STORAGE);

// create a multer storage engine
let AvatarStorage = function (options) {

    // this serves as a constructor
    function AvatarStorage(opts) {

        let baseUrl = process.env.AVATAR_BASE_URL;

        let allowedStorageSystems = ['local'];
        let allowedOutputFormats = ['jpg', 'png'];

        // fallback for the options
        let defaultOptions = {
            storage: 'local',
            output: 'png',
            greyscale: false,
            quality: 100,
            square: false,
            threshold: 500,
            responsive: false,
            defaultName: false,
            sharpResizing: false,


        };

        // extend default options with passed options
        let options = (opts && _.isObject(opts)) ? _.pick(opts, _.keys(defaultOptions)) : {};
        options = _.extend(defaultOptions, options);

        // check the options for correct values and use fallback value where necessary
        this.options = _.forIn(options, function (value, key, object) {

            switch (key) {

                case 'square':
                case 'greyscale':
                case 'responsive':
                case 'defaultName':
                case 'sharpResizing':
                    object[key] = _.isBoolean(value) ? value : defaultOptions[key];
                    break;

                case 'storage':
                    value = String(value).toLowerCase();
                    object[key] = _.includes(allowedStorageSystems, value) ? value : defaultOptions[key];
                    break;

                case 'output':
                    value = String(value).toLowerCase();
                    object[key] = _.includes(allowedOutputFormats, value) ? value : defaultOptions[key];
                    break;

                case 'quality':
                    // value = _.isFinite(value) ? value : Number(value);
                    // object[key] = (value && value >= 0 && value <= 100) ? value : defaultOptions[key];
                    object[key] =   defaultOptions[key];
                    break;

                case 'threshold':
                    value = _.isFinite(value) ? value : Number(value);
                    object[key] = (value && value >= 0) ? value : defaultOptions[key];
                    break;

            }

        });

        // set the upload path
        this.uploadPath = this.options.responsive ? path.join(UPLOAD_PATH, 'responsive') : UPLOAD_PATH;

        // set the upload base url
        this.uploadBaseUrl = this.options.responsive ? path.join(baseUrl, 'responsive') : baseUrl;

        if (this.options.storage == 'local') {
            // if upload path does not exist, create the upload path structure
            !fs.existsSync(this.uploadPath) && mkdirp.sync(this.uploadPath);
        }

    }

    // this generates a random cryptographic filename
    AvatarStorage.prototype._generateRandomFilename = function () {
        // create pseudo random bytes
        let bytes = crypto.pseudoRandomBytes(32);

        // create the md5 hash of the random bytes
        let checksum = crypto.createHash('MD5').update(bytes).digest('hex');

        // return as filename the hash with the output extension
        return checksum + '.' + this.options.output;
    };

    // this creates a Writable stream for a filepath
    AvatarStorage.prototype._createOutputStream = function (filepath, cb) {

        // create a reference for this to use in local functions
        let that = this;

        // create a writable stream from the filepath
        let output = fs.createWriteStream(filepath);

        // set callback fn as handler for the error event
        output.on('error', cb);

        // set handler for the finish event
        output.on('finish', function () {
            cb(null, {
                destination: that.uploadPath,
                baseUrl: that.uploadBaseUrl,
                filename: path.basename(filepath),
                storage: that.options.storage
            });
        });

        // return the output stream
        return output;
    };

    // this processes the Jimp and Sharp image buffer
    AvatarStorage.prototype._processImageJimp = function (image, cb, imageName) {

        // create a reference for this to use in local functions
        let that = this;

        let batch = [];

        // the responsive sizes
        let sizes = ['lg', 'md', 'sm'];

        let filename;
        if (this.options.defaultName)
            filename = imageName;
        else
            filename = this._generateRandomFilename();

        let mime = Jimp.MIME_PNG;

        // create a clone of the Jimp image
        let clone = image.clone();

        // fetch the Jimp image dimensions
        let width = clone.bitmap.width;
        let height = clone.bitmap.height;
        let square = Math.min(width, height);
        let threshold = this.options.threshold;

        // resolve the Jimp output mime type
        switch (this.options.output) {
            case 'jpg':
                mime = Jimp.MIME_JPEG;
                break;
            case 'png':
            default:
                mime = Jimp.MIME_PNG;
                break;
        }

        // auto scale the image dimensions to fit the threshold requirement
        if (threshold && square > threshold) {
            clone = (square == width) ? clone.resize(threshold, Jimp.AUTO) : clone.resize(Jimp.AUTO, threshold);
        }

        // crop the image to a square if enabled
        if (this.options.square) {

            if (threshold) {
                square = Math.min(square, threshold);
            }

            // fetch the new image dimensions and crop
            clone = clone.crop((clone.bitmap.width - square) / 2, (clone.bitmap.height - square) / 2, square, square);
        }

        // convert the image to greyscale if enabled
        if (this.options.greyscale) {
            clone = clone.greyscale();
        }

        // set the image output quality
        clone = clone.quality(100);  // this.options.quality

        if (this.options.responsive) {

            // map through  the responsive sizes and push them to the batch
            batch = _.map(sizes, function (size) {

                let outputStream;

                let image = null;
                let filepath = filename.split('.');

                // create the complete filepath and create a writable stream for it
                filepath = filepath[0] + '_' + size + '.' + filepath[1];
                filepath = path.join(that.uploadPath, filepath);
                outputStream = that._createOutputStream(filepath, cb);

                // scale the image based on the size
                switch (size) {
                    case 'sm':
                        image = clone.clone().scale(0.3);
                        break;
                    case 'md':
                        image = clone.clone().scale(0.7);
                        break;
                    case 'lg':
                        image = clone.clone();
                        break;
                }

                // return an object of the stream and the Jimp image
                return {
                    stream: outputStream,
                    image: image
                };
            });

        } else {

            // push an object of the writable stream and Jimp image to the batch
            batch.push({
                stream: that._createOutputStream(path.join(that.uploadPath, filename), cb),
                image: clone
            });

        }

        // process the batch sequence
        _.each(batch, function (current) {
            // get the buffer of the Jimp image using the output mime type
            current.image.getBuffer(mime, function (err, buffer) {
                if (that.options.storage == 'local') {
                    // create a read stream from the buffer and pipe it to the output stream
                    streamifier.createReadStream(buffer).pipe(current.stream);
                }
            });
        });

    };

    AvatarStorage.prototype._processImageSharp = async function (image, cb, imageName) {

        // create a reference for this to use in local functions
        let that = this;

        let batch = [];

        // the responsive sizes
        let sizes = ['lg', 'md', 'sm'];

        let filename;
        if (this.options.defaultName)
            filename = imageName;
        else
            filename = this._generateRandomFilename();

        // create a clone of the Sharp image
        let clone = sharp(image).clone();

        // fetch the Sharp image dimensions
        let {width, height} = await sharp(image).metadata();

        let square = Math.min(width, height);
        let threshold = this.options.threshold;

        // set the image output quality
        switch (this.options.output) {
            case 'jpg':
                clone = clone.toFormat("jpeg")
                clone = clone.jpeg({quality: 100}) // this.options.quality

                break;
            case 'png':
            default:
                clone = clone.toFormat("png")
                clone = clone.png({quality: 100}) // this.options.quality
                break;
        }

        // auto scale the image dimensions to fit the threshold requirement
        if (threshold && square > threshold) {
            clone = (square == width) ? clone.resize(({width: threshold})) : clone.resize(({height: threshold}));
        }

        // crop the image to a square if enabled    // not working yet
        /* if (this.options.square) {

             if (threshold) {
                 square = Math.min(square, threshold);
             }


             // fetch the new image dimensions and crop
             let {width, height} = await clone.metadata();

             // clone = clone.extract({ left: (width - square), top: (height - square), width: square, height: square });
         }
         */


        clone
            .toBuffer()
            .then(function (image) {
                // process the Jimp image buffer
                streamifier.createReadStream(image).pipe(that._createOutputStream(path.join(that.uploadPath, filename), cb));
            })
            .catch(cb);

    };

    // multer requires this for handling the uploaded file
    AvatarStorage.prototype._handleFile = function (req, file, cb) {

        // create a reference for this to use in local functions
        let that = this;

        // create a writable stream using concat-stream that will
        // concatenate all the buffers written to it and pass the
        // complete buffer to a callback fn
        let fileManipulate = concat(async function (imageData) {


            if (that.options.sharpResizing)
                that._processImageSharp(imageData, cb, file.originalname);
            else
                Jimp.read(imageData)
                    .then(function (image) {
                        // process the Jimp image buffer
                        that._processImageJimp(image, cb, file.originalname);
                    })
                    .catch(cb);
        });

        // write the uploaded file buffer to the fileManipulate stream
        file.stream.pipe(fileManipulate);

    };

    // multer requires this for destroying file
    AvatarStorage.prototype._removeFile = function (req, file, cb) {

        let matches, pathsplit;
        let filename = file.filename;
        let _path = path.join(this.uploadPath, filename);
        let paths = [];

        // delete the file properties
        delete file.filename;
        delete file.destination;
        delete file.baseUrl;
        delete file.storage;

        // create paths for responsive images
        if (this.options.responsive) {
            pathsplit = _path.split('/');
            matches = pathsplit.pop().match(/^(.+?)_.+?\.(.+)$/i);

            if (matches) {
                paths = _.map(['lg', 'md', 'sm'], function (size) {
                    return pathsplit.join('/') + '/' + (matches[1] + '_' + size + '.' + matches[2]);
                });
            }
        } else {
            paths = [_path];
        }

        // delete the files from the filesystem
        _.each(paths, function (_path) {
            fs.unlink(_path, cb);
        });

    };

    // create a new instance with the passed options and return it
    return new AvatarStorage(options);

};

// export the storage engine
module.exports = AvatarStorage;
