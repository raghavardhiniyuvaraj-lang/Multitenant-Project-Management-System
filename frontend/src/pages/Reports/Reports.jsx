import { useEffect, useState } from "react";

import {
    Card,
    Button,
    Form,
    Table,
    Row,
    Col,
    Spinner
} from "react-bootstrap";

import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import { toast } from "react-toastify";

import "./Reports.css";

import "chart.js/auto";
import { Pie, Bar } from "react-chartjs-2";

function Reports() {

    const [reportFile, setReportFile] = useState(null);
    const [preview, setPreview] = useState([]);
    const [reports, setReports] = useState([]);

    const [loadingReports, setLoadingReports] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [generatingPDF, setGeneratingPDF] = useState(false);
    const [exportingExcel, setExportingExcel] = useState(false);

    const [dashboard, setDashboard] = useState({
        employees: 0,
        departments: 0,
        projects: 0,
        tasks: 0
    });

    // ==========================================
    // Load Dashboard + Reports
    // ==========================================

    useEffect(() => {
        loadDashboard();
        loadReports();
    }, []);

    // ==========================================
    // Load Dashboard
    // ==========================================

    const loadDashboard = async () => {

        try {

            const res = await api.get("/dashboard");

            const data = res.data.dashboard || {};

            setDashboard({
                employees:
                    Number(
                        data.total_employees ??
                        data.employees ??
                        0
                    ),

                departments:
                    Number(
                        data.total_departments ??
                        data.departments ??
                        0
                    ),

                projects:
                    Number(
                        data.total_projects ??
                        data.projects ??
                        0
                    ),

                tasks:
                    Number(
                        data.total_tasks ??
                        data.tasks ??
                        0
                    )
            });

        } catch (err) {

            console.log("Dashboard Error:", err);

            toast.error("Failed to Load Dashboard Data");

        }

    };

    // ==========================================
    // Load Report History
    // ==========================================

    const loadReports = async () => {

        try {

            setLoadingReports(true);

            const res = await api.get("/reports/history");

            setReports(
                Array.isArray(res.data.reports)
                    ? res.data.reports
                    : []
            );

        } catch (err) {

            console.log("Report History Error:", err);

            toast.error("Failed to Load Reports");

        } finally {

            setLoadingReports(false);

        }

    };

    // ==========================================
    // Export Excel
    // ==========================================

    const exportExcel = async () => {

        try {

            setExportingExcel(true);

            const res = await api.get(
                "/reports/export-excel",
                {
                    responseType: "blob"
                }
            );

            const blob = new Blob(
                [res.data],
                {
                    type:
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                }
            );

            const url =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                "Company_Report.xlsx";

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);

            toast.success(
                "Excel Downloaded Successfully"
            );

        } catch (err) {

            console.log("Excel Export Error:", err);

            toast.error(
                "Excel Export Failed"
            );

        } finally {

            setExportingExcel(false);

        }

    };

    // ==========================================
    // Upload Excel
    // ==========================================

    const uploadExcel = async () => {

        if (!reportFile) {

            toast.warning(
                "Please Select Excel File"
            );

            return;

        }

        const fileName =
            reportFile.name.toLowerCase();

        if (
            !fileName.endsWith(".xlsx") &&
            !fileName.endsWith(".xls")
        ) {

            toast.error(
                "Please select an Excel file (.xlsx or .xls)"
            );

            return;

        }

        try {

            setUploading(true);

            const formData =
                new FormData();

            formData.append(
                "report",
                reportFile
            );

            const res = await api.post(
                "/reports/upload",
                formData
            );

            toast.success(
                res.data.message ||
                "Excel Uploaded Successfully"
            );

            setPreview(
                Array.isArray(res.data.preview)
                    ? res.data.preview
                    : []
            );

            setReportFile(null);

            const fileInput =
                document.getElementById(
                    "reportFileInput"
                );

            if (fileInput) {
                fileInput.value = "";
            }

            loadReports();

        } catch (err) {

            console.log(
                "Excel Upload Error:",
                err
            );

            toast.error(
                err.response?.data?.message ||
                "Upload Failed"
            );

        } finally {

            setUploading(false);

        }

    };

    // ==========================================
    // Generate PDF
    // ==========================================

    const generatePDF = async () => {

        try {

            setGeneratingPDF(true);

            const res =
                await api.post(
                    "/reports/generate"
                );

            toast.success(
                res.data.message ||
                "Professional PDF Generated Successfully"
            );

            if (res.data.file) {

                const fileName =
                    res.data.file.split("/").pop();

                downloadReport(fileName);

            }

            loadReports();

        } catch (err) {

            console.log(
                "PDF Generation Error:",
                err
            );

            toast.error(
                err.response?.data?.message ||
                "PDF Generation Failed"
            );

        } finally {

            setGeneratingPDF(false);

        }

    };

    // ==========================================
    // Download Report
    // ==========================================

    const downloadReport = async (fileName) => {

        try {

            const res =
                await api.get(
                    `/reports/download/${encodeURIComponent(fileName)}`,
                    {
                        responseType: "blob"
                    }
                );

            const blob =
                new Blob([res.data]);

            const url =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download = fileName;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);

        } catch (err) {

            console.log(
                "Download Error:",
                err
            );

            toast.error(
                "Report Download Failed"
            );

        }

    };

    // ==========================================
    // Delete Report
    // ==========================================

    const deleteReport = async (reportId) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this report?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            const res =
                await api.delete(
                    `/reports/${reportId}`
                );

            toast.success(
                res.data.message ||
                "Report deleted successfully"
            );

            loadReports();

        } catch (err) {

            console.log(
                "Delete Report Error:",
                err
            );

            toast.error(
                err.response?.data?.message ||
                "Delete Failed"
            );

        }

    };

    // ==========================================
    // Pie Chart
    // ==========================================

    const pieData = {

        labels: [
            "Projects",
            "Tasks"
        ],

        datasets: [
            {
                data: [
                    dashboard.projects,
                    dashboard.tasks
                ],

                backgroundColor: [
                    "#0d6efd",
                    "#198754"
                ],

                borderWidth: 1
            }
        ]

    };

    // ==========================================
    // Bar Chart
    // ==========================================

    const barData = {

        labels: [
            "Employees",
            "Departments"
        ],

        datasets: [
            {
                label: "Company Data",

                data: [
                    dashboard.employees,
                    dashboard.departments
                ],

                backgroundColor: [
                    "#0d6efd",
                    "#ffc107"
                ]
            }
        ]

    };

    return (

        <MainLayout>

            <div className="page-header">

                <h2>📊 Reports</h2>

                <p>
                    Export Company Data,
                    Upload Excel and Generate
                    Professional Reports
                </p>

            </div>

            {/* ================================= */}
            {/* SUMMARY CARDS */}
            {/* ================================= */}

            <Row className="mb-4">

                <Col md={3} className="mb-3">

                    <Card className="report-card shadow text-center">

                        <Card.Body>

                            <h5>
                                👨‍💼 Employees
                            </h5>

                            <h2>
                                {dashboard.employees}
                            </h2>

                        </Card.Body>

                    </Card>

                </Col>

                <Col md={3} className="mb-3">

                    <Card className="report-card shadow text-center">

                        <Card.Body>

                            <h5>
                                🏢 Departments
                            </h5>

                            <h2>
                                {dashboard.departments}
                            </h2>

                        </Card.Body>

                    </Card>

                </Col>

                <Col md={3} className="mb-3">

                    <Card className="report-card shadow text-center">

                        <Card.Body>

                            <h5>
                                📁 Projects
                            </h5>

                            <h2>
                                {dashboard.projects}
                            </h2>

                        </Card.Body>

                    </Card>

                </Col>

                <Col md={3} className="mb-3">

                    <Card className="report-card shadow text-center">

                        <Card.Body>

                            <h5>
                                ✅ Tasks
                            </h5>

                            <h2>
                                {dashboard.tasks}
                            </h2>

                        </Card.Body>

                    </Card>

                </Col>

            </Row>

            {/* ================================= */}
            {/* CHARTS */}
            {/* ================================= */}

            <Row className="mb-4">

                <Col md={6} className="mb-3">

                    <Card className="chart-card shadow">

                        <Card.Header>
                            Project & Task Distribution
                        </Card.Header>

                        <Card.Body>

                            <Pie
                                data={pieData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: true
                                }}
                            />

                        </Card.Body>

                    </Card>

                </Col>

                <Col md={6} className="mb-3">

                    <Card className="chart-card shadow">

                        <Card.Header>
                            Employee & Department Summary
                        </Card.Header>

                        <Card.Body>

                            <Bar
                                data={barData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: true
                                }}
                            />

                        </Card.Body>

                    </Card>

                </Col>

            </Row>

            {/* ================================= */}
            {/* EXPORT / UPLOAD */}
            {/* ================================= */}

            <Card className="shadow mb-4">

                <Card.Body>

                    <Row>

                        <Col>

                            <Button
                                className="theme-btn"
                                onClick={exportExcel}
                                disabled={exportingExcel}
                            >

                                {exportingExcel
                                    ? (
                                        <>
                                            <Spinner
                                                size="sm"
                                                className="me-2"
                                            />
                                            Exporting...
                                        </>
                                    )
                                    : (
                                        <>
                                            📥 Export Company Data
                                            (Excel)
                                        </>
                                    )}

                            </Button>

                        </Col>

                    </Row>

                    <hr />

                    <Row>

                        <Col md={8}>

                            <Form.Group>

                                <Form.Label>
                                    Choose Excel File
                                </Form.Label>

                                <Form.Control
                                    id="reportFileInput"
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={(e) =>
                                        setReportFile(
                                            e.target.files[0] || null
                                        )
                                    }
                                />

                            </Form.Group>

                        </Col>

                        <Col
                            md={4}
                            className="d-flex align-items-end mt-3 mt-md-0"
                        >

                            <Button
                                className="theme-btn w-100"
                                onClick={uploadExcel}
                                disabled={uploading}
                            >

                                {uploading
                                    ? (
                                        <>
                                            <Spinner
                                                size="sm"
                                                className="me-2"
                                            />
                                            Uploading...
                                        </>
                                    )
                                    : "📤 Upload Excel"}

                            </Button>

                        </Col>

                    </Row>

                </Card.Body>

            </Card>

            {/* ================================= */}
            {/* EXCEL PREVIEW */}
            {/* ================================= */}

            {preview.length > 0 && (

                <Card className="shadow mb-4">

                    <Card.Header>
                        Excel Preview
                    </Card.Header>

                    <Card.Body>

                        <Table
                            striped
                            bordered
                            hover
                            responsive
                        >

                            <tbody>

                                {preview.map(
                                    (row, index) => (

                                        <tr key={index}>

                                            {row.map(
                                                (cell, i) => (

                                                    <td key={i}>
                                                        {cell}
                                                    </td>

                                                )
                                            )}

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </Table>

                    </Card.Body>

                </Card>

            )}

            {/* ================================= */}
            {/* PDF */}
            {/* ================================= */}

            <div className="text-center mb-4">

                <Button
                    size="lg"
                    className="theme-btn"
                    onClick={generatePDF}
                    disabled={generatingPDF}
                >

                    {generatingPDF
                        ? (
                            <>
                                <Spinner
                                    size="sm"
                                    className="me-2"
                                />
                                Generating PDF...
                            </>
                        )
                        : "📄 Generate Professional PDF"}

                </Button>

            </div>

            {/* ================================= */}
            {/* REPORT HISTORY */}
            {/* ================================= */}

            <Card className="shadow mb-4">

                <Card.Header>

                    <h5 className="mb-0">
                        Report History
                    </h5>

                </Card.Header>

                <Card.Body>

                    {loadingReports ? (

                        <div className="text-center p-4">

                            <Spinner />

                        </div>

                    ) : (

                        <Table
                            striped
                            bordered
                            hover
                            responsive
                        >

                            <thead>

                                <tr>

                                    <th>
                                        File Name
                                    </th>

                                    <th>
                                        Type
                                    </th>

                                    <th>
                                        Created Date
                                    </th>

                                    <th>
                                        Download
                                    </th>

                                    <th>
                                        Delete
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {reports.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="text-center"
                                        >

                                            No Reports Found

                                        </td>

                                    </tr>

                                ) : (

                                    reports.map(
                                        (report) => (

                                            <tr
                                                key={
                                                    report.report_id
                                                }
                                            >

                                                <td>
                                                    {
                                                        report.file_name
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        report.report_type
                                                    }
                                                </td>

                                                <td>

                                                    {new Date(
                                                        report.created_at
                                                    ).toLocaleString()}

                                                </td>

                                                <td>

                                                    <Button
                                                        size="sm"
                                                        variant="success"
                                                        onClick={() =>
                                                            downloadReport(
                                                                report.file_name
                                                            )
                                                        }
                                                    >

                                                        Download

                                                    </Button>

                                                </td>

                                                <td>

                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        onClick={() =>
                                                            deleteReport(
                                                                report.report_id
                                                            )
                                                        }
                                                    >

                                                        Delete

                                                    </Button>

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </Table>

                    )}

                </Card.Body>

            </Card>

        </MainLayout>

    );

}

export default Reports;