const pool = require("../config/db");

// =======================================
// Get Notifications
// =======================================
exports.getNotifications = async (req, res) => {

try {

    const tenantId = req.user.tenantId;

    const result = await pool.query(
        `
        SELECT
            notification_id,
            tenant_id,
            title,
            message,
            is_read,
            created_at

        FROM notifications

        WHERE tenant_id = $1

        ORDER BY created_at DESC
        `,
        [tenantId]
    );

    const unreadResult = await pool.query(
        `
        SELECT COUNT(*) AS unread_count

        FROM notifications

        WHERE tenant_id = $1
        AND is_read = false
        `,
        [tenantId]
    );

    res.status(200).json({
        success: true,
        notifications: result.rows,
        unread_count:
            Number(unreadResult.rows[0].unread_count)
    });

} catch (err) {

    console.log("GET NOTIFICATIONS ERROR:", err);

    res.status(500).json({
        success: false,
        message: err.message
    });

}

};

// =======================================
// Mark One Notification As Read
// =======================================
exports.markAsRead = async (req, res) => {

try {

    const tenantId = req.user.tenantId;
    const { id } = req.params;

    const result = await pool.query(
        `
        UPDATE notifications

        SET is_read = true

        WHERE notification_id = $1
        AND tenant_id = $2

        RETURNING *
        `,
        [id, tenantId]
    );

    if (result.rows.length === 0) {

        return res.status(404).json({
            success: false,
            message: "Notification Not Found"
        });

    }

    res.status(200).json({
        success: true,
        message: "Notification Marked As Read",
        notification: result.rows[0]
    });

} catch (err) {

    console.log("MARK NOTIFICATION ERROR:", err);

    res.status(500).json({
        success: false,
        message: err.message
    });

}

};

// =======================================
// Mark All Notifications As Read
// =======================================
exports.markAllAsRead = async (req, res) => {

try {

    const tenantId = req.user.tenantId;

    await pool.query(
        `
        UPDATE notifications

        SET is_read = true

        WHERE tenant_id = $1
        AND is_read = false
        `,
        [tenantId]
    );

    res.status(200).json({
        success: true,
        message: "All Notifications Marked As Read"
    });

} catch (err) {

    console.log("MARK ALL NOTIFICATIONS ERROR:", err);

    res.status(500).json({
        success: false,
        message: err.message
    });

}

};

// =======================================
// Delete Notification
// =======================================
exports.deleteNotification = async (req, res) => {

try {

    const tenantId = req.user.tenantId;
    const { id } = req.params;

    const result = await pool.query(
        `
        DELETE FROM notifications

        WHERE notification_id = $1
        AND tenant_id = $2

        RETURNING *
        `,
        [id, tenantId]
    );

    if (result.rows.length === 0) {

        return res.status(404).json({
            success: false,
            message: "Notification Not Found"
        });

    }

    res.status(200).json({
        success: true,
        message: "Notification Deleted Successfully"
    });

} catch (err) {

    console.log("DELETE NOTIFICATION ERROR:", err);

    res.status(500).json({
        success: false,
        message: err.message
    });

}

};
