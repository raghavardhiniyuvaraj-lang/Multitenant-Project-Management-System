import { useEffect, useState } from "react";

import {
    Card,
    Row,
    Col,
    Button,
    Table,
    Spinner,
    ProgressBar
} from "react-bootstrap";

import { useNavigate } from "react-router-dom";

import {
    FaProjectDiagram,
    FaUsers,
    FaTasks,
    FaCheckCircle,
    FaClock,
    FaSpinner,
    FaUserTie,
    FaChartLine,
    FaCalendarAlt
} from "react-icons/fa";

import { toast } from "react-toastify";

import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";

import "./Dashboard.css";


function Dashboard() {

    const navigate = useNavigate();


    // =====================================================
    // DASHBOARD STATE
    // =====================================================

    const [dashboard, setDashboard] = useState({

        total_projects: 0,
        active_projects: 0,
        total_employees: 0,
        total_departments: 0,

        total_tasks: 0,
        completed_tasks: 0,
        pending_tasks: 0,
        in_progress_tasks: 0,

        recent_projects: [],
        recent_tasks: []

    });


    const [loading, setLoading] = useState(true);


    // =====================================================
    // COMPANY STATE
    // =====================================================

    const [company, setCompany] = useState({

        company_name: "",
        company_email: "",
        company_phone: "",
        company_address: "",
        company_logo: "",
        theme_color: "#4e73df"

    });


    // =====================================================
    // LOAD DASHBOARD
    // =====================================================

    useEffect(() => {

        fetchDashboard();
        fetchCompany();

    }, []);


    // =====================================================
    // FETCH DASHBOARD
    // =====================================================

    const fetchDashboard = async () => {

        try {

            setLoading(true);

            const res = await api.get("/dashboard");

            console.log(
                "Dashboard Response:",
                res.data
            );


            if (res.data.success) {

                const data =
                    res.data.dashboard || {};


                setDashboard({

                    total_projects:
                        Number(data.total_projects) || 0,

                    active_projects:
                        Number(data.active_projects) || 0,

                    total_employees:
                        Number(data.total_employees) || 0,

                    total_departments:
                        Number(data.total_departments) || 0,

                    total_tasks:
                        Number(data.total_tasks) || 0,

                    completed_tasks:
                        Number(data.completed_tasks) || 0,

                    pending_tasks:
                        Number(data.pending_tasks) || 0,

                    in_progress_tasks:
                        Number(data.in_progress_tasks) || 0,

                    recent_projects:
                        data.recent_projects || [],

                    recent_tasks:
                        data.recent_tasks || []

                });

            }

        }

        catch (err) {

            console.log(
                "Dashboard Error:",
                err
            );

            toast.error(
                err.response?.data?.message ||
                "Failed to load dashboard"
            );

        }

        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // FETCH COMPANY
    // =====================================================

    const fetchCompany = async () => {

        try {

            const tenantRes =
                await api.get("/tenant");


            const settingsRes =
                await api.get("/settings");


            console.log(
                "Tenant Response:",
                tenantRes.data
            );


            console.log(
                "Settings Response:",
                settingsRes.data
            );


            const tenant =
                tenantRes.data?.tenant || {};


            const settings =
                settingsRes.data?.settings || {};


            // =================================================
            // IMPORTANT:
            // Check BOTH settings and tenant for logo
            // =================================================

            const logo =
                settings.company_logo ||
                settings.logo ||
                tenant.company_logo ||
                tenant.logo ||
                tenant.tenant_logo ||
                tenant.companyLogo ||
                "";


            const companyData = {

                company_name:
                    settings.company_name ||
                    tenant.tenant_name ||
                    tenant.company_name ||
                    "Company",


                company_email:
                    settings.company_email ||
                    tenant.email ||
                    tenant.company_email ||
                    "",


                company_phone:
                    settings.company_phone ||
                    tenant.phone ||
                    tenant.company_phone ||
                    "",


                company_address:
                    settings.company_address ||
                    tenant.address ||
                    tenant.company_address ||
                    "",


                company_logo:
                    logo,


                theme_color:
                    settings.theme_color ||
                    tenant.theme_color ||
                    "#4e73df"

            };


            console.log(
                "Company Data:",
                companyData
            );


            console.log(
                "Company Logo:",
                companyData.company_logo
            );


            setCompany(companyData);


            // =================================================
            // APPLY THEME COLOR
            // =================================================

            document.documentElement.style.setProperty(
                "--primary-color",
                companyData.theme_color
            );

        }

        catch (err) {

            console.log(
                "Company Settings Error:",
                err
            );

        }

    };


    // =====================================================
    // COMPANY LOGO URL
    // =====================================================
const getLogoUrl = () => {
    if (!company.company_logo) {
        return "";
    }

    let logo = String(company.company_logo).trim();

    if (!logo) {
        return "";
    }

    // Already a complete URL
    if (
        logo.startsWith("http://") ||
        logo.startsWith("https://")
    ) {
        return logo;
    }

    // Remove leading slash
    logo = logo.replace(/^\/+/, "");

    const BACKEND_URL =
        "https://multitenant-project-management-system.onrender.com";

    // Database contains uploads/company/...
    if (logo.startsWith("uploads/company/")) {
        return `${BACKEND_URL}/${logo}`;
    }

    // Database contains only filename
    return `${BACKEND_URL}/uploads/company/${logo}`;
};

    // =====================================================
    // TASK VALUES
    // =====================================================

    const totalTasks =
        Number(
            dashboard.total_tasks
        ) || 0;


    const completedTasks =
        Number(
            dashboard.completed_tasks
        ) || 0;


    const pendingTasks =
        Number(
            dashboard.pending_tasks
        ) || 0;


    const inProgressTasks =
        Number(
            dashboard.in_progress_tasks
        ) || 0;


    // =====================================================
    // COMPLETION %
    // =====================================================

    const completionPercentage =
        totalTasks > 0
            ? Math.round(
                (
                    completedTasks /
                    totalTasks
                ) * 100
            )
            : 0;


    // =====================================================
    // DASHBOARD CARD
    // =====================================================

    const DashboardCard = ({
        icon,
        value,
        title,
        className,
        onClick
    }) => {

        return (

            <Col
                lg={3}
                md={4}
                sm={6}
                xs={12}
                className="mb-4"
            >

                <Card
                    className={
                        `dashboard-card ${className}`
                    }
                    onClick={onClick}
                >

                    <Card.Body>

                        {icon}


                        <h3>

                            {loading ? (

                                <Spinner
                                    animation="border"
                                    size="sm"
                                />

                            ) : (

                                value

                            )}

                        </h3>


                        <p>
                            {title}
                        </p>

                    </Card.Body>

                </Card>

            </Col>

        );

    };


    // =====================================================
    // NAVIGATION
    // =====================================================

    const goToProjects = () => {

        navigate("/projects");

    };


    const goToEmployees = () => {

        navigate("/employees");

    };


    const goToMembers = () => {

        navigate("/project-members");

    };


    const goToTasks = () => {

        navigate("/tasks");

    };


    // =====================================================
    // DATE FORMAT
    // =====================================================

    const formatDate = (date) => {

        if (!date) {

            return "Not available";

        }


        return new Date(
            date
        ).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    // =====================================================
    // PROJECT STATUS
    // =====================================================

    const getProjectStatusClass = (
        status
    ) => {

        const value =
            String(
                status || ""
            ).toLowerCase();


        if (value === "active") {

            return "bg-success";

        }


        if (value === "completed") {

            return "bg-primary";

        }


        if (value === "pending") {

            return "bg-warning text-dark";

        }


        return "bg-secondary";

    };


    // =====================================================
    // TASK STATUS
    // =====================================================

    const getTaskStatusClass = (
        status
    ) => {

        const value =
            String(
                status || ""
            ).toLowerCase();


        if (value === "completed") {

            return "bg-success";

        }


        if (value === "pending") {

            return "bg-warning text-dark";

        }


        if (value === "in progress") {

            return "bg-primary";

        }


        return "bg-secondary";

    };


    // =====================================================
    // PRIORITY
    // =====================================================

    const getPriorityClass = (
        priority
    ) => {

        const value =
            String(
                priority || ""
            ).toLowerCase();


        if (value === "high") {

            return "bg-danger";

        }


        if (value === "medium") {

            return "bg-warning text-dark";

        }


        if (value === "low") {

            return "bg-success";

        }


        return "bg-secondary";

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <MainLayout>

            <div className="container-fluid">


                {/* =================================================
                    DASHBOARD HEADER
                ================================================= */}

                <div className="company-header mb-4">

                    <div>

                        <h2 className="dashboard-title">
                            Dashboard
                        </h2>

                        <p>
                            Welcome to your project management dashboard
                        </p>

                    </div>

                </div>


                {/* =================================================
                    COMPANY INFORMATION
                ================================================= */}

                <Card className="table-card mb-4">

                    <Card.Body>

                        <div className="company-header">


                            {/* =================================================
                                LOGO
                            ================================================= */}

                           {company.company_logo ? (

    <img
        src={getLogoUrl()}
        alt={`${company.company_name} Logo`}
        className="company-logo"

        onLoad={(e) => {

            console.log(
                "Company logo loaded:",
                e.currentTarget.src
            );

        }}

        onError={(e) => {

            console.log(
                "Company logo failed:",
                e.currentTarget.src
            );

            e.currentTarget.style.display = "none";

            const fallback =
                e.currentTarget.nextElementSibling;

            if (fallback) {
                fallback.style.display = "flex";
            }

        }}

    />

) : (

    <div
        className="company-logo d-flex align-items-center justify-content-center"
        style={{
            background:
                "var(--primary-color, #4e73df)",
            color: "#fff"
        }}
    >
        <FaUserTie size={28} />
    </div>

)}
                            {/* =================================================
                                COMPANY DETAILS
                            ================================================= */}

                            <div>

                                <h3>

                                    {
                                        company.company_name ||
                                        "Company"
                                    }

                                </h3>


                                <p>
                                    Project Management Overview
                                </p>


                                {company.company_email && (

                                    <small>

                                        {
                                            company.company_email
                                        }

                                    </small>

                                )}

                            </div>

                        </div>

                    </Card.Body>

                </Card>


                {/* =================================================
                    DASHBOARD CARDS
                ================================================= */}

                <Row>


                    <DashboardCard

                        icon={
                            <FaProjectDiagram
                                size={35}
                            />
                        }

                        value={
                            dashboard.total_projects
                        }

                        title="Total Projects"

                        className="card-blue"

                        onClick={
                            goToProjects
                        }

                    />


                    <DashboardCard

                        icon={
                            <FaCheckCircle
                                size={35}
                            />
                        }

                        value={
                            dashboard.active_projects
                        }

                        title="Active Projects"

                        className="card-green"

                        onClick={
                            goToProjects
                        }

                    />


                    <DashboardCard

                        icon={
                            <FaUsers
                                size={35}
                            />
                        }

                        value={
                            dashboard.total_employees
                        }

                        title="Total Employees"

                        className="card-orange"

                        onClick={
                            goToEmployees
                        }

                    />


                    <DashboardCard

                        icon={
                            <FaTasks
                                size={35}
                            />
                        }

                        value={
                            dashboard.total_tasks
                        }

                        title="Total Tasks"

                        className="card-cyan"

                        onClick={
                            goToTasks
                        }

                    />


                    <DashboardCard

                        icon={
                            <FaCheckCircle
                                size={35}
                            />
                        }

                        value={
                            dashboard.completed_tasks
                        }

                        title="Completed Tasks"

                        className="card-yellow"

                        onClick={
                            goToTasks
                        }

                    />


                    <DashboardCard

                        icon={
                            <FaClock
                                size={35}
                            />
                        }

                        value={
                            dashboard.pending_tasks
                        }

                        title="Pending Tasks"

                        className="card-red"

                        onClick={
                            goToTasks
                        }

                    />


                    <DashboardCard

                        icon={
                            <FaSpinner
                                size={35}
                            />
                        }

                        value={
                            dashboard.in_progress_tasks
                        }

                        title="In Progress Tasks"

                        className="card-purple"

                        onClick={
                            goToTasks
                        }

                    />

                </Row>


                {/* =================================================
                    TASK COMPLETION
                ================================================= */}

                <Row className="mb-4">

                    <Col lg={12}>

                        <Card className="table-card progress-card">

                            <Card.Body>

                                <div className="d-flex justify-content-between align-items-center mb-3">

                                    <div>

                                        <h4 className="mb-1">

                                            <FaChartLine
                                                className="me-2"
                                            />

                                            Overall Task Completion

                                        </h4>


                                        <small className="text-muted">

                                            {completedTasks}
                                            {" "}
                                            of
                                            {" "}
                                            {totalTasks}
                                            {" "}
                                            tasks completed

                                        </small>

                                    </div>


                                    <div className="completion-percentage">

                                        {completionPercentage}%

                                    </div>

                                </div>


                                <ProgressBar

                                    now={
                                        completionPercentage
                                    }

                                    className="task-progress-bar"

                                    label={
                                        `${completionPercentage}%`
                                    }

                                />


                                <div className="task-progress-details mt-3">


                                    <div>

                                        <span className="status-dot completed-dot"></span>

                                        <strong>
                                            Completed
                                        </strong>

                                        <span className="ms-2">
                                            {completedTasks}
                                        </span>

                                    </div>


                                    <div>

                                        <span className="status-dot progress-dot"></span>

                                        <strong>
                                            In Progress
                                        </strong>

                                        <span className="ms-2">
                                            {inProgressTasks}
                                        </span>

                                    </div>


                                    <div>

                                        <span className="status-dot pending-dot"></span>

                                        <strong>
                                            Pending
                                        </strong>

                                        <span className="ms-2">
                                            {pendingTasks}
                                        </span>

                                    </div>


                                </div>

                            </Card.Body>

                        </Card>

                    </Col>

                </Row>


                {/* =================================================
                    RECENT PROJECTS
                ================================================= */}

                <Row className="mb-4">

                    <Col lg={12}>

                        <Card className="table-card">

                            <Card.Body>

                                <div className="section-heading">

                                    <div>

                                        <h4>

                                            <FaProjectDiagram
                                                className="me-2"
                                            />

                                            Recent Projects

                                        </h4>


                                        <p>
                                            Recently added projects in your organization
                                        </p>

                                    </div>


                                    <Button
                                        size="sm"
                                        variant="outline-primary"
                                        onClick={
                                            goToProjects
                                        }
                                    >
                                        View All Projects
                                    </Button>

                                </div>


                                {dashboard.recent_projects.length === 0 ? (

                                    <div className="empty-dashboard-section">

                                        <FaProjectDiagram
                                            size={35}
                                        />

                                        <p>
                                            No projects available
                                        </p>


                                        <Button
                                            size="sm"
                                            variant="primary"
                                            onClick={
                                                goToProjects
                                            }
                                        >
                                            Create Project
                                        </Button>

                                    </div>

                                ) : (

                                    <Table
                                        responsive
                                        hover
                                        className="dashboard-table"
                                    >

                                        <thead>

                                            <tr>

                                                <th>
                                                    Project Name
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                                <th>
                                                    Start Date
                                                </th>

                                                <th>
                                                    End Date
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {dashboard.recent_projects.map(
                                                (project) => (

                                                    <tr
                                                        key={
                                                            project.project_id
                                                        }
                                                    >

                                                        <td>

                                                            <strong>
                                                                {
                                                                    project.project_name
                                                                }
                                                            </strong>

                                                        </td>


                                                        <td>

                                                            <span
                                                                className={
                                                                    `badge ${getProjectStatusClass(
                                                                        project.status
                                                                    )}`
                                                                }
                                                            >

                                                                {
                                                                    project.status ||
                                                                    "Unknown"
                                                                }

                                                            </span>

                                                        </td>


                                                        <td>

                                                            <FaCalendarAlt
                                                                className="me-2 text-muted"
                                                            />

                                                            {
                                                                formatDate(
                                                                    project.start_date
                                                                )
                                                            }

                                                        </td>


                                                        <td>

                                                            <FaCalendarAlt
                                                                className="me-2 text-muted"
                                                            />

                                                            {
                                                                formatDate(
                                                                    project.end_date
                                                                )
                                                            }

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </Table>

                                )}

                            </Card.Body>

                        </Card>

                    </Col>

                </Row>


                {/* =================================================
                    RECENT TASKS
                ================================================= */}

                <Row className="mb-4">

                    <Col lg={12}>

                        <Card className="table-card">

                            <Card.Body>

                                <div className="section-heading">

                                    <div>

                                        <h4>

                                            <FaTasks
                                                className="me-2"
                                            />

                                            Recent Tasks

                                        </h4>


                                        <p>
                                            Recently added tasks across your projects
                                        </p>

                                    </div>


                                    <Button
                                        size="sm"
                                        variant="outline-primary"
                                        onClick={
                                            goToTasks
                                        }
                                    >
                                        View All Tasks
                                    </Button>

                                </div>


                                {dashboard.recent_tasks.length === 0 ? (

                                    <div className="empty-dashboard-section">

                                        <FaTasks
                                            size={35}
                                        />

                                        <p>
                                            No tasks available
                                        </p>


                                        <Button
                                            size="sm"
                                            variant="primary"
                                            onClick={
                                                goToTasks
                                            }
                                        >
                                            Create Task
                                        </Button>

                                    </div>

                                ) : (

                                    <Table
                                        responsive
                                        hover
                                        className="dashboard-table"
                                    >

                                        <thead>

                                            <tr>

                                                <th>
                                                    Task Name
                                                </th>

                                                <th>
                                                    Priority
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                                <th>
                                                    Due Date
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {dashboard.recent_tasks.map(
                                                (task) => (

                                                    <tr
                                                        key={
                                                            task.task_id
                                                        }
                                                    >

                                                        <td>

                                                            <strong>
                                                                {
                                                                    task.task_name
                                                                }
                                                            </strong>

                                                        </td>


                                                        <td>

                                                            <span
                                                                className={
                                                                    `badge ${getPriorityClass(
                                                                        task.priority
                                                                    )}`
                                                                }
                                                            >

                                                                {
                                                                    task.priority ||
                                                                    "Not Set"
                                                                }

                                                            </span>

                                                        </td>


                                                        <td>

                                                            <span
                                                                className={
                                                                    `badge ${getTaskStatusClass(
                                                                        task.status
                                                                    )}`
                                                                }
                                                            >

                                                                {
                                                                    task.status ||
                                                                    "Unknown"
                                                                }

                                                            </span>

                                                        </td>


                                                        <td>

                                                            <FaCalendarAlt
                                                                className="me-2 text-muted"
                                                            />

                                                            {
                                                                formatDate(
                                                                    task.due_date
                                                                )
                                                            }

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </Table>

                                )}

                            </Card.Body>

                        </Card>

                    </Col>

                </Row>


                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <Row className="mb-4">

                    <Col md={12}>

                        <Card className="quick-action-card table-card">

                            <Card.Body>

                                <h4 className="mb-3">
                                    Quick Actions
                                </h4>


                                <div className="d-flex flex-wrap gap-3">

                                    <Button
                                        variant="primary"
                                        onClick={
                                            goToProjects
                                        }
                                    >
                                        + Manage Projects
                                    </Button>


                                    <Button
                                        variant="success"
                                        onClick={
                                            goToEmployees
                                        }
                                    >
                                        + Manage Employees
                                    </Button>


                                    <Button
                                        variant="info"
                                        onClick={
                                            goToMembers
                                        }
                                    >
                                        + Assign Members
                                    </Button>


                                    <Button
                                        variant="warning"
                                        onClick={
                                            goToTasks
                                        }
                                    >
                                        + Manage Tasks
                                    </Button>

                                </div>

                            </Card.Body>

                        </Card>

                    </Col>

                </Row>


                {/* =================================================
                    TASK SUMMARY
                ================================================= */}

                <Row>

                    <Col lg={12}>

                        <Card className="table-card">

                            <Card.Body>

                                <h4 className="mb-3">
                                    Task Summary
                                </h4>


                                <Table
                                    striped
                                    bordered
                                    hover
                                    responsive
                                >

                                    <thead>

                                        <tr>

                                            <th>
                                                Task Status
                                            </th>

                                            <th>
                                                Count
                                            </th>

                                            <th>
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>


                                        <tr>

                                            <td>

                                                <span className="badge bg-success">
                                                    Completed
                                                </span>

                                            </td>


                                            <td>
                                                {
                                                    dashboard.completed_tasks
                                                }
                                            </td>


                                            <td>

                                                <Button
                                                    size="sm"
                                                    variant="outline-success"
                                                    onClick={
                                                        goToTasks
                                                    }
                                                >
                                                    View Tasks
                                                </Button>

                                            </td>

                                        </tr>


                                        <tr>

                                            <td>

                                                <span className="badge bg-warning text-dark">
                                                    Pending
                                                </span>

                                            </td>


                                            <td>
                                                {
                                                    dashboard.pending_tasks
                                                }
                                            </td>


                                            <td>

                                                <Button
                                                    size="sm"
                                                    variant="outline-warning"
                                                    onClick={
                                                        goToTasks
                                                    }
                                                >
                                                    View Tasks
                                                </Button>

                                            </td>

                                        </tr>


                                        <tr>

                                            <td>

                                                <span className="badge bg-primary">
                                                    In Progress
                                                </span>

                                            </td>


                                            <td>
                                                {
                                                    dashboard.in_progress_tasks
                                                }
                                            </td>


                                            <td>

                                                <Button
                                                    size="sm"
                                                    variant="outline-primary"
                                                    onClick={
                                                        goToTasks
                                                    }
                                                >
                                                    View Tasks
                                                </Button>

                                            </td>

                                        </tr>


                                    </tbody>

                                </Table>

                            </Card.Body>

                        </Card>

                    </Col>

                </Row>


            </div>

        </MainLayout>

    );

}


export default Dashboard;
