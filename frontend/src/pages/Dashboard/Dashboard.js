import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
    Card,
    Row,
    Col,
    Table,
    Badge,
    ProgressBar
} from "react-bootstrap";

import {
    FaBuilding,
    FaUsers,
    FaProjectDiagram,
    FaTasks,
    FaPlusCircle,
    FaUserPlus,
    FaFolderPlus,
    FaClipboardList
} from "react-icons/fa";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";

import "./Dashboard.css";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

function Dashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({

        departments: 0,
        employees: 0,
        projects: 0,
        tasks: 0,

        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0

    });

    const [recentEmployees, setRecentEmployees] = useState([]);

    const [recentProjects, setRecentProjects] = useState([]);

    const [recentTasks, setRecentTasks] = useState([]);

    const [projectProgress, setProjectProgress] = useState([]);

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const res = await api.get("/dashboard");

            setDashboard(res.data.dashboard);

            setRecentEmployees(res.data.employees || []);

            setRecentProjects(res.data.projects || []);

            setRecentTasks(res.data.tasks || []);

            setProjectProgress(res.data.projectProgress || []);

        }

        catch (err) {

            console.log(err);

        }

    };

    const totalTasks = Number(dashboard.tasks);

    const completedPercentage =
        totalTasks === 0
            ? 0
            : Math.round(
                  (Number(dashboard.completedTasks) /
                      totalTasks) *
                      100
              );
console.log("Dashboard Data :", dashboard);
console.log("Completed Percentage :", completedPercentage);
    const pieData = {

        labels: [

            "Pending",

            "In Progress",

            "Completed"

        ],

        datasets: [

            {

                data: [

                    Number(dashboard.pendingTasks),

                    Number(dashboard.inProgressTasks),

                    Number(dashboard.completedTasks)

                ],

                backgroundColor: [

                    "#ffc107",

                    "#0dcaf0",

                    "#198754"

                ]

            }

        ]

    };

    const barData = {

        labels: [

            "Departments",

            "Employees",

            "Projects",

            "Tasks"

        ],

        datasets: [

            {

                label: "Count",

                data: [

                    Number(dashboard.departments),

                    Number(dashboard.employees),

                    Number(dashboard.projects),

                    Number(dashboard.tasks)

                ],

                backgroundColor: [

                    "#4e73df",

                    "#1cc88a",

                    "#f6c23e",

                    "#e74a3b"

                ]

            }

        ]

    };

    return (

        <MainLayout>

            <h2 className="dashboard-title">
                📊 Dashboard
            </h2>

            <p className="text-muted">
                Welcome back! Here's an overview of your workspace.
            </p>

    {/* ============================= */}
{/* Summary Cards */}
{/* ============================= */}

<Row className="mb-4">

    <Col md={3} className="mb-3">

        <Card className="dashboard-card bg-primary text-white shadow">

            <Card.Body className="text-center">

                <FaBuilding size={35} />

                <h3 className="mt-3">
                    {dashboard.departments}
                </h3>

                <h6>Departments</h6>

            </Card.Body>

        </Card>

    </Col>

    <Col md={3} className="mb-3">

        <Card className="dashboard-card bg-success text-white shadow">

            <Card.Body className="text-center">

                <FaUsers size={35} />

                <h3 className="mt-3">
                    {dashboard.employees}
                </h3>

                <h6>Employees</h6>

            </Card.Body>

        </Card>

    </Col>

    <Col md={3} className="mb-3">

        <Card className="dashboard-card bg-warning text-white shadow">

            <Card.Body className="text-center">

                <FaProjectDiagram size={35} />

                <h3 className="mt-3">
                    {dashboard.projects}
                </h3>

                <h6>Projects</h6>

            </Card.Body>

        </Card>

    </Col>

    <Col md={3} className="mb-3">

        <Card className="dashboard-card bg-danger text-white shadow">

            <Card.Body className="text-center">

                <FaTasks size={35} />

                <h3 className="mt-3">
                    {dashboard.tasks}
                </h3>

                <h6>Tasks</h6>

            </Card.Body>

        </Card>

    </Col>

</Row>

{/* ============================= */}
{/* Quick Actions */}
{/* ============================= */}

<Row className="mb-4">

    <Col>

        <Card className="shadow-sm">

            <Card.Body>

                <h4 className="mb-4">
                    ⚡ Quick Actions
                </h4>

                <Row>

                    <Col md={3} className="mb-3">

                        <Link
                            to="/departments"
                            className="text-decoration-none"
                        >

                            <Card className="quick-action-card">

                                <Card.Body className="text-center">

                                    <FaPlusCircle
                                        size={35}
                                        className="mb-3 text-primary"
                                    />

                                    <h5>Add Department</h5>

                                </Card.Body>

                            </Card>

                        </Link>

                    </Col>

                    <Col md={3} className="mb-3">

                        <Link
                            to="/employees"
                            className="text-decoration-none"
                        >

                            <Card className="quick-action-card">

                                <Card.Body className="text-center">

                                    <FaUserPlus
                                        size={35}
                                        className="mb-3 text-success"
                                    />

                                    <h5>Add Employee</h5>

                                </Card.Body>

                            </Card>

                        </Link>

                    </Col>

                    <Col md={3} className="mb-3">

                        <Link
                            to="/projects"
                            className="text-decoration-none"
                        >

                            <Card className="quick-action-card">

                                <Card.Body className="text-center">

                                    <FaFolderPlus
                                        size={35}
                                        className="mb-3 text-warning"
                                    />

                                    <h5>Add Project</h5>

                                </Card.Body>

                            </Card>

                        </Link>

                    </Col>

                    <Col md={3} className="mb-3">

                        <Link
                            to="/tasks"
                            className="text-decoration-none"
                        >

                            <Card className="quick-action-card">

                                <Card.Body className="text-center">

                                    <FaClipboardList
                                        size={35}
                                        className="mb-3 text-danger"
                                    />

                                    <h5>Add Task</h5>

                                </Card.Body>

                            </Card>

                        </Link>

                    </Col>

                </Row>

            </Card.Body>

        </Card>

    </Col>

</Row>

{/* ============================= */}
{/* Progress & Task Status */}
{/* ============================= */}

<Row className="mb-4">

    <Col md={8}>

        <Card className="table-card shadow-sm h-100">

            <Card.Body>

               <h4 className="mb-4">
    📈 Project Progress
</h4>

{
    projectProgress.length === 0 ?

    (

        <p>No Projects Found</p>

    )

    :

    projectProgress.map((project, index) => {

    const percentage =
        Number(project.total_tasks) === 0
            ? 0
            : Math.round(
                (Number(project.completed_tasks) /
                 Number(project.total_tasks)) * 100
            );

    return (

        <div
            key={index}
            className="mb-4"
        >

            <p className="mb-2">
                {project.project_name}
            </p>

            <ProgressBar
                now={percentage}
                label={`${percentage}%`}
                variant={
                    percentage === 100
                        ? "success"
                        : percentage >= 50
                        ? "warning"
                        : "danger"
                }
            />

        </div>

    );

})

    
}

            </Card.Body>

        </Card>

    </Col>

    <Col md={4}>

        <Card className="table-card shadow-sm h-100">

            <Card.Body>

                <h4 className="mb-4">
                    📊 Task Status
                </h4>

                <p>
                    Pending
                    <Badge bg="warning" className="float-end">
                        {dashboard.pendingTasks}
                    </Badge>
                </p>

                <hr />

                <p>
                    In Progress
                    <Badge bg="info" className="float-end">
                        {dashboard.inProgressTasks}
                    </Badge>
                </p>

                <hr />

                <p>
                    Completed
                    <Badge bg="success" className="float-end">
                        {dashboard.completedTasks}
                    </Badge>
                </p>

            </Card.Body>

        </Card>

    </Col>

</Row>

{/* ============================= */}
{/* Charts */}
{/* ============================= */}

<Row className="mb-4">

    <Col lg={6}>

        <Card className="chart-card shadow-sm h-100">

            <Card.Body>

                <h5 className="text-center mb-3">
                    📊 Task Status
                </h5>

                <div style={{ height: "300px" }}>

                    <Pie
                        data={pieData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false
                        }}
                    />

                </div>

            </Card.Body>

        </Card>

    </Col>

    <Col lg={6}>

        <Card className="chart-card shadow-sm h-100">

            <Card.Body>

                <h5 className="text-center mb-3">
                    📈 System Summary
                </h5>

                <div style={{ height: "300px" }}>

                    <Bar
                        data={barData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false
                                }
                            }
                        }}
                    />

                </div>

            </Card.Body>

        </Card>

    </Col>

</Row>

{/* ============================= */}
{/* Recent Employees */}
{/* ============================= */}

<Row className="mb-4">

    <Col>

        <Card className="table-card shadow-sm">

            <Card.Body>

                <h4 className="mb-3">
                    👨‍💼 Recent Employees
                </h4>

                <Table hover responsive>

                    <thead className="table-success">

                        <tr>

                            <th>Name</th>

                            <th>Designation</th>

                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            recentEmployees.map((emp, index) => (

                                <tr key={index}>

                                    <td>{emp.employee_name}</td>

                                    <td>{emp.designation}</td>

                                    <td>

                                        <Badge bg="success">

                                            {emp.status}

                                        </Badge>

                                    </td>

                                </tr>

                            ))
                        }

                    </tbody>

                </Table>

            </Card.Body>

        </Card>

    </Col>

</Row>
{/* ============================= */}
{/* Recent Projects & Upcoming Deadlines */}
{/* ============================= */}

<Row className="mb-4">

    <Col lg={6}>

        <Card className="table-card shadow-sm h-100">

            <Card.Body>

                <h4 className="mb-3">
                    📁 Recent Projects
                </h4>

                <Table hover responsive>

                    <thead className="table-primary">

                        <tr>

                            <th>Project Name</th>

                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            recentProjects.length === 0 ?

                            (

                                <tr>

                                    <td colSpan="2" className="text-center">

                                        No Projects Found

                                    </td>

                                </tr>

                            )

                            :

                            recentProjects.map((project,index)=>(

                                <tr key={index}>

                                    <td>

                                        {project.project_name}

                                    </td>

                                    <td>

                                        <Badge bg="primary">

                                            {project.status}

                                        </Badge>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </Table>

            </Card.Body>

        </Card>

    </Col>

    <Col lg={6}>

        <Card className="table-card shadow-sm h-100">

            <Card.Body>

                <h4 className="mb-3">

                    📝 Recent Tasks

                </h4>

                <Table hover responsive>

                    <thead className="table-dark">

                        <tr>

                            <th>Task</th>

                            <th>Priority</th>

                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            recentTasks.length===0 ?

                            (

                                <tr>

                                    <td colSpan="3" className="text-center">

                                        No Tasks Found

                                    </td>

                                </tr>

                            )

                            :

                            recentTasks.map((task,index)=>(

                                <tr key={index}>

                                    <td>

                                        {task.task_name}

                                    </td>

                                    <td>

                                        <Badge

                                            bg={

                                                task.priority==="High"

                                                ?"danger"

                                                :task.priority==="Medium"

                                                ?"warning"

                                                :"success"

                                            }

                                        >

                                            {task.priority}

                                        </Badge>

                                    </td>

                                    <td>

                                        <Badge

                                            bg={

                                                task.status==="Completed"

                                                ?"success"

                                                :task.status==="Pending"

                                                ?"warning"

                                                :"info"

                                            }

                                        >

                                            {task.status}

                                        </Badge>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </Table>

            </Card.Body>

        </Card>

    </Col>

</Row>

</MainLayout>

    );

}

export default Dashboard;