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

        if (!project_id || !employee_id || !task_name) {
            return res.status(400).json({
                success: false,
                message: "Project, Employee and Task Name are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO tasks
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
            VALUES($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *`,
            [
                tenantId,
                project_id,
                employee_id,
                task_name,
                description,
                priority,
                status,
                due_date
            ]
        );

        res.status(201).json({
            success: true,
            message: "Task Created Successfully",
            task: result.rows[0]
        });

    } catch (err) {

        console.log(err);

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

            JOIN projects p
            ON t.project_id = p.project_id

            JOIN employees e
            ON t.employee_id = e.employee_id

            WHERE t.tenant_id = $1

            ORDER BY t.task_id DESC
            `,
            [tenantId]
        );

        res.json({
            success: true,
            count: result.rows.length,
            tasks: result.rows
        });

    } catch (err) {

        console.log(err);

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

        const result = await pool.query(
            `
            UPDATE tasks

            SET

            project_id=$1,
            employee_id=$2,
            task_name=$3,
            description=$4,
            priority=$5,
            status=$6,
            due_date=$7

            WHERE

            task_id=$8
            AND tenant_id=$9

            RETURNING *
            `,
            [
                project_id,
                employee_id,
                task_name,
                description,
                priority,
                status,
                due_date,
                id,
                tenantId
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Task Not Found"
            });

        }

        res.json({
            success: true,
            message: "Task Updated Successfully",
            task: result.rows[0]
        });

    } catch (err) {

        console.log(err);

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

        const result = await pool.query(
            `
            DELETE FROM tasks

            WHERE

            task_id=$1
            AND tenant_id=$2

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
                message: "Task Not Found"
            });

        }

        res.json({
            success: true,
            message: "Task Deleted Successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};