const multer = require("multer");

const path = require("path");

const fs = require("fs");

// =====================================
// Upload Folder
// =====================================

const uploadPath = path.join(
    __dirname,
    "../uploads/company"
);

if (!fs.existsSync(uploadPath)) {

    fs.mkdirSync(uploadPath, {
        recursive: true
    });

}

// =====================================
// Storage
// =====================================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, uploadPath);

    },

    filename: function (req, file, cb) {

        cb(
            null,
            Date.now() +
            path.extname(file.originalname)
        );

    }

});

// =====================================
// File Filter
// =====================================

const fileFilter = (req, file, cb) => {

    const allowed = [

        "image/png",

        "image/jpeg",

        "image/jpg"

    ];

    if (allowed.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(
            new Error("Only PNG, JPG and JPEG files are allowed"),
            false
        );

    }

};

// =====================================
// Upload
// =====================================

const upload = multer({

    storage,

    fileFilter

});

module.exports = upload;