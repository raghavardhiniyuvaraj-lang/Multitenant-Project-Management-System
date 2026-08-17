const pool = require("../config/db");

// =======================================
// Dashboard Summary
// =======================================

exports.getDashboard = async (req, res) => {

    try {

        const tenantId = req.user.tenantId;

        console.log("=================================");
console.log("DASHBOARD DEBUG");
console.log("Tenant ID:", tenantId);

const debugProjects = await pool.query(
    `SELECT project_id, tenant_id, project_name
     FROM projects
     WHERE tenant_id = $1`,
    [tenantId]
);

console.log("Projects for tenant:", tenantId);
console.log(debugProjects.rows);

const debugEmployees = await pool.query(
    `SELECT employee_id, tenant_id, employee_name
     FROM employees
     WHERE tenant_id = $1`,
    [tenantId]
);

console.log("Employees for tenant:", tenantId);
console.log(debugEmployees.rows);

const debugTasks = await pool.query(
    `SELECT task_id, tenant_id, task_name
     FROM tasks
     WHERE tenant_id = $1`,
    [tenantId]
);

console.log("Tasks for tenant:", tenantId);
console.log(debugTasks.rows);

console.log("=================================");

        // =======================================
        // TOTAL PROJECTS
        // =======================================

        const projectsResult = await pool.query(
            `
            SELECT COUNT(*) AS total_projects
            FROM projects
            WHERE tenant_id = $1
            `,
            [tenantId]
        );


        // =======================================
        // ACTIVE PROJECTS
        // =======================================

        const activeProjectsResult = await pool.query(
            `
            SELECT COUNT(*) AS active_projects
            FROM projects
            WHERE tenant_id = $1
            AND LOWER(status) = 'active'
            `,
            [tenantId]
        );


        // =======================================
        // TOTAL EMPLOYEES
        // =======================================

        const employeesResult = await pool.query(
            `
            SELECT COUNT(*) AS total_employees
            FROM employees
            WHERE tenant_id = $1
            `,
            [tenantId]
        );

        // =======================================
// TOTAL DEPARTMENTS
// =======================================

const departmentsResult = await pool.query(
    `
    SELECT COUNT(*) AS total_departments
    FROM departments
    WHERE tenant_id = $1
    `,
    [tenantId]
);

        // =======================================
        // TOTAL TASKS
        // =======================================

        const tasksResult = await pool.query(
            `
            SELECT COUNT(*) AS total_tasks
            FROM tasks
            WHERE tenant_id = $1
            `,
            [tenantId]
        );


        // =======================================
        // COMPLETED TASKS
        // =======================================

        const completedTasksResult = await pool.query(
            `
            SELECT COUNT(*) AS completed_tasks
            FROM tasks
            WHERE tenant_id = $1
            AND LOWER(status) = 'completed'
            `,
            [tenantId]
        );


        // =======================================
        // PENDING TASKS
        // =======================================

        const pendingTasksResult = await pool.query(
            `
            SELECT COUNT(*) AS pending_tasks
            FROM tasks
            WHERE tenant_id = $1
            AND LOWER(status) = 'pending'
            `,
            [tenantId]
        );


        // =======================================
        // IN PROGRESS TASKS
        // =======================================

        const inProgressTasksResult = await pool.query(
            `
            SELECT COUNT(*) AS in_progress_tasks
            FROM tasks
            WHERE tenant_id = $1
            AND LOWER(status) = 'in progress'
            `,
            [tenantId]
        );


        // =======================================
        // RECENT PROJECTS
        // =======================================

        const recentProjectsResult = await pool.query(
            `
            SELECT
                project_id,
                project_name,
                status,
                start_date,
                end_date
            FROM projects
            WHERE tenant_id = $1
            ORDER BY project_id DESC
            LIMIT 5
            `,
            [tenantId]
        );


        // =======================================
        // RECENT TASKS
        // =======================================

        const recentTasksResult = await pool.query(
            `
            SELECT
                task_id,
                task_name,
                priority,
                status,
                due_date
            FROM tasks
            WHERE tenant_id = $1
            ORDER BY task_id DESC
            LIMIT 5
            `,
            [tenantId]
        );


        // =======================================
        // RESPONSE
        // =======================================

        res.json({

            success: true,

            dashboard: {

                total_projects:
                    Number(
                        projectsResult.rows[0].total_projects
                    ),

                active_projects:
                    Number(
                        activeProjectsResult.rows[0].active_projects
                    ),

                total_employees:
    Number(
        employeesResult.rows[0].total_employees
    ),

total_departments:
    Number(
        departmentsResult.rows[0].total_departments
    ),



                total_tasks:
                    Number(
                        tasksResult.rows[0].total_tasks
                    ),

                completed_tasks:
                    Number(
                        completedTasksResult.rows[0].completed_tasks
                    ),

                pending_tasks:
                    Number(
                        pendingTasksResult.rows[0].pending_tasks
                    ),

                in_progress_tasks:
                    Number(
                        inProgressTasksResult.rows[0].in_progress_tasks
                    ),

                recent_projects:
                    recentProjectsResult.rows,

                recent_tasks:
                    recentTasksResult.rows

            }

        });

    }

    catch (err) {

        console.log(
            "Dashboard Error:",
            err
        );

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
