const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        let folder = "";

        if (req.originalUrl.includes("/tenant/logo")) {

            folder = path.join(__dirname, "../uploads/company");

        }

        else if (req.originalUrl.includes("/reports/upload")) {

            folder = path.join(__dirname, "../uploads/reports");

        }

        else {

            folder = path.join(__dirname, "../uploads/profile");

        }

        fs.mkdirSync(folder, { recursive: true });

        cb(null, folder);

    },

    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() + "-" + file.originalname
        );

    }

});

const fileFilter = (req, file, cb) => {

    // Company Logo
    if (req.originalUrl.includes("/tenant/logo")) {

        const allowed = /jpeg|jpg|png/;

        const ext = allowed.test(
            path.extname(file.originalname).toLowerCase()
        );

        const mime = allowed.test(file.mimetype);

        if (ext && mime) {

            return cb(null, true);

        }

        return cb(new Error("Only JPG/JPEG/PNG allowed"));

    }

    // Excel Upload

    if (req.originalUrl.includes("/reports/upload")) {

        const ext = path.extname(file.originalname).toLowerCase();

        if (ext === ".xlsx" || ext === ".xls") {

            return cb(null, true);

        }

        return cb(new Error("Only Excel files are allowed"));

    }

    cb(null, true);

};

module.exports = multer({

    storage,

    fileFilter

});