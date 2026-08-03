const ExcelJS = require("exceljs");
const XLSX = require("xlsx");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const db = require("../config/db");

// ===================================================
// HEADER
// ===================================================

function drawHeader(doc, logoPath, company) {

    if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 40, {
            width: 60
        });
    }

    doc
        .fillColor("#0d6efd")
        .fontSize(26)
        .text(
            company?.company_name || "Company",
            130,
            45
        );

    doc
        .fillColor("gray")
        .fontSize(11)
        .text(company?.company_email || "",130,82);

    doc.text(company?.company_phone || "",130,96);

    doc.text(company?.company_address || "",130,110);

    doc
        .fillColor("black")
        .fontSize(18)
        .text(
            "Company Performance Report",
            130,
            145
        );

    doc
        .strokeColor("#0d6efd")
        .lineWidth(2)
        .moveTo(50,180)
        .lineTo(545,180)
        .stroke();

    doc.y = 200;

}

// ===================================================
// EXECUTIVE SUMMARY
// ===================================================

function drawExecutiveSummary(doc, stats){

    const startY = doc.y;

    const completion =
        stats.tasks == 0
            ? 0
            : Math.round(
                ((stats.completedTasks || 0) /
                    stats.tasks) * 100
            );

    const summary =

`This report presents a comprehensive overview of the organization's operational performance within the Multi Tenant Project Management System.

The company currently manages ${stats.departments} departments, ${stats.employees} employees, ${stats.projects} active projects and ${stats.tasks} project tasks.

The overall task completion rate is ${completion}%, reflecting the current progress of project execution.

The purpose of this report is to provide management with an accurate summary of organizational resources, project status, workforce distribution and task performance for effective decision making.`;

    const textHeight =
        doc.heightOfString(summary,{
            width:460,
            align:"justify",
            lineGap:3
        });

    const boxHeight =
        textHeight + 55;

    doc
        .roundedRect(
            50,
            startY,
            495,
            boxHeight,
            8
        )
        .fillAndStroke(
            "#F5F9FF",
            "#0d6efd"
        );

    doc
        .fillColor("#0d6efd")
        .fontSize(15)
        .text(
            "Organization Overview",
            65,
            startY + 15
        );

    doc
        .fillColor("black")
        .fontSize(11)
        .text(
            summary,
            65,
            startY + 40,
            {
                width:460,
                align:"justify",
                lineGap:3
            }
        );

    doc.y =
        startY +
        boxHeight +
        15;

}

// ===================================================
// COMPANY SUMMARY
// ===================================================

function drawSummary(doc,stats){

    doc
        .fillColor("#0d6efd")
        .fontSize(16)
        .text("Company Summary");

    doc.moveDown(0.8);

    const cards=[

        {
            title:"Employees",
            value:stats.employees
        },

        {
            title:"Departments",
            value:stats.departments
        },

        {
            title:"Projects",
            value:stats.projects
        },

        {
            title:"Tasks",
            value:stats.tasks
        }

    ];

    const startX=50;
    const startY=doc.y;

    cards.forEach((card,index)=>{

        const x =
            startX +
            (index * 120);

        doc
            .roundedRect(
                x,
                startY,
                105,
                70,
                8
            )
            .fillAndStroke(
                "#F8FBFF",
                "#0d6efd"
            );

        doc
            .fillColor("#0d6efd")
            .fontSize(11)
            .text(
                card.title,
                x,
                startY+12,
                {
                    width:105,
                    align:"center"
                }
            );

        doc
            .fillColor("black")
            .fontSize(22)
            .text(
                String(card.value),
                x,
                startY+35,
                {
                    width:105,
                    align:"center"
                }
            );

    });

    doc.y =
        startY +
        85;

}

// ===================================================
// SECTION TITLE
// ===================================================

function sectionTitle(doc,title){

    doc.moveDown(0.5);

    doc
        .fillColor("#0d6efd")
        .fontSize(16)
        .text(title);

    doc.moveDown(0.4);

}

// ===================================================
// TABLE HEADER
// ===================================================

function tableHeader(doc,columns,y){

    let x = 50;

    columns.forEach(col=>{

        doc
            .rect(
                x,
                y,
                col.width,
                25
            )
            .fillAndStroke(
                "#0d6efd",
                "#0d6efd"
            );

        doc
            .fillColor("white")
            .fontSize(10)
            .text(
                col.label,
                x,
                y+7,
                {
                    width:col.width,
                    align:"center"
                }
            );

        x += col.width;

    });

}

// ===================================================
// TABLE ROW
// ===================================================

function tableRow(doc,row,columns,y,color){

    let x = 50;

    row.forEach((cell,index)=>{

        doc
            .rect(
                x,
                y,
                columns[index].width,
                24
            )
            .fillAndStroke(
                color,
                "#D6DCE5"
            );

        doc
            .fillColor("black")
            .fontSize(10)
            .text(
                String(cell),
                x,
                y+6,
                {
                    width:columns[index].width,
                    align:"center"
                }
            );

        x += columns[index].width;

    });

}
// =======================================
// EXPORT EXCEL
// =======================================

exports.exportExcel = async (req, res) => {

    try {

        const tenantId = req.user.tenantId;

        const employees = await db.query(
            `SELECT employee_name,email,designation,salary,status
             FROM employees
             WHERE tenant_id=$1
             ORDER BY employee_name`,
            [tenantId]
        );

        const departments = await db.query(
            `SELECT department_name,description
             FROM departments
             WHERE tenant_id=$1
             ORDER BY department_name`,
            [tenantId]
        );

        const projects = await db.query(
            `SELECT project_name,start_date,end_date,status
             FROM projects
             WHERE tenant_id=$1
             ORDER BY project_name`,
            [tenantId]
        );

        const tasks = await db.query(
            `SELECT task_name,priority,status,due_date
             FROM tasks
             WHERE tenant_id=$1
             ORDER BY task_name`,
            [tenantId]
        );

        const workbook = new ExcelJS.Workbook();

        workbook.creator = "Multi Tenant Project Management System";
        workbook.created = new Date();

        // ================= EMPLOYEES =================

        const employeeSheet = workbook.addWorksheet("Employees");

        employeeSheet.columns = [

            { header:"Employee Name", key:"employee_name", width:28 },

            { header:"Email", key:"email", width:35 },

            { header:"Designation", key:"designation", width:25 },

            { header:"Salary", key:"salary", width:15 },

            { header:"Status", key:"status", width:15 }

        ];

        employeeSheet.getRow(1).font = {
            bold:true
        };

        employees.rows.forEach(emp=>employeeSheet.addRow(emp));

        // ================= DEPARTMENTS =================

        const departmentSheet = workbook.addWorksheet("Departments");

        departmentSheet.columns = [

            { header:"Department", key:"department_name", width:28 },

            { header:"Description", key:"description", width:45 }

        ];

        departmentSheet.getRow(1).font = {
            bold:true
        };

        departments.rows.forEach(dept=>departmentSheet.addRow(dept));

        // ================= PROJECTS =================

        const projectSheet = workbook.addWorksheet("Projects");

        projectSheet.columns = [

            { header:"Project", key:"project_name", width:30 },

            { header:"Start Date", key:"start_date", width:18 },

            { header:"End Date", key:"end_date", width:18 },

            { header:"Status", key:"status", width:18 }

        ];

        projectSheet.getRow(1).font = {
            bold:true
        };

        projects.rows.forEach(project=>projectSheet.addRow(project));

        // ================= TASKS =================

        const taskSheet = workbook.addWorksheet("Tasks");

        taskSheet.columns = [

            { header:"Task", key:"task_name", width:35 },

            { header:"Priority", key:"priority", width:18 },

            { header:"Status", key:"status", width:18 },

            { header:"Due Date", key:"due_date", width:18 }

        ];

        taskSheet.getRow(1).font = {
            bold:true
        };

        tasks.rows.forEach(task=>taskSheet.addRow(task));

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

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            success:false,

            message:"Excel Export Failed"

        });

    }

};

// =======================================
// UPLOAD EXCEL
// =======================================

exports.uploadReport = async (req,res)=>{

    try{

        if(!req.file){

            return res.status(400).json({

                success:false,

                message:"Please upload an Excel file."

            });

        }

        const workbook = XLSX.readFile(req.file.path);

        const sheetName = workbook.SheetNames[0];

        const worksheet = workbook.Sheets[sheetName];

        const preview = XLSX.utils.sheet_to_json(

            worksheet,

            {

                header:1

            }

        );

        res.json({

            success:true,

            message:"Excel Uploaded Successfully",

            preview

        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            success:false,

            message:"Upload Failed"

        });

    }

};
exports.generatePDF = async (req, res) => {

    try {

        const doc = new PDFDocument({
            margin: 50,
            size: "A4",
            bufferPages: true
        });

        const fileName =
            "Company_Report_" + Date.now() + ".pdf";

        const reportsDir = path.join(
            __dirname,
            "../uploads/reports"
        );

        fs.mkdirSync(reportsDir,{
            recursive:true
        });

        const filePath = path.join(
            reportsDir,
            fileName
        );

        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        // ======================================
        // DASHBOARD STATISTICS
        // ======================================

        const dashboard = await db.query(
        `
        SELECT

        (SELECT COUNT(*) FROM employees WHERE tenant_id=$1) employees,

        (SELECT COUNT(*) FROM departments WHERE tenant_id=$1) departments,

        (SELECT COUNT(*) FROM projects WHERE tenant_id=$1) projects,

        (SELECT COUNT(*) FROM tasks WHERE tenant_id=$1) tasks,

        (SELECT COUNT(*) FROM tasks
            WHERE tenant_id=$1
            AND status='Completed') completedTasks
        `,
        [req.user.tenantId]
        );

        const stats = dashboard.rows[0];

        // ======================================
        // TASK STATISTICS
        // ======================================

        const taskStats = await db.query(
        `
        SELECT

        COUNT(*) FILTER
        (WHERE status='Pending') pending,

        COUNT(*) FILTER
        (WHERE status='In Progress') progress,

        COUNT(*) FILTER
        (WHERE status='Completed') completed

        FROM tasks

        WHERE tenant_id=$1
        `,
        [req.user.tenantId]
        );

        // ======================================
        // COMPANY SETTINGS
        // ======================================

        const settingsResult = await db.query(
        `
        SELECT *

        FROM company_settings

        WHERE tenant_id=$1

        LIMIT 1
        `,
        [req.user.tenantId]
        );

        const company =
            settingsResult.rows[0] || {};

        let logoPath = path.join(
            __dirname,
            "../uploads/company/company-logo.png"
        );

        if(

            company.company_logo &&

            fs.existsSync(

                path.join(

                    __dirname,

                    "../uploads/company",

                    company.company_logo

                )

            )

        ){

            logoPath = path.join(

                __dirname,

                "../uploads/company",

                company.company_logo

            );

        }

        // ======================================
        // HEADER
        // ======================================

        drawHeader(
            doc,
            logoPath,
            company
        );

        // ======================================
        // EXECUTIVE SUMMARY
        // ======================================

        drawExecutiveSummary(doc,stats);

        // ======================================
        // COMPANY SUMMARY
        // ======================================

        drawSummary(doc,stats);

        // ======================================
        // TASK STATUS
        // ======================================

        sectionTitle(doc,"Task Status Summary");

        const pending =
        Number(taskStats.rows[0].pending);

        const progress =
        Number(taskStats.rows[0].progress);

        const completed =
        Number(taskStats.rows[0].completed);

        doc
        .fillColor("#d97706")
        .fontSize(12)
        .text(`Pending Tasks : ${pending}`);

        doc
        .fillColor("#2563eb")
        .text(`In Progress Tasks : ${progress}`);

        doc
        .fillColor("#16a34a")
        .text(`Completed Tasks : ${completed}`);

        doc.moveDown(0.5);

        const total =
            pending +
            progress +
            completed;

        const percentage =
            total===0
            ?0
            :Math.round(
                (completed/total)*100
            );

        doc
        .fillColor("#0d6efd")
        .fontSize(12)
        .text(
            `Overall Completion : ${percentage}%`
        );

        doc.moveDown(0.5);

        const progressY = doc.y;

        doc

        .roundedRect(
            50,
            progressY,
            420,
            18,
            8
        )

        .fill("#E5E7EB");

        doc

        .roundedRect(

            50,

            progressY,

            (420*percentage)/100,

            18,

            8

        )

        .fill("#22C55E");

        doc

        .fillColor("black")

        .fontSize(10)

        .text(

            `${percentage}% Completed`,

            480,

            progressY+4

        );

        doc.y =
            progressY+28;

        // ======================================
        // REPORT INFO
        // ======================================

        const reportId =
            "RPT-" +
            Date.now()
            .toString()
            .slice(-6);

        doc

        .fillColor("gray")

        .fontSize(10)

        .text(`Report ID : ${reportId}`);

        doc.text(
            `Generated By : ${
                company.company_name ||
                "Administrator"
            }`
        );

        doc.text(
            "Generated On : " +
            new Date().toLocaleString()
        );

        doc.moveDown(1.2);

        // ===== EMPLOYEE ANALYSIS STARTS HERE ====
// ======================================
// EMPLOYEE ANALYSIS
// ======================================

sectionTitle(doc,"Employee Analysis");

doc
.fontSize(11)
.fillColor("black")
.text(

`The organization currently has a workforce of ${stats.employees} employees distributed across ${stats.departments} departments.

The workforce is effectively organized to support ongoing business operations, project execution and resource management.

Employee participation plays a vital role in maintaining productivity, ensuring timely completion of assigned tasks and improving overall organizational performance.

The current workforce distribution indicates that human resources are efficiently utilized to achieve project objectives and business goals.`,

{
    width:495,
    align:"justify",
    lineGap:3
}

);

doc.moveDown();

// ======================================
// EMPLOYEE DETAILS
// ======================================

const employees = await db.query(

`
SELECT
employee_name,
designation,
status
FROM employees
WHERE tenant_id=$1
ORDER BY employee_name
`,
[req.user.tenantId]

);

// Page break only if required

if(doc.y > 620){

    doc.addPage();

}

doc

.fontSize(18)

.fillColor("#0d6efd")

.text("Employee Details");

doc.moveDown(0.6);

const empColumns=[

{
label:"Employee Name",
width:220
},

{
label:"Designation",
width:170
},

{
label:"Status",
width:105
}

];

let y = doc.y;

tableHeader(
doc,
empColumns,
y
);

y += 25;

employees.rows.forEach((emp,index)=>{

    // Automatic page break

    if(y > 720){

        doc.addPage();

        y = 50;

        tableHeader(
            doc,
            empColumns,
            y
        );

        y += 25;

    }

    tableRow(

        doc,

        [

            emp.employee_name || "-",

            emp.designation || "-",

            emp.status || "-"

        ],

        empColumns,

        y,

        index % 2 === 0
        ? "#FFFFFF"
        : "#F8FAFD"

    );

    y += 24;

});

doc.y = y + 20;
// ======================================
// PROJECT ANALYSIS
// ======================================

sectionTitle(doc,"Project Analysis");

doc
.fontSize(11)
.fillColor("black")
.text(

`The organization is currently managing ${stats.projects} active projects across multiple functional areas.

Each project is planned, monitored and executed through the Multi Tenant Project Management System, ensuring effective coordination between departments and employees.

Project activities are continuously tracked to monitor progress, allocate resources efficiently and achieve scheduled milestones within the expected timeline.

The centralized project monitoring process enables better decision making, improved collaboration and higher operational efficiency across the organization.`,

{
    width:495,
    align:"justify",
    lineGap:3
}

);

doc.moveDown();

// ======================================
// PROJECT DETAILS
// ======================================

const projects = await db.query(
`
SELECT
project_name,
status
FROM projects
WHERE tenant_id=$1
ORDER BY project_name
`,
[req.user.tenantId]
);

// Page Break only if needed

if(doc.y > 620){

    doc.addPage();

}

doc
.fontSize(18)
.fillColor("#0d6efd")
.text("Project Details");

doc.moveDown(0.6);

const projectColumns=[

{
label:"Project Name",
width:330
},

{
label:"Status",
width:165
}

];

let projectY = doc.y;

tableHeader(
doc,
projectColumns,
projectY
);

projectY += 25;

projects.rows.forEach((project,index)=>{

    if(projectY > 720){

        doc.addPage();

        projectY = 50;

        tableHeader(
            doc,
            projectColumns,
            projectY
        );

        projectY += 25;

    }

    tableRow(

        doc,

        [

            project.project_name || "-",

            project.status || "-"

        ],

        projectColumns,

        projectY,

        index % 2 === 0
        ? "#FFFFFF"
        : "#F8FAFD"

    );

    projectY += 24;

});

doc.y = projectY + 20;
// ======================================
// TASK ANALYSIS
// ======================================

sectionTitle(doc,"Task Analysis");

doc
.fontSize(11)
.fillColor("black")
.text(

`The organization currently manages ${stats.tasks} project tasks assigned to employees across different projects.

Task execution is continuously monitored based on priority levels and completion status, allowing management to identify pending activities and track ongoing work efficiently.

The task management process ensures better accountability, improved project coordination and timely completion of organizational objectives.

Regular monitoring of task progress enables effective resource utilization and supports informed decision making throughout the project lifecycle.`,

{
    width:495,
    align:"justify",
    lineGap:3
}

);

doc.moveDown();

// ======================================
// TASK DETAILS
// ======================================

const tasks = await db.query(
`
SELECT
task_name,
priority,
status
FROM tasks
WHERE tenant_id=$1
ORDER BY task_name
`,
[req.user.tenantId]
);

if(doc.y > 620){

    doc.addPage();

}

doc
.fontSize(18)
.fillColor("#0d6efd")
.text("Task Details");

doc.moveDown(0.6);

const taskColumns=[

{
label:"Task Name",
width:250
},

{
label:"Priority",
width:120
},

{
label:"Status",
width:125
}

];

let taskY = doc.y;

tableHeader(
doc,
taskColumns,
taskY
);

taskY += 25;

tasks.rows.forEach((task,index)=>{

    if(taskY > 720){

        doc.addPage();

        taskY = 50;

        tableHeader(
            doc,
            taskColumns,
            taskY
        );

        taskY += 25;

    }

    tableRow(

        doc,

        [

            task.task_name || "-",

            task.priority || "-",

            task.status || "-"

        ],

        taskColumns,

        taskY,

        index % 2 === 0
        ? "#FFFFFF"
        : "#F8FAFD"

    );

    taskY += 24;

});

doc.y = taskY + 20;
// ===================================
// FOOTER (LAST PAGE ONLY)
// ===================================

if (doc.y > 690) {
    doc.addPage();
}

doc.moveDown(2);

doc
.fontSize(10)
.fillColor("gray")
.text(
    "This report has been automatically generated by the Multi Tenant Project Management System.",
    {
        align:"center"
    }
);

doc.moveDown(0.5);

doc
.text(
    "© 2026 Multi Tenant Project Management System",
    {
        align:"center"
    }
);

doc.moveDown(3);

// Left Signature

doc
.strokeColor("black")
.moveTo(70, doc.y)
.lineTo(180, doc.y)
.stroke();

doc
.text(
    "Prepared By",
    85,
    doc.y + 5
);

// Right Signature

doc
.strokeColor("black")
.moveTo(360, doc.y - 18)
.lineTo(470, doc.y - 18)
.stroke();

doc
.text(
    "Approved By",
    375,
    doc.y - 13
);

// =========================
// PAGE NUMBERS
// =========================

const pages = doc.bufferedPageRange();

for (let i = 0; i < pages.count; i++) {

    doc.switchToPage(i);

    doc.fontSize(9)
    .fillColor("gray")
    .text(

        `Page ${i + 1} of ${pages.count}`,

        0,

        doc.page.height - 30,

        {

            width: doc.page.width,

            align: "center"

        }

    );

}

doc.end();

stream.on("finish", async () => {

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
                req.user.tenantId,
                fileName,
                "PDF"
            ]
        );

        res.json({
            success: true,
            message: "Professional PDF Generated Successfully",
            file: "uploads/reports/" + fileName
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "PDF saved but Report History insert failed"
        });

    }

});

} catch (err) {

    console.log(err);

    res.status(500).json({
        success: false,
        message: "PDF Generation Failed"
    });

}

};

// ======================================
// Get Report History
// ======================================

exports.getReportHistory = async (req, res) => {

    try {

        const result = await db.query(
            `
            SELECT
                report_id,
                file_name,
                report_type,
                created_at
            FROM reports
            WHERE tenant_id = $1
            ORDER BY created_at DESC
            `,
            [req.user.tenantId]
        );

        res.json({

            success: true,

            reports: result.rows

        });

    }
    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Failed to fetch report history"

        });

    }

};

// ======================================
// Download Report
// ======================================

exports.downloadReport = async (req, res) => {

    try {

        const { fileName } = req.params;

        const filePath = path.join(
            __dirname,
            "../uploads/reports",
            fileName
        );

        if (!fs.existsSync(filePath)) {

            return res.status(404).json({

                success: false,

                message: "File not found"

            });

        }

        res.download(filePath);

    }
    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Download failed"

        });

    }

};

// ======================================
// Delete Report
// ======================================

exports.deleteReport = async (req, res) => {

    try {

        const { reportId } = req.params;

        // Find report
        const result = await db.query(
            `
            SELECT *
            FROM reports
            WHERE report_id = $1
            `,
            [reportId]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Report not found"

            });

        }

        const report = result.rows[0];

        const filePath = path.join(
            __dirname,
            "../uploads/reports",
            report.file_name
        );

        // Delete file if it exists
        if (fs.existsSync(filePath)) {

            fs.unlinkSync(filePath);

        }

        // Delete database record
        await db.query(
            `
            DELETE FROM reports
            WHERE report_id = $1
            `,
            [reportId]
        );

        res.json({

            success: true,

            message: "Report deleted successfully"

        });

    }
    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Delete failed"

        });

    }

};