const db = require("../config/db");

exports.getDashboard = async (req, res) => {
    try {

        const tenantId = req.user.tenantId;

        // Dashboard Counts
        const employeeCount = await db.query(
            "SELECT COUNT(*) FROM employees WHERE tenant_id=$1",
            [tenantId]
        );

        const departmentCount = await db.query(
            "SELECT COUNT(*) FROM departments WHERE tenant_id=$1",
            [tenantId]
        );

        const projectCount = await db.query(
            "SELECT COUNT(*) FROM projects WHERE tenant_id=$1",
            [tenantId]
        );

        const taskCount = await db.query(
            "SELECT COUNT(*) FROM tasks WHERE tenant_id=$1",
            [tenantId]
        );

        // Task Status Counts
        const taskStatus = await db.query(
            `
            SELECT
                COUNT(*) FILTER (WHERE status='Pending') AS pending,
                COUNT(*) FILTER (WHERE status='In Progress') AS progress,
                COUNT(*) FILTER (WHERE status='Completed') AS completed
            FROM tasks
            WHERE tenant_id=$1
            `,
            [tenantId]
        );

        // Recent Employees
        const employees = await db.query(
            `
            SELECT employee_name, designation, status
            FROM employees
            WHERE tenant_id=$1
            ORDER BY employee_id DESC
            LIMIT 5
            `,
            [tenantId]
        );

        // Recent Projects
        const projects = await db.query(
            `
            SELECT project_name, status
            FROM projects
            WHERE tenant_id=$1
            ORDER BY project_id DESC
            LIMIT 5
            `,
            [tenantId]
        );

        const projectProgress = await db.query(
`
SELECT
    p.project_id,
    p.project_name,

    COUNT(t.task_id) AS total_tasks,

    COUNT(*) FILTER (
        WHERE t.status='Completed'
    ) AS completed_tasks

FROM projects p

LEFT JOIN tasks t
ON p.project_id = t.project_id

WHERE p.tenant_id=$1

GROUP BY
p.project_id,
p.project_name

ORDER BY p.project_id DESC;
`,
[tenantId]
);

        // Recent Tasks
        const tasks = await db.query(
            `
            SELECT task_name, priority, status
            FROM tasks
            WHERE tenant_id=$1
            ORDER BY task_id DESC
            LIMIT 5
            `,
            [tenantId]
        );

        

        res.json({
            success: true,

            dashboard: {
                employees: Number(employeeCount.rows[0].count),
                departments: Number(departmentCount.rows[0].count),
                projects: Number(projectCount.rows[0].count),
                tasks: Number(taskCount.rows[0].count),

                pendingTasks: Number(taskStatus.rows[0].pending),
                inProgressTasks: Number(taskStatus.rows[0].progress),
                completedTasks: Number(taskStatus.rows[0].completed)
            },

            employees: employees.rows,
            projects: projects.rows,
            tasks: tasks.rows,
            projectProgress: projectProgress.rows
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Dashboard Loading Failed"
        });

    }
};