const pool = require("../config/db");

// ===============================
// Create Department
// ===============================
exports.createDepartment = async (req, res) => {
    try {

        const { department_name, description } = req.body;

        if (!department_name) {
            return res.status(400).json({
                message: "Department Name is required"
            });
        }

        const tenantId = req.user.tenantId;

        // Check duplicate department
        const existingDepartment = await pool.query(
            `SELECT * FROM departments
             WHERE tenant_id=$1
             AND department_name=$2`,
            [tenantId, department_name]
        );

        if (existingDepartment.rows.length > 0) {
            return res.status(409).json({
                message: "Department already exists"
            });
        }

        const result = await pool.query(
            `INSERT INTO departments
            (tenant_id, department_name, description)
            VALUES($1,$2,$3)
            RETURNING *`,
            [
                tenantId,
                department_name,
                description
            ]
        );

        res.status(201).json({
            success: true,
            message: "Department Created Successfully",
            department: result.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

// ===============================
// Get Departments
// ===============================
exports.getDepartments = async (req, res) => {

    try {

        const tenantId = req.user.tenantId;

        const result = await pool.query(
            `SELECT
                department_id,
                department_name,
                description,
                created_at
            FROM departments
            WHERE tenant_id=$1
            ORDER BY department_name ASC`,
            [tenantId]
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            departments: result.rows
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// ===============================
// Update Department
// ===============================
exports.updateDepartment = async (req, res) => {

    try {

        const { id } = req.params;
        const { department_name, description } = req.body;

        // Validation
        if (!department_name || !department_name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Department Name is required"
            });
        }

        const tenantId = req.user.tenantId;

        // Check duplicate department name
        // Exclude the department currently being edited
        const duplicate = await pool.query(
            `SELECT department_id
             FROM departments
             WHERE tenant_id=$1
             AND LOWER(department_name)=LOWER($2)
             AND department_id<>$3`,
            [
                tenantId,
                department_name.trim(),
                id
            ]
        );

        if (duplicate.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Department already exists"
            });
        }

        // Update department
        const result = await pool.query(
            `UPDATE departments
             SET
                department_name=$1,
                description=$2
             WHERE department_id=$3
             AND tenant_id=$4
             RETURNING *`,
            [
                department_name.trim(),
                description ? description.trim() : null,
                id,
                tenantId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Department Not Found"
            });
        }

        res.json({
            success: true,
            message: "Department Updated Successfully",
            department: result.rows[0]
        });

    } catch (error) {

        console.log("========== UPDATE DEPARTMENT ERROR ==========");
        console.log(error);
        console.log(error.message);
        console.log(error.detail);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// ===============================
// Delete Department
// ===============================
exports.deleteDepartment = async (req, res) => {

    try {

        const { id } = req.params;

        const tenantId = req.user.tenantId;

        const result = await pool.query(
            `DELETE FROM departments
            WHERE department_id=$1
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
                message: "Department Not Found"
            });
        }

        res.json({
            success: true,
            message: "Department Deleted Successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};