const pool = require("../config/db");

// ===============================
// Assign Employee to Project
// ===============================
exports.assignMember = async (req, res) => {

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

        // Prevent duplicate assignment
        const existing = await pool.query(
            `SELECT * FROM project_members
             WHERE tenant_id=$1
             AND project_id=$2
             AND employee_id=$3`,
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

        const result = await pool.query(
            `INSERT INTO project_members
            (
                tenant_id,
                project_id,
                employee_id,
                role,
                assigned_date
            )
            VALUES($1,$2,$3,$4,$5)
            RETURNING *`,
            [
                tenantId,
                project_id,
                employee_id,
                role,
                assigned_date
            ]
        );

        res.status(201).json({
            success: true,
            message: "Member Assigned Successfully",
            member: result.rows[0]
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ===============================
// Get All Members
// ===============================
exports.getMembers = async (req, res) => {

    try {

        const tenantId = req.user.tenantId;

        const result = await pool.query(
            `SELECT
                pm.member_id,
                p.project_name,
                e.employee_name,
                pm.role,
                pm.assigned_date

            FROM project_members pm

            JOIN projects p
            ON pm.project_id = p.project_id

            JOIN employees e
            ON pm.employee_id = e.employee_id

            WHERE pm.tenant_id=$1

            ORDER BY pm.member_id DESC`,
            [tenantId]
        );

        res.json({
            success: true,
            count: result.rows.length,
            members: result.rows
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};
// ===============================
// Update Member
// ===============================
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

        const result = await pool.query(
            `UPDATE project_members
             SET
                project_id = $1,
                employee_id = $2,
                role = $3,
                assigned_date = $4
             WHERE member_id = $5
             AND tenant_id = $6
             RETURNING *`,
            [
                project_id,
                employee_id,
                role,
                assigned_date,
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

        res.json({
            success: true,
            message: "Member Updated Successfully",
            member: result.rows[0]
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};
// ===============================
// Delete Member
// ===============================
exports.deleteMember = async (req, res) => {

    try {

        const tenantId = req.user.tenantId;

        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM project_members
             WHERE member_id=$1
             AND tenant_id=$2
             RETURNING *`,
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

        res.json({
            success: true,
            message: "Member Removed Successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};