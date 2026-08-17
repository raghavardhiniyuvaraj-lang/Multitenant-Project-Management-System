const pool = require("../config/db");

// =======================================
// Assign Employee to Project
// =======================================
exports.assignMember = async (req, res) => {
    console.log("========== ASSIGN MEMBER POST ==========");
    console.log("REQ BODY:", req.body);
    console.log("REQ USER:", req.user);

    try {

        const tenantId = req.user.tenantId;

        const {
            project_id,
            employee_id,
            role,
            assigned_date
        } = req.body;

        if (!project_id || !employee_id) {

            return res.status(400).json({
                success: false,
                message: "Project and Employee are required"
            });

        }

        // Check duplicate assignment
        const existing = await pool.query(
            `
            SELECT member_id
            FROM project_members
            WHERE tenant_id = $1
            AND project_id = $2
            AND employee_id = $3
            `,
            [
                tenantId,
                project_id,
                employee_id
            ]
        );

        if (existing.rows.length > 0) {

            return res.status(409).json({
                success: false,
                message: "Employee already assigned to this project"
            });

        }

        // Insert member
        const result = await pool.query(
            `
            INSERT INTO project_members
            (
                tenant_id,
                project_id,
                employee_id,
                role,
                assigned_date
            )
            VALUES
            ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [
                tenantId,
                project_id,
                employee_id,
                role || null,
                assigned_date || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Member Assigned Successfully",
            member: result.rows[0]
        });

    } catch (err) {

        console.log("ASSIGN MEMBER ERROR:", err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};


// =======================================
// Get All Project Members
// =======================================
exports.getMembers = async (req, res) => {

    try {

        const tenantId = req.user.tenantId;

        const result = await pool.query(
            `
            SELECT
                pm.member_id,
                pm.project_id,
                pm.employee_id,
                pm.role,
                pm.assigned_date,

                p.project_name,

                e.employee_name

            FROM project_members pm

            INNER JOIN projects p
                ON pm.project_id = p.project_id

            INNER JOIN employees e
                ON pm.employee_id = e.employee_id

            WHERE pm.tenant_id = $1

            ORDER BY pm.member_id DESC
            `,
            [tenantId]
        );

        console.log("MEMBERS FOUND:", result.rows);

        res.status(200).json({
            success: true,
            count: result.rows.length,
            members: result.rows
        });

    } catch (err) {

        console.log("GET MEMBERS ERROR:", err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};


// =======================================
// Update Member
// =======================================
exports.updateMember = async (req, res) => {

    try {

        const tenantId = req.user.tenantId;

        const { id } = req.params;

        const {
            project_id,
            employee_id,
            role,
            assigned_date
        } = req.body;

        if (!project_id || !employee_id) {

            return res.status(400).json({
                success: false,
                message: "Project and Employee are required"
            });

        }

        // Prevent duplicate assignment during update
        const existing = await pool.query(
            `
            SELECT member_id

            FROM project_members

            WHERE tenant_id = $1
            AND project_id = $2
            AND employee_id = $3
            AND member_id <> $4
            `,
            [
                tenantId,
                project_id,
                employee_id,
                id
            ]
        );

        if (existing.rows.length > 0) {

            return res.status(409).json({
                success: false,
                message: "Employee already assigned to this project"
            });

        }

        const result = await pool.query(
            `
            UPDATE project_members

            SET
                project_id = $1,
                employee_id = $2,
                role = $3,
                assigned_date = $4

            WHERE member_id = $5
            AND tenant_id = $6

            RETURNING *
            `,
            [
                project_id,
                employee_id,
                role || null,
                assigned_date || null,
                id,
                tenantId
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Member Not Found"
            });

        }

        res.status(200).json({
            success: true,
            message: "Member Updated Successfully",
            member: result.rows[0]
        });

    } catch (err) {

        console.log("UPDATE MEMBER ERROR:", err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};


// =======================================
// Delete Member
// =======================================
exports.deleteMember = async (req, res) => {

    try {

        const tenantId = req.user.tenantId;

        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM project_members

            WHERE member_id = $1
            AND tenant_id = $2

            RETURNING *
            `,
            [
                id,
                tenantId
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Member Not Found"
            });

        }

        res.status(200).json({
            success: true,
            message: "Member Removed Successfully"
        });

    } catch (err) {

        console.log("DELETE MEMBER ERROR:", err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};