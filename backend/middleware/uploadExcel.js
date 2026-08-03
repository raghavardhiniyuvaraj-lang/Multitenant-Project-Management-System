const multer = require("multer");
const path = require("path");
const fs = require("fs");

fs.mkdirSync("uploads/reports", { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("Destination Called");
        cb(null, "uploads/reports");
    },

    filename: (req, file, cb) => {
        console.log("Filename Called");
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {

    console.log("FILE RECEIVED:");
    console.log(file);

    cb(null, true);

};

module.exports = multer({
    storage,
    fileFilter
});