const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

// We will create this middleware in the next step
const upload = require("../middleware/uploadCompanyLogo");

const {

    getSettings,

    saveSettings

} = require("../controllers/settingsController");


// ==============================
// Get Company Settings
// ==============================

router.get(

    "/",

    auth,

    getSettings

);


// ==============================
// Save Company Settings
// ==============================

router.post(

    "/",

    auth,

    upload.single("company_logo"),

    saveSettings

);

module.exports = router;