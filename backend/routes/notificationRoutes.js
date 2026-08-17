const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} = require("../controllers/notificationController");


// =======================================
// Get Notifications
// =======================================

router.get(
    "/",
    auth,
    getNotifications
);


// =======================================
// Mark One As Read
// =======================================

router.put(
    "/:id/read",
    auth,
    markAsRead
);


// =======================================
// Mark All As Read
// =======================================

router.put(
    "/read-all",
    auth,
    markAllAsRead
);


// =======================================
// Delete Notification
// =======================================

router.delete(
    "/:id",
    auth,
    deleteNotification
);


module.exports = router;
