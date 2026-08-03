const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const upload = require("../middleware/uploadExcel");

const {
    exportExcel,
    uploadReport,
    generatePDF,
    getReportHistory,
    downloadReport,
    deleteReport
} = require("../controllers/reportController");

// =============================
// Export Company Data to Excel
// =============================
router.get(
    "/export-excel",
    auth,
    exportExcel
);


// =============================
// Upload Excel Report
// =============================
router.post(
    "/upload",
    auth,

    (req, res, next) => {

        console.log("Headers:");
        console.log(req.headers["content-type"]);

        next();

    },

    upload.single("report"),

    uploadReport
);

// =============================
// Generate PDF Report
// =============================
router.post(
    "/generate",
    auth,
    generatePDF
);

// =============================
// Report History
// =============================

router.get(
    "/history",
    auth,
    getReportHistory
);

// =============================
// Download Report
// =============================

router.get(
    "/download/:fileName",
    auth,
    downloadReport
);

// =============================
// Delete Report
// =============================

router.delete(
    "/:reportId",
    auth,
    deleteReport
);

module.exports = router;