const express = require("express");
const router = express.Router();

const { getDashboard } = require("../controllers/dashboardController");

const auth = require("../middleware/auth");

// Dashboard
router.get("/", auth, getDashboard);

module.exports = router;