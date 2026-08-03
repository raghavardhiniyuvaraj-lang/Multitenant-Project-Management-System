const pool = require("../config/db");

// ================= GET PROFILE =================
exports.getProfile = async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT
                user_id,
                username,
                email,
                role,
                phone,
                profile_photo
            FROM users
            WHERE user_id = $1`,
            [req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            profile: result.rows[0]
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};
const bcrypt = require("bcryptjs");

// ================= CHANGE PASSWORD =================

exports.changePassword = async (req, res) => {

    try {

        const userId = req.user.userId;

        const {
            currentPassword,
            newPassword
        } = req.body;

        // Get current user
        const result = await pool.query(
            "SELECT * FROM users WHERE user_id = $1",
            [userId]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        const user = result.rows[0];

        // Verify current password
        const validPassword = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!validPassword) {

            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });

        }

        // Hash new password
        const hashedPassword =
            await bcrypt.hash(newPassword, 10);

        // Update password
        await pool.query(

            `UPDATE users
             SET password=$1
             WHERE user_id=$2`,

            [
                hashedPassword,
                userId
            ]

        );

        res.json({

            success: true,
            message: "Password changed successfully"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};

// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {

    try {

        const {
            username,
            email,
            phone,
            profile_photo
        } = req.body;

        const result = await pool.query(
            `UPDATE users
             SET
                username=$1,
                email=$2,
                phone=$3,
                profile_photo=$4
             WHERE user_id=$5
             RETURNING
                user_id,
                username,
                email,
                role,
                phone,
                profile_photo`,
            [
                username,
                email,
                phone,
                profile_photo,
                req.user.userId
            ]
        );

        res.json({
            success: true,
            message: "Profile updated successfully",
            profile: result.rows[0]
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};
exports.uploadProfilePhoto = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "No image uploaded"
            });

        }

        const imagePath =
            `uploads/profile/${req.file.filename}`;

        await pool.query(
            `UPDATE users
             SET profile_photo = $1
             WHERE user_id = $2`,
            [
                imagePath,
                req.user.userId
            ]
        );

        res.json({

            success: true,

            message:
                "Profile photo uploaded successfully",

            profile_photo: imagePath

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};