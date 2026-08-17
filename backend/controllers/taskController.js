const pool = require("../config/db");

// =======================================
// Create Task
// =======================================
exports.createTask = async (req, res) => {

    try {

        const tenantId = req.user.tenantId;

        const {
            project_id,
            employee_id,
            task_name,
            description,
            priority,
            status,
            due_date
        } = req.body;


        // =======================================
        // Validation
        // =======================================

        if (!project_id || !employee_id || !task_name?.trim()) {

            return res.status(400).json({
                success: false,
                message: "Project, Employee and Task Name are required"
            });

        }


        // =======================================
        // Check Project belongs to Tenant
        // =======================================

        const projectResult = await pool.query(
            `
            SELECT project_id
            FROM projects
            WHERE project_id = $1
            AND tenant_id = $2
            `,
            [
                project_id,
                tenantId
            ]
        );


        if (projectResult.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Project not found"
            });

        }


        // =======================================
        // Check Employee belongs to Tenant
        // =======================================

        const employeeResult = await pool.query(
            `
            SELECT employee_id
            FROM employees
            WHERE employee_id = $1
            AND tenant_id = $2
            `,
            [
                employee_id,
                tenantId
            ]
        );


        if (employeeResult.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });

        }


        // =======================================
        // Create Task
        // =======================================

        const result = await pool.query(
            `
            INSERT INTO tasks
            (
                tenant_id,
                project_id,
                employee_id,
                task_name,
                description,
                priority,
                status,
                due_date
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *
            `,
            [
                tenantId,
                project_id,
                employee_id,
                task_name.trim(),
                description?.trim() || null,
                priority || "Medium",
                status || "Pending",
                due_date || null
            ]
        );


        const task = result.rows[0];


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
                "New Task Assigned",
                `Task "${task.task_name}" has been assigned successfully.`
            ]
        );


        // =======================================
        // Response
        // =======================================

        res.status(201).json({

            success: true,

            message: "Task Created Successfully",

            task: task

        });


    } catch (err) {

        console.log(
            "CREATE TASK ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// =======================================
// Get All Tasks
// =======================================
exports.getTasks = async (req, res) => {

    try {

        const tenantId = req.user.tenantId;


        const result = await pool.query(
            `
            SELECT
                t.task_id,
                t.project_id,
                t.employee_id,
                t.task_name,
                t.description,
                t.priority,
                t.status,
                t.due_date,

                p.project_name,

                e.employee_name

            FROM tasks t

            INNER JOIN projects p
                ON t.project_id = p.project_id
                AND p.tenant_id = t.tenant_id

            INNER JOIN employees e
                ON t.employee_id = e.employee_id
                AND e.tenant_id = t.tenant_id

            WHERE t.tenant_id = $1

            ORDER BY t.task_id DESC
            `,
            [
                tenantId
            ]
        );


        res.status(200).json({

            success: true,

            count: result.rows.length,

            tasks: result.rows

        });


    } catch (err) {

        console.log(
            "GET TASKS ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// =======================================
// Update Task
// =======================================
exports.updateTask = async (req, res) => {

    try {

        const tenantId = req.user.tenantId;

        const { id } = req.params;

        const {
            project_id,
            employee_id,
            task_name,
            description,
            priority,
            status,
            due_date
        } = req.body;


        // =======================================
        // Validation
        // =======================================

        if (!project_id || !employee_id || !task_name?.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Project, Employee and Task Name are required"

            });

        }


        // =======================================
        // Check Project belongs to Tenant
        // =======================================

        const projectResult = await pool.query(
            `
            SELECT project_id

            FROM projects

            WHERE project_id = $1
            AND tenant_id = $2
            `,
            [
                project_id,
                tenantId
            ]
        );


        if (projectResult.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Project not found"

            });

        }


        // =======================================
        // Check Employee belongs to Tenant
        // =======================================

        const employeeResult = await pool.query(
            `
            SELECT employee_id

            FROM employees

            WHERE employee_id = $1
            AND tenant_id = $2
            `,
            [
                employee_id,
                tenantId
            ]
        );


        if (employeeResult.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Employee not found"

            });

        }


        // =======================================
        // Update Task
        // =======================================

        const result = await pool.query(
            `
            UPDATE tasks

            SET
                project_id = $1,
                employee_id = $2,
                task_name = $3,
                description = $4,
                priority = $5,
                status = $6,
                due_date = $7

            WHERE task_id = $8
            AND tenant_id = $9

            RETURNING *
            `,
            [
                project_id,
                employee_id,
                task_name.trim(),
                description?.trim() || null,
                priority || "Medium",
                status || "Pending",
                due_date || null,
                id,
                tenantId
            ]
        );


        // =======================================
        // Check Task Exists
        // =======================================

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Task Not Found"

            });

        }


        const task = result.rows[0];


        // =======================================
        // Create Update Notification
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
                "Task Updated",
                `Task "${task.task_name}" has been updated successfully.`
            ]
        );


        // =======================================
        // Response
        // =======================================

        res.status(200).json({

            success: true,

            message: "Task Updated Successfully",

            task: task

        });


    } catch (err) {

        console.log(
            "UPDATE TASK ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// =======================================
// Delete Task
// =======================================
exports.deleteTask = async (req, res) => {

    try {

        const tenantId = req.user.tenantId;

        const { id } = req.params;


        // =======================================
        // Delete Task
        // =======================================

        const result = await pool.query(
            `
            DELETE FROM tasks

            WHERE task_id = $1
            AND tenant_id = $2

            RETURNING *
            `,
            [
                id,
                tenantId
            ]
        );


        // =======================================
        // Check Task Exists
        // =======================================

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Task Not Found"

            });

        }


        const task = result.rows[0];


        // =======================================
        // Create Delete Notification
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
                "Task Deleted",
                `Task "${task.task_name}" has been deleted successfully.`
            ]
        );


        // =======================================
        // Response
        // =======================================

        res.status(200).json({

            success: true,

            message: "Task Deleted Successfully"

        });


    } catch (err) {

        console.log(
            "DELETE TASK ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};