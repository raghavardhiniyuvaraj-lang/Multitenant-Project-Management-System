const db = require("../config/db");

// ===============================
// Get Company Settings
// ===============================

exports.getSettings = async (req, res) => {
    try {
        const result = await db.query(
            `
            SELECT
                tenant_id,
                company_name,
                company_email,
                company_phone,
                company_address,
                company_logo
            FROM company_settings
            WHERE tenant_id = $1
            LIMIT 1
            `,
            [req.user.tenantId]
        );

        res.json({
            success: true,
            settings: result.rows[0] || {}
        });

    } catch (err) {
        console.log("GET SETTINGS ERROR:", err);

        res.status(500).json({
            success: false,
            message: "Failed to Fetch Settings"
        });
    }
};


// ===============================
// Save / Update Company Settings
// ===============================

exports.saveSettings = async (req, res) => {
    try {
        const {
            company_name,
            company_email,
            company_phone,
            company_address
        } = req.body;

        const tenantId = req.user.tenantId;

        // Uploaded logo filename
        const logo = req.file ? req.file.filename : null;

        // Check whether settings already exist
        const check = await db.query(
            `
            SELECT company_logo
            FROM company_settings
            WHERE tenant_id = $1
            LIMIT 1
            `,
            [tenantId]
        );

        if (check.rows.length > 0) {

            // --------------------------------
            // UPDATE EXISTING SETTINGS
            // --------------------------------

            await db.query(
                `
                UPDATE company_settings
                SET
                    company_name = $1,
                    company_email = $2,
                    company_phone = $3,
                    company_address = $4,
                    company_logo = COALESCE($5, company_logo)
                WHERE tenant_id = $6
                `,
                [
                    company_name,
                    company_email,
                    company_phone,
                    company_address,
                    logo,
                    tenantId
                ]
            );

        } else {

            // --------------------------------
            // CREATE NEW SETTINGS
            // --------------------------------

            await db.query(
                `
                INSERT INTO company_settings
                (
                    tenant_id,
                    company_name,
                    company_email,
                    company_phone,
                    company_address,
                    company_logo
                )
                VALUES
                ($1, $2, $3, $4, $5, $6)
                `,
                [
                    tenantId,
                    company_name,
                    company_email,
                    company_phone,
                    company_address,
                    logo
                ]
            );
        }

        res.json({
            success: true,
            message: "Company Settings Saved Successfully"
        });

    } catch (err) {

        console.log("SAVE SETTINGS ERROR:", err);

        res.status(500).json({
            success: false,
            message: "Failed to Save Settings"
        });
    }
};