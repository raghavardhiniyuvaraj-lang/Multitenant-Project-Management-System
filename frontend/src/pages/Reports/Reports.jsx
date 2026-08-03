import { useEffect, useState } from "react";

import {
    Card,
    Button,
    Form,
    Table,
    Row,
    Col
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
    const [dashboard, setDashboard] = useState({
    employees: 0,
    departments: 0,
    projects: 0,
    tasks: 0
});
const pieData = {
    labels: ["Projects", "Tasks"],
    datasets: [
        {
            data: [
                dashboard.projects,
                dashboard.tasks
            ],
            backgroundColor: [
                "#0d6efd",
                "#198754"
            ]
        }
    ]
};

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

useEffect(() => {

    loadDashboard();

    loadReports();

}, []);

const loadDashboard = async () => {

    try {

        const res = await api.get("/dashboard");

        setDashboard({
            employees: res.data.dashboard.employees,
            departments: res.data.dashboard.departments,
            projects: res.data.dashboard.projects,
            tasks: res.data.dashboard.tasks
        });

    } catch (err) {

        console.log(err);

    }

};
const loadReports = async () => {

    try {

        const res = await api.get("/reports/history");

        setReports(res.data.reports);

    }

    catch (err) {

        console.log(err);

        toast.error("Failed to Load Reports");

    }

};
    // ============================
    // Export Company Data
    // ============================

    const exportExcel = async () => {

        try {

            const res = await api.get(

                "/reports/export-excel",

                {

                    responseType: "blob"

                }

            );

            const url = window.URL.createObjectURL(

                new Blob([res.data])

            );

            const link = document.createElement("a");

            link.href = url;

            link.setAttribute(

                "download",

                "Company_Report.xlsx"

            );

            document.body.appendChild(link);

            link.click();

            link.remove();

            toast.success("Excel Downloaded Successfully");

        }

        catch (err) {

            console.log(err);

            toast.error("Excel Export Failed");

        }

    };

    // ============================
    // Upload Excel
    // ============================

    const uploadExcel = async () => {

        if (!reportFile) {

            toast.warning("Please Select Excel File");

            return;

        }

        try {

            const formData = new FormData();

            formData.append(

                "report",

                reportFile

            );

            console.log(reportFile);
console.log(reportFile.name);
console.log(formData.get("report"));
           
const res = await api.post(
    "/reports/upload",
    formData,
    {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }
);

console.log("API Response:");
console.log(res);

console.log("Response Data:");
console.log(res.data);

toast.success(res.data.message);

setPreview(res.data.preview);
        }
        catch (err) {

            console.log(err);

            toast.error("Upload Failed");

        }

    };

    // ============================
    // Generate PDF
    // ============================

   const generatePDF = async () => {

    try {

        const res = await api.post("/reports/generate");

        toast.success(res.data.message);

        const link = document.createElement("a");

        link.href = "http://localhost:5000/" + res.data.file;

        link.download = "Company_Report.pdf";

        document.body.appendChild(link);

        link.click();

        link.remove();

    }

    catch (err) {

        console.log(err);

        toast.error("PDF Generation Failed");

    }

};
const downloadReport = (fileName) => {

    const link = document.createElement("a");

    link.href =
        "http://localhost:5000/uploads/reports/" + fileName;

    link.download = fileName;

    document.body.appendChild(link);

    link.click();

    link.remove();

};
const deleteReport = async (reportId) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this report?"
    );

    if (!confirmDelete) return;

    try {

        const res = await api.delete(
            "/reports/" + reportId
        );

        toast.success(res.data.message);

        // Refresh Report History
        loadReports();

    }

    catch (err) {

        console.log(err);

        toast.error("Delete Failed");

    }

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
            <Row className="mb-4">

    <Col md={3}>
        <Card className="report-card shadow text-center">
            <Card.Body>
                <h5>👨‍💼 Employees</h5>
                <h2>{dashboard.employees}</h2>
            </Card.Body>
        </Card>
    </Col>

    <Col md={3}>
        <Card className="report-card shadow text-center">
            <Card.Body>
                <h5>🏢 Departments</h5>
                <h2>{dashboard.departments}</h2>
            </Card.Body>
        </Card>
    </Col>

    <Col md={3}>
        <Card className="report-card shadow text-center">
            <Card.Body>
                <h5>📁 Projects</h5>
                <h2>{dashboard.projects}</h2>
            </Card.Body>
        </Card>
    </Col>

    <Col md={3}>
        <Card className="report-card shadow text-center">
            <Card.Body>
                <h5>✅ Tasks</h5>
                <h2>{dashboard.tasks}</h2>
            </Card.Body>
        </Card>
    </Col>

</Row>
<Row className="mb-4">

    <Col md={6}>

        <Card className="shadow">

            <Card.Header>

                Project & Task Distribution

            </Card.Header>

            <Card.Body>

                <Pie data={pieData} />

            </Card.Body>

        </Card>

    </Col>

    <Col md={6}>

        <Card className="shadow">

            <Card.Header>

                Employee & Department Summary

            </Card.Header>

            <Card.Body>

                <Bar data={barData} />

            </Card.Body>

        </Card>

    </Col>

</Row>
            <Card className="shadow">

                <Card.Body>

                    <Row>

                        <Col>

                            <Button

                                className="theme-btn me-3"

                                onClick={exportExcel}

                            >

                                📥 Export Company Data (Excel)

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

                                    type="file"

                                    accept=".xlsx,.xls"

                                    onChange={(e) =>

                                        setReportFile(

                                            e.target.files[0]

                                        )

                                    }

                                />

                            </Form.Group>

                        </Col>

                        <Col

                            md={4}

                            className="d-flex align-items-end"

                        >

                            <Button

                                className="theme-btn w-100"

                                onClick={uploadExcel}

                            >

                                Upload Excel

                            </Button>

                        </Col>

                    </Row>

                </Card.Body>

            </Card>

            <br />

            {

                preview.length > 0 &&

                <Card className="shadow">

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

                                {

                                    preview.map(

                                        (

                                            row,

                                            index

                                        ) => (

                                            <tr

                                                key={index}

                                            >

                                                {

                                                    row.map(

                                                        (

                                                            cell,

                                                            i

                                                        ) => (

                                                            <td

                                                                key={i}

                                                            >

                                                                {

                                                                    cell

                                                                }

                                                            </td>

                                                        )

                                                    )

                                                }

                                            </tr>

                                        )

                                    )

                                }

                            </tbody>

                        </Table>

                    </Card.Body>

                </Card>

            }

            <br />

            <div className="text-center">

                <Button

                    size="lg"

                    className="theme-btn"

                    onClick={generatePDF}

                >

                    📄 Generate Professional PDF

                </Button>

            </div>
            <br />

<Card className="shadow">

    <Card.Header>

        <h5 className="mb-0">
            Report History
        </h5>

    </Card.Header>

    <Card.Body>

        <Table
            striped
            bordered
            hover
            responsive
        >

            <thead>

                <tr>

                    <th>File Name</th>
                    <th>Type</th>
                    <th>Created Date</th>
                    <th>Download</th>
                    <th>Delete</th>

                </tr>

            </thead>

            <tbody>

                {

                    reports.length === 0 ?

                    (

                        <tr>

                            <td
                                colSpan="5"
                                className="text-center"
                            >

                                No Reports Found

                            </td>

                        </tr>

                    )

                    :

                    reports.map((report) => (

                        <tr key={report.report_id}>

                            <td>{report.file_name}</td>

                            <td>{report.report_type}</td>

                            <td>

                                {new Date(
                                    report.created_at
                                ).toLocaleString()}

                            </td>

                            <td>

                               <Button
    size="sm"
    variant="success"
    onClick={() => downloadReport(report.file_name)}
>
    Download
</Button>

                            </td>

                            <td>

                                <Button
    size="sm"
    variant="danger"
    onClick={() =>
        deleteReport(report.report_id)
    }
>
    Delete
</Button>

                            </td>

                        </tr>

                    ))

                }

            </tbody>

        </Table>

    </Card.Body>

</Card>

        </MainLayout>

    );

}

export default Reports;