const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
    getTenant,
    updateTenant,
    uploadTenantLogo
} = require("../controllers/tenantController");


// ================= GET COMPANY =================

router.get(
    "/",
    auth,
    getTenant
);


// ================= UPDATE COMPANY =================

router.put(
    "/",
    auth,
    updateTenant
);


// ================= UPLOAD COMPANY LOGO =================

router.put(
    "/logo",
    auth,
    upload.single("logo"),
    uploadTenantLogo
);


module.exports = router;