const pool = require("../config/db");

// ================= GET COMPANY =================

exports.getTenant = async (req, res) => {

    try {

        const result = await pool.query(

            `SELECT
                tenant_id,
                tenant_name,
                email,
                phone,
                address,
                website,
                logo,
                theme_color,
                status,
                subscription_plan
             FROM tenants
             WHERE tenant_id = $1`,

            [req.user.tenantId]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,
                message: "Company not found"

            });

        }

        res.json({

            success: true,
            tenant: result.rows[0]

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


// ================= UPDATE COMPANY =================

exports.updateTenant = async (req, res) => {

    try {

        const {

            tenant_name,
            email,
            phone,
            address,
            website,
            theme_color,
            status

        } = req.body;

        const result = await pool.query(

            `UPDATE tenants

             SET

                tenant_name = $1,
                email = $2,
                phone = $3,
                address = $4,
                website = $5,
                theme_color = $6,
                status = $7

             WHERE tenant_id = $8

             RETURNING
                tenant_id,
                tenant_name,
                email,
                phone,
                address,
                website,
                logo,
                theme_color,
                status,
                subscription_plan`,

            [

                tenant_name,
                email,
                phone,
                address,
                website,
                theme_color,
                status,
                req.user.tenantId

            ]

        );

        res.json({

            success: true,
            message: "Company updated successfully",
            tenant: result.rows[0]

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


// ================= UPLOAD COMPANY LOGO =================

exports.uploadTenantLogo = async (req, res) => {

    console.log("===== COMPANY LOGO UPLOAD =====");
    console.log("User:", req.user);
    console.log("File:", req.file);

    try {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "No logo uploaded"
            });

        }

        const logoPath = `uploads/company/${req.file.filename}`;

        console.log("Logo Path:", logoPath);

        await pool.query(
            `UPDATE tenants
             SET logo = $1
             WHERE tenant_id = $2`,
            [
                logoPath,
                req.user.tenantId
            ]
        );

        console.log("Database Updated Successfully");

        res.json({
            success: true,
            message: "Company logo uploaded successfully",
            logo: logoPath
        });

    } catch (err) {

        console.log("Upload Error:", err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};