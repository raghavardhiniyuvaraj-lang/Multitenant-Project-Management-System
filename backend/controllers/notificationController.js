const pool = require("../config/db");

// =======================================
// Get Notifications
// =======================================

exports.getNotifications = async (req, res) => {

    try {

        const tenantId = req.user.tenantId;

        const notifications = [];

        // Pending Tasks
        const pending = await pool.query(
            `
            SELECT
                task_name,
                due_date
            FROM tasks
            WHERE tenant_id=$1
            AND status='Pending'
            ORDER BY due_date ASC
            LIMIT 5
            `,
            [tenantId]
        );

        pending.rows.forEach(task => {

            notifications.push({

                type: "task",

                icon: "🟡",

                message: `${task.task_name} is still pending`,

                time: task.due_date

            });

        });

        // Recently Added Projects
        const projects = await pool.query(
            `
            SELECT
                project_name,
                start_date
            FROM projects
            WHERE tenant_id=$1
            ORDER BY project_id DESC
            LIMIT 5
            `,
            [tenantId]
        );

        projects.rows.forEach(project => {

            notifications.push({

                type: "project",

                icon: "📁",

                message: `New project "${project.project_name}" created`,

                time: project.start_date

            });

        });

        // Recently Added Employees
        const employees = await pool.query(
            `
            SELECT
                employee_name,
                created_at
            FROM employees
            WHERE tenant_id=$1
            ORDER BY employee_id DESC
            LIMIT 5
            `,
            [tenantId]
        );

        employees.rows.forEach(employee => {

            notifications.push({

                type: "employee",

                icon: "👤",

                message: `${employee.employee_name} joined the company`,

                time: employee.created_at

            });

        });

        notifications.sort(
            (a, b) => new Date(b.time) - new Date(a.time)
        );

        res.json({

            success: true,

            count: notifications.length,

            notifications

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