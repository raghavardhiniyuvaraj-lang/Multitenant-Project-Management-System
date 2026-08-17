const pool = require("../config/db");

// =======================================
// Create Employee
// =======================================
exports.createEmployee = async (req, res) => {

    try {

        const {
            department_id,
            employee_name,
            email,
            phone,
            designation,
            salary
        } = req.body;

        const tenantId = req.user.tenantId;


        // =======================================
        // Validation
        // =======================================

        if (!department_id || !employee_name?.trim() || !email?.trim()) {

            return res.status(400).json({
                success: false,
                message: "Department, Employee Name and Email are required"
            });

        }


        // =======================================
        // Check Department belongs to Tenant
        // =======================================

        const departmentResult = await pool.query(
            `
            SELECT department_id
            FROM departments
            WHERE department_id = $1
            AND tenant_id = $2
            `,
            [
                department_id,
                tenantId
            ]
        );


        if (departmentResult.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Department not found"
            });

        }


        // =======================================
        // Check Duplicate Employee Email
        // =======================================

        const existingEmployee = await pool.query(
            `
            SELECT employee_id
            FROM employees
            WHERE tenant_id = $1
            AND LOWER(email) = LOWER($2)
            `,
            [
                tenantId,
                email.trim()
            ]
        );


        if (existingEmployee.rows.length > 0) {

            return res.status(409).json({
                success: false,
                message: "Employee email already exists"
            });

        }


        // =======================================
        // Create Employee
        // =======================================

        const result = await pool.query(
            `
            INSERT INTO employees
            (
                tenant_id,
                department_id,
                employee_name,
                email,
                phone,
                designation,
                salary
            )
            VALUES
            ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
            `,
            [
                tenantId,
                department_id,
                employee_name.trim(),
                email.trim(),
                phone || null,
                designation || null,
                salary || null
            ]
        );


        const employee = result.rows[0];


        // =======================================
        // Create Notification
        // =======================================

        await pool.query(
            `
            INSERT INTO notifications
            (
                tenant_id,
                title,
                message
            )
            VALUES
            ($1, $2, $3)
            `,
            [
                tenantId,
                "New Employee Added",
                `Employee "${employee.employee_name}" has been added successfully.`
            ]
        );


        // =======================================
        // Response
        // =======================================

        res.status(201).json({

            success: true,

            message: "Employee Created Successfully",

            employee: employee

        });


    } catch (error) {

        console.log(
            "========== CREATE EMPLOYEE ERROR =========="
        );

        console.log(error);
        console.log(error.message);
        console.log(error.detail);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =======================================
// Get Employees
// =======================================
exports.getEmployees = async (req, res) => {

    try {

        const tenantId = req.user.tenantId;


        const result = await pool.query(
            `
            SELECT
                e.employee_id,
                e.department_id,
                e.employee_name,
                e.email,
                e.phone,
                e.designation,
                e.salary,
                e.status,
                d.department_name

            FROM employees e

            LEFT JOIN departments d
                ON e.department_id = d.department_id
                AND d.tenant_id = e.tenant_id

            WHERE e.tenant_id = $1

            ORDER BY e.employee_name ASC
            `,
            [
                tenantId
            ]
        );


        res.status(200).json({

            success: true,

            count: result.rows.length,

            employees: result.rows

        });


    } catch (error) {

        console.log(
            "GET EMPLOYEES ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =======================================
// Update Employee
// =======================================
exports.updateEmployee = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            department_id,
            employee_name,
            email,
            phone,
            designation,
            salary
        } = req.body;

        const tenantId = req.user.tenantId;


        // =======================================
        // Validation
        // =======================================

        if (!department_id || !employee_name?.trim() || !email?.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Department, Employee Name and Email are required"

            });

        }


        // =======================================
        // Check Department
        // =======================================

        const departmentResult = await pool.query(
            `
            SELECT department_id

            FROM departments

            WHERE department_id = $1
            AND tenant_id = $2
            `,
            [
                department_id,
                tenantId
            ]
        );


        if (departmentResult.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Department not found"

            });

        }


        // =======================================
        // Check Duplicate Email
        // =======================================

        const existingEmployee = await pool.query(
            `
            SELECT employee_id

            FROM employees

            WHERE tenant_id = $1
            AND LOWER(email) = LOWER($2)
            AND employee_id <> $3
            `,
            [
                tenantId,
                email.trim(),
                id
            ]
        );


        if (existingEmployee.rows.length > 0) {

            return res.status(409).json({

                success: false,

                message: "Employee email already exists"

            });

        }


        // =======================================
        // Update Employee
        // =======================================

        const result = await pool.query(
            `
            UPDATE employees

            SET
                department_id = $1,
                employee_name = $2,
                email = $3,
                phone = $4,
                designation = $5,
                salary = $6

            WHERE employee_id = $7
            AND tenant_id = $8

            RETURNING *
            `,
            [
                department_id,
                employee_name.trim(),
                email.trim(),
                phone || null,
                designation || null,
                salary || null,
                id,
                tenantId
            ]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Employee Not Found"

            });

        }


        const employee = result.rows[0];


        // =======================================
        // Create Notification
        // =======================================

        await pool.query(
            `
            INSERT INTO notifications
            (
                tenant_id,
                title,
                message
            )
            VALUES
            ($1, $2, $3)
            `,
            [
                tenantId,
                "Employee Updated",
                `Employee "${employee.employee_name}" has been updated successfully.`
            ]
        );


        // =======================================
        // Response
        // =======================================

        res.status(200).json({

            success: true,

            message: "Employee Updated Successfully",

            employee: employee

        });


    } catch (error) {

        console.log(
            "UPDATE EMPLOYEE ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =======================================
// Delete Employee
// =======================================
exports.deleteEmployee = async (req, res) => {

    try {

        const { id } = req.params;

        const tenantId = req.user.tenantId;


        // =======================================
        // Delete Employee
        // =======================================

        const result = await pool.query(
            `
            DELETE FROM employees

            WHERE employee_id = $1
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

                message: "Employee Not Found"

            });

        }


        const employee = result.rows[0];


        // =======================================
        // Create Notification
        // =======================================

        await pool.query(
            `
            INSERT INTO notifications
            (
                tenant_id,
                title,
                message
            )
            VALUES
            ($1, $2, $3)
            `,
            [
                tenantId,
                "Employee Deleted",
                `Employee "${employee.employee_name}" has been deleted successfully.`
            ]
        );


        // =======================================
        // Response
        // =======================================

        res.status(200).json({

            success: true,

            message: "Employee Deleted Successfully"

        });


    } catch (error) {

        console.log(
            "DELETE EMPLOYEE ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};