const express = require("express");

const router = express.Router();

const auth =
    require("../middleware/auth");

const upload =
    require("../middleware/uploadExcel");

const {
    exportExcel,
    uploadReport,
    generatePDF,
    getReportHistory,
    downloadReport,
    deleteReport
} = require("../controllers/reportController");

// Export Excel
router.get(
    "/export-excel",
    auth,
    exportExcel
);

// Upload Excel
router.post(
    "/upload",
    auth,
    upload.single("report"),
    uploadReport
);

// Generate PDF
router.post(
    "/generate",
    auth,
    generatePDF
);

// Report History
router.get(
    "/history",
    auth,
    getReportHistory
);

// Download Report
router.get(
    "/download/:fileName",
    auth,
    downloadReport
);

// Delete Report
router.delete(
    "/:reportId",
    auth,
    deleteReport
);

module.exports = router;