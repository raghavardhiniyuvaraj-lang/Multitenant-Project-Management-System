const ExcelJS = require("exceljs");
const XLSX = require("xlsx");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const db = require("../config/db");

// ============================================================
// PDF CONSTANTS
// ============================================================

const PAGE_WIDTH = 595.28;   // A4
const PAGE_HEIGHT = 841.89;  // A4

const MARGIN_LEFT = 45;
const MARGIN_RIGHT = 45;
const MARGIN_TOP = 40;
const MARGIN_BOTTOM = 55;

const CONTENT_WIDTH =
    PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

// ============================================================
// SAFE TEXT
// ============================================================

function safeText(value) {
    if (value === null || value === undefined || value === "") {
        return "-";
    }

    return String(value);
}

// ============================================================
// CHECK PAGE SPACE
// ============================================================

function ensureSpace(doc, requiredHeight = 80) {

    if (
        doc.y + requiredHeight >
        PAGE_HEIGHT - MARGIN_BOTTOM
    ) {
        doc.addPage();

        doc.y = MARGIN_TOP;

        return true;
    }

    return false;
}

// ============================================================
// HEADER
// ============================================================

function drawHeader(doc, logoPath, company) {

    // ===============================
    // COMPANY LOGO
    // ===============================

    if (
        logoPath &&
        fs.existsSync(logoPath)
    ) {

        try {

            doc.image(
                logoPath,
                50,
                40,
                {
                    fit: [70, 70],
                    align: "center",
                    valign: "center"
                }
            );

            console.log(
                "PDF Logo Loaded Successfully:",
                logoPath
            );

        } catch (logoError) {

            console.log(
                "PDF Logo Loading Failed:",
                logoError.message
            );

        }

    } else {

        console.log(
            "PDF Logo skipped - file not found"
        );

    }

    // ===============================
    // COMPANY NAME
    // ===============================

    doc
        .fillColor("#0d6efd")
        .fontSize(26)
        .text(
            company?.company_name || "Company",
            140,
            45,
            {
                width: 390
            }
        );

    // ===============================
    // COMPANY DETAILS
    // ===============================

    doc
        .fillColor("gray")
        .fontSize(10);

    if (company?.company_email) {

        doc.text(
            company.company_email,
            140,
            82,
            {
                width: 390
            }
        );

    }

    if (company?.company_phone) {

        doc.text(
            company.company_phone,
            140,
            96,
            {
                width: 390
            }
        );

    }

    if (company?.company_address) {

        doc.text(
            company.company_address,
            140,
            110,
            {
                width: 390
            }
        );

    }

    // ===============================
    // REPORT TITLE
    // ===============================

    doc
        .fillColor("black")
        .fontSize(18)
        .text(
            "Company Performance Report",
            140,
            145,
            {
                width: 390
            }
        );

    // ===============================
    // HEADER LINE
    // ===============================

    doc
        .strokeColor("#0d6efd")
        .lineWidth(2)
        .moveTo(50, 180)
        .lineTo(545, 180)
        .stroke();

    doc.y = 200;
}
// ============================================================
// EXECUTIVE SUMMARY
// ============================================================

function drawExecutiveSummary(doc, stats) {

    ensureSpace(doc, 150);

    const completion =
        Number(stats.tasks) === 0
            ? 0
            : Math.round(
                (
                    Number(stats.completedTasks || 0) /
                    Number(stats.tasks)
                ) * 100
            );

    const summary =
        `This report provides an overview of the organization's operational performance within the Multi Tenant Project Management System.

The company currently manages ${stats.departments} departments, ${stats.employees} employees, ${stats.projects} projects and ${stats.tasks} project tasks.

The overall task completion rate is ${completion}%.

This report provides management with a consolidated view of organizational resources, project activities and task performance.`;

    const boxX = MARGIN_LEFT;
    const boxY = doc.y;

    const innerWidth = CONTENT_WIDTH - 30;

    const textHeight =
        doc
            .font("Helvetica")
            .fontSize(10.5)
            .heightOfString(
                summary,
                {
                    width: innerWidth,
                    lineGap: 2
                }
            );

    const boxHeight =
        textHeight + 48;

    doc
        .roundedRect(
            boxX,
            boxY,
            CONTENT_WIDTH,
            boxHeight,
            7
        )
        .fillAndStroke(
            "#F5F9FF",
            "#0d6efd"
        );

    doc
        .fillColor("#0d6efd")
        .font("Helvetica-Bold")
        .fontSize(13)
        .text(
            "Organization Overview",
            boxX + 15,
            boxY + 12,
            {
                width: innerWidth
            }
        );

    doc
        .fillColor("#222222")
        .font("Helvetica")
        .fontSize(10.5)
        .text(
            summary,
            boxX + 15,
            boxY + 35,
            {
                width: innerWidth,
                lineGap: 2,
                align: "left"
            }
        );

    doc.y =
        boxY +
        boxHeight +
        15;
}

// ============================================================
// COMPANY SUMMARY
// ============================================================

function drawSummary(doc, stats) {

    ensureSpace(doc, 120);

    doc
        .fillColor("#0d6efd")
        .font("Helvetica-Bold")
        .fontSize(15)
        .text(
            "Company Summary",
            MARGIN_LEFT,
            doc.y,
            {
                width: CONTENT_WIDTH
            }
        );

    doc.moveDown(0.7);

    const cards = [
        {
            title: "Employees",
            value: stats.employees
        },
        {
            title: "Departments",
            value: stats.departments
        },
        {
            title: "Projects",
            value: stats.projects
        },
        {
            title: "Tasks",
            value: stats.tasks
        }
    ];

    const gap = 10;

    const cardWidth =
        (CONTENT_WIDTH - gap * 3) / 4;

    const cardHeight = 65;

    const startX = MARGIN_LEFT;
    const startY = doc.y;

    cards.forEach((card, index) => {

        const x =
            startX +
            index *
            (cardWidth + gap);

        doc
            .roundedRect(
                x,
                startY,
                cardWidth,
                cardHeight,
                7
            )
            .fillAndStroke(
                "#F8FBFF",
                "#0d6efd"
            );

        doc
            .fillColor("#0d6efd")
            .font("Helvetica-Bold")
            .fontSize(9.5)
            .text(
                card.title,
                x,
                startY + 11,
                {
                    width: cardWidth,
                    align: "center"
                }
            );

        doc
            .fillColor("#111827")
            .font("Helvetica-Bold")
            .fontSize(20)
            .text(
                safeText(card.value),
                x,
                startY + 32,
                {
                    width: cardWidth,
                    align: "center"
                }
            );

    });

    doc.y =
        startY +
        cardHeight +
        18;
}

// ============================================================
// SECTION TITLE
// ============================================================

function sectionTitle(doc, title) {

    ensureSpace(doc, 55);

    doc
        .fillColor("#0d6efd")
        .font("Helvetica-Bold")
        .fontSize(15)
        .text(
            title,
            MARGIN_LEFT,
            doc.y,
            {
                width: CONTENT_WIDTH
            }
        );

    doc.moveDown(0.35);
}

// ============================================================
// TABLE HEADER
// ============================================================

function tableHeader(doc, columns, y) {

    let x = MARGIN_LEFT;

    columns.forEach((column) => {

        doc
            .rect(
                x,
                y,
                column.width,
                24
            )
            .fillAndStroke(
                "#0d6efd",
                "#0d6efd"
            );

        doc
            .fillColor("#ffffff")
            .font("Helvetica-Bold")
            .fontSize(9)
            .text(
                column.label,
                x + 3,
                y + 7,
                {
                    width: column.width - 6,
                    align: "center",
                    lineBreak: false
                }
            );

        x += column.width;

    });
}

// ============================================================
// TABLE ROW
// ============================================================

function tableRow(
    doc,
    row,
    columns,
    y,
    backgroundColor
) {

    let x = MARGIN_LEFT;

    row.forEach((cell, index) => {

        const width =
            columns[index].width;

        doc
            .rect(
                x,
                y,
                width,
                24
            )
            .fillAndStroke(
                backgroundColor,
                "#D6DCE5"
            );

        doc
            .fillColor("#111827")
            .font("Helvetica")
            .fontSize(8.5)
            .text(
                safeText(cell),
                x + 4,
                y + 7,
                {
                    width: width - 8,
                    height: 12,
                    align: "center",
                    lineBreak: false,
                    ellipsis: true
                }
            );

        x += width;

    });
}

// ============================================================
// DRAW TABLE WITH PAGE BREAKS
// ============================================================

function drawTable(
    doc,
    rows,
    columns
) {

    ensureSpace(
        doc,
        55
    );

    let y = doc.y;

    tableHeader(
        doc,
        columns,
        y
    );

    y += 24;

    rows.forEach((row, index) => {

        if (
            y + 24 >
            PAGE_HEIGHT - MARGIN_BOTTOM
        ) {

            doc.addPage();

            y = MARGIN_TOP;

            tableHeader(
                doc,
                columns,
                y
            );

            y += 24;

        }

        tableRow(
            doc,
            row,
            columns,
            y,
            index % 2 === 0
                ? "#FFFFFF"
                : "#F8FAFD"
        );

        y += 24;

    });

    doc.y =
        y + 15;
}

// ============================================================
// EXPORT EXCEL
// ============================================================

exports.exportExcel = async (req, res) => {

    try {

        const tenantId =
            req.user.tenantId;

        const employees =
            await db.query(
                `
                SELECT
                    employee_name,
                    email,
                    designation,
                    salary,
                    status
                FROM employees
                WHERE tenant_id=$1
                ORDER BY employee_name
                `,
                [tenantId]
            );

        const departments =
            await db.query(
                `
                SELECT
                    department_name,
                    description
                FROM departments
                WHERE tenant_id=$1
                ORDER BY department_name
                `,
                [tenantId]
            );

        const projects =
            await db.query(
                `
                SELECT
                    project_name,
                    start_date,
                    end_date,
                    status
                FROM projects
                WHERE tenant_id=$1
                ORDER BY project_name
                `,
                [tenantId]
            );

        const tasks =
            await db.query(
                `
                SELECT
                    task_name,
                    priority,
                    status,
                    due_date
                FROM tasks
                WHERE tenant_id=$1
                ORDER BY task_name
                `,
                [tenantId]
            );

        const workbook =
            new ExcelJS.Workbook();

        workbook.creator =
            "Multi Tenant Project Management System";

        workbook.created =
            new Date();

        // Employees
        const employeeSheet =
            workbook.addWorksheet(
                "Employees"
            );

        employeeSheet.columns = [
            {
                header: "Employee Name",
                key: "employee_name",
                width: 28
            },
            {
                header: "Email",
                key: "email",
                width: 35
            },
            {
                header: "Designation",
                key: "designation",
                width: 25
            },
            {
                header: "Salary",
                key: "salary",
                width: 15
            },
            {
                header: "Status",
                key: "status",
                width: 15
            }
        ];

        employeeSheet.getRow(1).font = {
            bold: true
        };

        employees.rows.forEach(
            emp =>
                employeeSheet.addRow(emp)
        );

        // Departments
        const departmentSheet =
            workbook.addWorksheet(
                "Departments"
            );

        departmentSheet.columns = [
            {
                header: "Department",
                key: "department_name",
                width: 28
            },
            {
                header: "Description",
                key: "description",
                width: 45
            }
        ];

        departmentSheet.getRow(1).font = {
            bold: true
        };

        departments.rows.forEach(
            dept =>
                departmentSheet.addRow(dept)
        );

        // Projects
        const projectSheet =
            workbook.addWorksheet(
                "Projects"
            );

        projectSheet.columns = [
            {
                header: "Project",
                key: "project_name",
                width: 30
            },
            {
                header: "Start Date",
                key: "start_date",
                width: 18
            },
            {
                header: "End Date",
                key: "end_date",
                width: 18
            },
            {
                header: "Status",
                key: "status",
                width: 18
            }
        ];

        projectSheet.getRow(1).font = {
            bold: true
        };

        projects.rows.forEach(
            project =>
                projectSheet.addRow(project)
        );

        // Tasks
        const taskSheet =
            workbook.addWorksheet(
                "Tasks"
            );

        taskSheet.columns = [
            {
                header: "Task",
                key: "task_name",
                width: 35
            },
            {
                header: "Priority",
                key: "priority",
                width: 18
            },
            {
                header: "Status",
                key: "status",
                width: 18
            },
            {
                header: "Due Date",
                key: "due_date",
                width: 18
            }
        ];

        taskSheet.getRow(1).font = {
            bold: true
        };

        tasks.rows.forEach(
            task =>
                taskSheet.addRow(task)
        );

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=Company_Report.xlsx"
        );

        await workbook.xlsx.write(res);

        res.end();

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Excel Export Failed"
        });

    }
};

// ============================================================
// UPLOAD EXCEL
// ============================================================

exports.uploadReport = async (
    req,
    res
) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message:
                    "Please upload an Excel file."
            });

        }

        const workbook =
            XLSX.readFile(
                req.file.path
            );

        const sheetName =
            workbook.SheetNames[0];

        const worksheet =
            workbook.Sheets[sheetName];

        const preview =
            XLSX.utils.sheet_to_json(
                worksheet,
                {
                    header: 1
                }
            );

        res.json({
            success: true,
            message:
                "Excel Uploaded Successfully",
            preview
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Upload Failed"
        });

    }
};

// ============================================================
// GENERATE PROFESSIONAL PDF
// ============================================================

exports.generatePDF = async (
    req,
    res
) => {

    try {

        const tenantId =
            req.user.tenantId;

        // ----------------------------------------------------
        // Create PDF
        // ----------------------------------------------------

        const doc =
            new PDFDocument({
                margin: 0,
                size: "A4",
                bufferPages: true
            });

        const fileName =
            "Company_Report_" +
            Date.now() +
            ".pdf";

        const reportsDir =
            path.join(
                __dirname,
                "../uploads/reports"
            );

        fs.mkdirSync(
            reportsDir,
            {
                recursive: true
            }
        );

        const filePath =
            path.join(
                reportsDir,
                fileName
            );

        const stream =
            fs.createWriteStream(
                filePath
            );

        doc.pipe(stream);

        // ----------------------------------------------------
        // DASHBOARD STATISTICS
        // ----------------------------------------------------

        const dashboard =
            await db.query(
                `
                SELECT

                (
                    SELECT COUNT(*)
                    FROM employees
                    WHERE tenant_id=$1
                ) AS employees,

                (
                    SELECT COUNT(*)
                    FROM departments
                    WHERE tenant_id=$1
                ) AS departments,

                (
                    SELECT COUNT(*)
                    FROM projects
                    WHERE tenant_id=$1
                ) AS projects,

                (
                    SELECT COUNT(*)
                    FROM tasks
                    WHERE tenant_id=$1
                ) AS tasks,

                (
                    SELECT COUNT(*)
                    FROM tasks
                    WHERE tenant_id=$1
                    AND status='Completed'
                ) AS "completedTasks"

                `,
                [tenantId]
            );

        const stats =
            dashboard.rows[0];

        // ----------------------------------------------------
        // TASK STATISTICS
        // ----------------------------------------------------

        const taskStats =
            await db.query(
                `
                SELECT

                COUNT(*) FILTER
                (
                    WHERE status='Pending'
                ) AS pending,

                COUNT(*) FILTER
                (
                    WHERE status='In Progress'
                ) AS progress,

                COUNT(*) FILTER
                (
                    WHERE status='Completed'
                ) AS completed

                FROM tasks

                WHERE tenant_id=$1
                `,
                [tenantId]
            );

        // ----------------------------------------------------
// COMPANY SETTINGS + COMPANY LOGO
// ----------------------------------------------------

const settingsResult = await db.query(
    `
    SELECT
        company_name,
        company_email,
        company_phone,
        company_address,
        company_logo
    FROM company_settings
    WHERE tenant_id = $1
    LIMIT 1
    `,
    [tenantId]
);

const company = settingsResult.rows[0] || {};


// ----------------------------------------------------
// COMPANY NAME
// ----------------------------------------------------

const companyName =
    company.company_name ||
    `Company ${tenantId}`;

company.company_name = companyName;


// ----------------------------------------------------
// COMPANY LOGO
// ----------------------------------------------------

let logoPath = null;

if (company.company_logo) {

    let logoValue =
        String(company.company_logo).trim();

    console.log(
        "Database Logo Value:",
        logoValue
    );

    // ---------------------------------------------
    // Case 1:
    // uploads/company/filename.png
    // ---------------------------------------------

    if (
        logoValue.startsWith("uploads/company/")
    ) {

        logoValue =
            logoValue.replace(
                /^uploads\/company\//,
                ""
            );

    }

    // ---------------------------------------------
    // Case 2:
    // /uploads/company/filename.png
    // ---------------------------------------------

    logoValue =
        logoValue.replace(
            /^\/uploads\/company\//,
            ""
        );

    // ---------------------------------------------
    // Case 3:
    // http://localhost:5000/uploads/company/...
    // ---------------------------------------------

    if (
        logoValue.startsWith("http://") ||
        logoValue.startsWith("https://")
    ) {

        try {

            const url =
                new URL(logoValue);

            logoValue =
                url.pathname.replace(
                    /^\/uploads\/company\//,
                    ""
                );

        } catch (urlError) {

            console.log(
                "Invalid logo URL:",
                logoValue
            );

        }

    }


    // ---------------------------------------------
    // Build physical file path
    // ---------------------------------------------

    const companyUploadsDir =
        path.join(
            __dirname,
            "../uploads/company"
        );

    const possibleLogoPath =
        path.join(
            companyUploadsDir,
            logoValue
        );


    console.log(
        "Checking Company Logo:",
        possibleLogoPath
    );


    // ---------------------------------------------
    // Check whether logo exists
    // ---------------------------------------------

    if (
        fs.existsSync(
            possibleLogoPath
        )
    ) {

        logoPath =
            possibleLogoPath;

        console.log(
            "Company Logo Found:",
            logoPath
        );

    } else {

        console.log(
            "Company Logo NOT Found:",
            possibleLogoPath
        );

    }

} else {

    console.log(
        "No company logo configured for tenant:",
        tenantId
    );

}


// ----------------------------------------------------
// HEADER
// ----------------------------------------------------

drawHeader(
    doc,
    logoPath,
    company
);
        // ----------------------------------------------------
        // EXECUTIVE SUMMARY
        // ----------------------------------------------------

        drawExecutiveSummary(
            doc,
            stats
        );

        // ----------------------------------------------------
        // COMPANY SUMMARY
        // ----------------------------------------------------

        drawSummary(
            doc,
            stats
        );

        // ----------------------------------------------------
        // TASK STATUS
        // ----------------------------------------------------

        sectionTitle(
            doc,
            "Task Status Summary"
        );

        const pending =
            Number(
                taskStats.rows[0].pending || 0
            );

        const progress =
            Number(
                taskStats.rows[0].progress || 0
            );

        const completed =
            Number(
                taskStats.rows[0].completed || 0
            );

        const totalTasks =
            pending +
            progress +
            completed;

        const completionPercentage =
            totalTasks === 0
                ? 0
                : Math.round(
                    (
                        completed /
                        totalTasks
                    ) * 100
                );

        ensureSpace(
            doc,
            115
        );

        // Task counts

        doc
            .fillColor("#d97706")
            .font("Helvetica")
            .fontSize(10.5)
            .text(
                `Pending Tasks: ${pending}`,
                MARGIN_LEFT,
                doc.y,
                {
                    width: CONTENT_WIDTH
                }
            );

        doc.moveDown(0.25);

        doc
            .fillColor("#2563eb")
            .text(
                `In Progress Tasks: ${progress}`,
                MARGIN_LEFT,
                doc.y,
                {
                    width: CONTENT_WIDTH
                }
            );

        doc.moveDown(0.25);

        doc
            .fillColor("#16a34a")
            .text(
                `Completed Tasks: ${completed}`,
                MARGIN_LEFT,
                doc.y,
                {
                    width: CONTENT_WIDTH
                }
            );

        doc.moveDown(0.4);

        doc
            .fillColor("#0d6efd")
            .font("Helvetica-Bold")
            .text(
                `Overall Completion: ${completionPercentage}%`,
                MARGIN_LEFT,
                doc.y,
                {
                    width: CONTENT_WIDTH,
                    lineBreak: false
                }
            );

        doc.moveDown(0.5);

        // Progress bar

        const progressY =
            doc.y;

        const progressWidth =
            400;

        const progressHeight =
            14;

        doc
            .roundedRect(
                MARGIN_LEFT,
                progressY,
                progressWidth,
                progressHeight,
                7
            )
            .fill("#E5E7EB");

        if (
            completionPercentage > 0
        ) {

            doc
                .roundedRect(
                    MARGIN_LEFT,
                    progressY,
                    (
                        progressWidth *
                        completionPercentage
                    ) / 100,
                    progressHeight,
                    7
                )
                .fill("#22C55E");

        }

        doc
            .fillColor("#111827")
            .font("Helvetica")
            .fontSize(9)
            .text(
                `${completionPercentage}%`,
                MARGIN_LEFT +
                progressWidth +
                12,
                progressY + 2,
                {
                    width: 50,
                    lineBreak: false
                }
            );

        doc.y =
            progressY +
            progressHeight +
            15;

        // ----------------------------------------------------
        // REPORT INFORMATION
        // ----------------------------------------------------

        sectionTitle(
            doc,
            "Report Information"
        );

        ensureSpace(
            doc,
            75
        );

        const reportId =
            "RPT-" +
            Date.now()
                .toString()
                .slice(-6);

        doc
            .fillColor("#444444")
            .font("Helvetica")
            .fontSize(9.5)
            .text(
                `Report ID: ${reportId}`,
                MARGIN_LEFT,
                doc.y,
                {
                    width: CONTENT_WIDTH
                }
            );

        doc.moveDown(0.25);

        doc.text(
            `Generated By: ${companyName}`,
            MARGIN_LEFT,
            doc.y,
            {
                width: CONTENT_WIDTH
            }
        );

        doc.moveDown(0.25);

        doc.text(
            `Generated On: ${new Date().toLocaleString()}`,
            MARGIN_LEFT,
            doc.y,
            {
                width: CONTENT_WIDTH
            }
        );

        doc.moveDown(1);

        // ====================================================
        // EMPLOYEE ANALYSIS
        // ====================================================

        sectionTitle(
            doc,
            "Employee Analysis"
        );

        const employeeDescription =
            `The organization currently has ${stats.employees} employees distributed across ${stats.departments} departments.

The workforce supports ongoing business operations, project execution and resource management.

Employee participation contributes to productivity, timely completion of assigned tasks and achievement of project objectives.`;

        ensureSpace(
            doc,
            125
        );

        doc
            .fillColor("#222222")
            .font("Helvetica")
            .fontSize(10)
            .text(
                employeeDescription,
                MARGIN_LEFT,
                doc.y,
                {
                    width: CONTENT_WIDTH,
                    align: "justify",
                    lineGap: 2
                }
            );

        doc.moveDown(0.8);

        // ----------------------------------------------------
        // EMPLOYEE DETAILS
        // ----------------------------------------------------

        const employees =
            await db.query(
                `
                SELECT
                    employee_name,
                    designation,
                    status
                FROM employees
                WHERE tenant_id=$1
                ORDER BY employee_name
                `,
                [tenantId]
            );

        sectionTitle(
            doc,
            "Employee Details"
        );

        drawTable(
            doc,
            employees.rows.map(
                employee => [
                    employee.employee_name,
                    employee.designation,
                    employee.status
                ]
            ),
            [
                {
                    label: "Employee Name",
                    width: 220
                },
                {
                    label: "Designation",
                    width: 170
                },
                {
                    label: "Status",
                    width: 115
                }
            ]
        );

        // ====================================================
        // PROJECT ANALYSIS
        // ====================================================

        sectionTitle(
            doc,
            "Project Analysis"
        );

        const projectDescription =
            `The organization is currently managing ${stats.projects} projects across different functional areas.

Project activities are planned, monitored and executed through the Multi Tenant Project Management System.

Continuous project monitoring helps management track progress, allocate resources and achieve scheduled milestones efficiently.`;

        ensureSpace(
            doc,
            125
        );

        doc
            .fillColor("#222222")
            .font("Helvetica")
            .fontSize(10)
            .text(
                projectDescription,
                MARGIN_LEFT,
                doc.y,
                {
                    width: CONTENT_WIDTH,
                    align: "justify",
                    lineGap: 2
                }
            );

        doc.moveDown(0.8);

        // ----------------------------------------------------
        // PROJECT DETAILS
        // ----------------------------------------------------

        const projects =
            await db.query(
                `
                SELECT
                    project_name,
                    status
                FROM projects
                WHERE tenant_id=$1
                ORDER BY project_name
                `,
                [tenantId]
            );

        sectionTitle(
            doc,
            "Project Details"
        );

        drawTable(
            doc,
            projects.rows.map(
                project => [
                    project.project_name,
                    project.status
                ]
            ),
            [
                {
                    label: "Project Name",
                    width: 330
                },
                {
                    label: "Status",
                    width: 175
                }
            ]
        );

        // ====================================================
        // TASK ANALYSIS
        // ====================================================

        sectionTitle(
            doc,
            "Task Analysis"
        );

        const taskDescription =
            `The organization currently manages ${stats.tasks} project tasks assigned to employees across different projects.

Task execution is monitored based on priority levels and completion status.

The task management process improves accountability, project coordination and timely completion of organizational objectives.`;

        ensureSpace(
            doc,
            125
        );

        doc
            .fillColor("#222222")
            .font("Helvetica")
            .fontSize(10)
            .text(
                taskDescription,
                MARGIN_LEFT,
                doc.y,
                {
                    width: CONTENT_WIDTH,
                    align: "justify",
                    lineGap: 2
                }
            );

        doc.moveDown(0.8);

        // ----------------------------------------------------
        // TASK DETAILS
        // ----------------------------------------------------

        const tasks =
            await db.query(
                `
                SELECT
                    task_name,
                    priority,
                    status
                FROM tasks
                WHERE tenant_id=$1
                ORDER BY task_name
                `,
                [tenantId]
            );

        sectionTitle(
            doc,
            "Task Details"
        );

        drawTable(
            doc,
            tasks.rows.map(
                task => [
                    task.task_name,
                    task.priority,
                    task.status
                ]
            ),
            [
                {
                    label: "Task Name",
                    width: 250
                },
                {
                    label: "Priority",
                    width: 120
                },
                {
                    label: "Status",
                    width: 135
                }
            ]
        );

        // ====================================================
        // FINAL SUMMARY
        // ====================================================

        ensureSpace(
            doc,
            150
        );

        sectionTitle(
            doc,
            "Final Summary"
        );

        const finalSummary =
            `The current organizational overview includes ${stats.employees} employees, ${stats.departments} departments, ${stats.projects} projects and ${stats.tasks} tasks.

The available project and task information provides management with a centralized view of operational activities.

The system supports efficient employee management, project coordination and task monitoring within the organization.

Regular review of these metrics can help management identify progress, resource requirements and areas requiring attention.`;

        doc
            .fillColor("#222222")
            .font("Helvetica")
            .fontSize(10)
            .text(
                finalSummary,
                MARGIN_LEFT,
                doc.y,
                {
                    width: CONTENT_WIDTH,
                    align: "justify",
                    lineGap: 2
                }
            );

        // ====================================================
        // SIGNATURE AREA
        // ====================================================

        ensureSpace(
            doc,
            100
        );

        doc.moveDown(1.2);

        const signatureY =
            doc.y;

        // Prepared By
        doc
            .strokeColor("#333333")
            .lineWidth(1)
            .moveTo(
                65,
                signatureY
            )
            .lineTo(
                185,
                signatureY
            )
            .stroke();

        doc
            .fillColor("#555555")
            .font("Helvetica")
            .fontSize(9)
            .text(
                "Prepared By",
                85,
                signatureY + 7,
                {
                    width: 80,
                    align: "center"
                }
            );

        // Approved By
        doc
            .moveTo(
                370,
                signatureY
            )
            .lineTo(
                490,
                signatureY
            )
            .stroke();

        doc
            .text(
                "Approved By",
                390,
                signatureY + 7,
                {
                    width: 80,
                    align: "center"
                }
            );

        // ====================================================
        // FOOTER
        // ====================================================

        const footerY =
            PAGE_HEIGHT -
            38;

        doc
            .font("Helvetica")
            .fontSize(8)
            .fillColor("#777777")
            .text(
                "Multi Tenant Project Management System",
                MARGIN_LEFT,
                footerY,
                {
                    width: CONTENT_WIDTH,
                    align: "center",
                    lineBreak: false
                }
            );

        // ====================================================
        // PAGE NUMBERS
        // ====================================================

        const pages =
            doc.bufferedPageRange();

        for (
            let i = 0;
            i < pages.count;
            i++
        ) {

            doc.switchToPage(i);

            doc
                .font("Helvetica")
                .fontSize(8)
                .fillColor("#777777")
                .text(
                    `Page ${i + 1} of ${pages.count}`,
                    MARGIN_LEFT,
                    PAGE_HEIGHT - 23,
                    {
                        width: CONTENT_WIDTH,
                        align: "center",
                        lineBreak: false
                    }
                );

        }

        // ====================================================
        // FINISH PDF
        // ====================================================

        doc.end();

        stream.on(
            "finish",
            async () => {

                try {

                    await db.query(
                        `
                        INSERT INTO reports
                        (
                            tenant_id,
                            file_name,
                            report_type
                        )
                        VALUES
                        (
                            $1,
                            $2,
                            $3
                        )
                        `,
                        [
                            tenantId,
                            fileName,
                            "PDF"
                        ]
                    );

                    res.json({
                        success: true,
                        message:
                            "Professional PDF Generated Successfully",
                        file:
                            "uploads/reports/" +
                            fileName
                    });

                } catch (err) {

                    console.log(err);

                    res.status(500).json({
                        success: false,
                        message:
                            "PDF saved but Report History insert failed"
                    });

                }

            }
        );

    } catch (err) {

        console.log(
            "PDF GENERATION ERROR:",
            err
        );

        if (!res.headersSent) {

            res.status(500).json({
                success: false,
                message:
                    "PDF Generation Failed"
            });

        }

    }
};

// ============================================================
// GET REPORT HISTORY
// ============================================================

exports.getReportHistory = async (
    req,
    res
) => {

    try {

        const result =
            await db.query(
                `
                SELECT
                    report_id,
                    file_name,
                    report_type,
                    created_at
                FROM reports
                WHERE tenant_id=$1
                ORDER BY created_at DESC
                `,
                [req.user.tenantId]
            );

        res.json({
            success: true,
            reports: result.rows
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch report history"
        });

    }
};

// ============================================================
// DOWNLOAD REPORT
// ============================================================

exports.downloadReport = async (
    req,
    res
) => {

    try {

        const {
            fileName
        } = req.params;

        const filePath =
            path.join(
                __dirname,
                "../uploads/reports",
                fileName
            );

        if (
            !fs.existsSync(
                filePath
            )
        ) {

            return res.status(404).json({
                success: false,
                message:
                    "File not found"
            });

        }

        res.download(
            filePath,
            fileName
        );

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message:
                "Download failed"
        });

    }
};

// ============================================================
// DELETE REPORT
// ============================================================

exports.deleteReport = async (
    req,
    res
) => {

    try {

        const {
            reportId
        } = req.params;

        // IMPORTANT:
        // Check tenant also, so one tenant cannot
        // delete another tenant's report.

        const result =
            await db.query(
                `
                SELECT
                    report_id,
                    file_name
                FROM reports
                WHERE report_id=$1
                AND tenant_id=$2
                `,
                [
                    reportId,
                    req.user.tenantId
                ]
            );

        if (
            result.rows.length === 0
        ) {

            return res.status(404).json({
                success: false,
                message:
                    "Report not found"
            });

        }

        const report =
            result.rows[0];

        const filePath =
            path.join(
                __dirname,
                "../uploads/reports",
                report.file_name
            );

        if (
            fs.existsSync(
                filePath
            )
        ) {

            fs.unlinkSync(
                filePath
            );

        }

        await db.query(
            `
            DELETE FROM reports
            WHERE report_id=$1
            AND tenant_id=$2
            `,
            [
                reportId,
                req.user.tenantId
            ]
        );

        res.json({
            success: true,
            message:
                "Report deleted successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message:
                "Delete failed"
        });

    }
};
