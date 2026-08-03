const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
    getProfile,
    updateProfile,
    uploadProfilePhoto,
    changePassword
} = require("../controllers/profileController");

router.get("/", auth, getProfile);

router.put("/", auth, updateProfile);

router.put(
    "/photo",
    auth,
    upload.single("profile_photo"),
    uploadProfilePhoto
);

router.put(
    "/change-password",
    auth,
    changePassword
);

module.exports = router;