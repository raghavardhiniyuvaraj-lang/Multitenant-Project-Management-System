const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
    getDashboard
} = require("../controllers/dashboardController");


// Get Dashboard Summary
router.get("/", auth, getDashboard);


module.exports = router;