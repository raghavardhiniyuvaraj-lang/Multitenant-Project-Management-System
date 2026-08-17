import { useEffect, useState } from "react";
import {
    Card,
    Table,
    Button,
    Form,
    InputGroup
} from "react-bootstrap";

import MainLayout from "../../layouts/MainLayout";
import { toast } from "react-toastify";
import api from "../../services/api";

import AddTaskModal from "./AddTaskModal";
import EditTaskModal from "./EditTaskModal";

import "./Tasks.css";

function Tasks() {

    // =======================================
    // Task State
    // =======================================

    const [tasks, setTasks] = useState([]);

    const [showAdd, setShowAdd] = useState(false);

    const [showEdit, setShowEdit] = useState(false);

    const [selectedTask, setSelectedTask] = useState(null);


    // =======================================
    // Filter State
    // =======================================

    const [searchTerm, setSearchTerm] = useState("");

    const [statusFilter, setStatusFilter] = useState("");

    const [priorityFilter, setPriorityFilter] = useState("");


    // =======================================
    // Load Tasks
    // =======================================

    useEffect(() => {

        fetchTasks();

    }, []);


    // =======================================
    // Fetch Tasks
    // =======================================

    const fetchTasks = async () => {

        try {

            const res = await api.get("/tasks");

            setTasks(
                res.data.tasks || []
            );

        } catch (err) {

            console.log(
                "Fetch Tasks Error:",
                err
            );

            toast.error(
                err.response?.data?.message ||
                "Failed to load tasks"
            );

        }

    };


    // =======================================
    // Delete Task
    // =======================================

    const deleteTask = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this task?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(
                `/tasks/${id}`
            );

            toast.success(
                "Task Deleted Successfully"
            );

            fetchTasks();

        } catch (err) {

            console.log(
                "Delete Task Error:",
                err
            );

            toast.error(
                err.response?.data?.message ||
                "Failed to delete task"
            );

        }

    };


    // =======================================
    // Search + Filter
    // =======================================

    const filteredTasks = tasks.filter(
        (task) => {

            const search =
                searchTerm
                    .toLowerCase()
                    .trim();

            const matchesSearch =
                !search ||
                String(task.task_name || "")
                    .toLowerCase()
                    .includes(search) ||
                String(task.project_name || "")
                    .toLowerCase()
                    .includes(search) ||
                String(task.employee_name || "")
                    .toLowerCase()
                    .includes(search);

            const matchesStatus =
                !statusFilter ||
                String(task.status || "")
                    .toLowerCase() ===
                statusFilter.toLowerCase();

            const matchesPriority =
                !priorityFilter ||
                String(task.priority || "")
                    .toLowerCase() ===
                priorityFilter.toLowerCase();

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
            );

        }
    );


    // =======================================
    // Clear Filters
    // =======================================

    const clearFilters = () => {

        setSearchTerm("");

        setStatusFilter("");

        setPriorityFilter("");

    };


    // =======================================
    // Due Date Status
    // =======================================

    const getDueDateStatus = (task) => {

        // Completed tasks should never
        // be shown as overdue

        if (
            String(task.status || "")
                .toLowerCase() ===
            "completed"
        ) {

            return {
                label: "Completed",
                className: "due-completed"
            };

        }


        // No due date

        if (!task.due_date) {

            return {
                label: "No Due Date",
                className: "due-none"
            };

        }


        const today = new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        const dueDate =
            new Date(task.due_date);

        dueDate.setHours(
            0,
            0,
            0,
            0
        );


        // Overdue

        if (dueDate < today) {

            return {
                label: "Overdue",
                className: "due-overdue"
            };

        }


        // Due Today

        if (
            dueDate.getTime() ===
            today.getTime()
        ) {

            return {
                label: "Due Today",
                className: "due-today"
            };

        }


        // Upcoming

        return {
            label: "Upcoming",
            className: "due-upcoming"
        };

    };


    // =======================================
    // Format Due Date
    // =======================================

    const formatDueDate = (date) => {

        if (!date) {

            return "No Due Date";

        }

        return new Date(date)
            .toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

    };


    // =======================================
    // Render
    // =======================================

    return (

        <MainLayout>

            <div className="container-fluid">


                {/* ===================================
                    PAGE HEADER
                =================================== */}

                <div className="page-header">

                    <h2>
                        ✅ Tasks
                    </h2>

                    <p>
                        Create, assign and monitor
                        project tasks.
                    </p>

                </div>


                {/* ===================================
                    TASK CARD
                =================================== */}

                <Card className="shadow-sm">

                    <Card.Body>


                        {/* ===================================
                            TASK HEADER
                        =================================== */}

                        <div className="task-header">

                            <div>

                                <h3>
                                    Tasks
                                </h3>

                                <small className="text-muted">

                                    {filteredTasks.length}
                                    {" "}
                                    task
                                    {filteredTasks.length !== 1
                                        ? "s"
                                        : ""
                                    }

                                    {" "}found

                                </small>

                            </div>


                            <Button
                                onClick={() =>
                                    setShowAdd(true)
                                }
                            >
                                + Add Task
                            </Button>

                        </div>


                        {/* ===================================
                            SEARCH + FILTERS
                        =================================== */}

                        <div className="task-filters mb-4">

                            <div className="row g-3">


                                {/* Search */}

                                <div className="col-lg-5 col-md-12">

                                    <InputGroup>

                                        <InputGroup.Text>
                                            🔍
                                        </InputGroup.Text>

                                        <Form.Control
                                            type="text"
                                            placeholder="Search task, project or employee..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </InputGroup>

                                </div>


                                {/* Status */}

                                <div className="col-lg-2 col-md-4">

                                    <Form.Select
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="">
                                            All Status
                                        </option>

                                        <option value="Pending">
                                            Pending
                                        </option>

                                        <option value="In Progress">
                                            In Progress
                                        </option>

                                        <option value="Completed">
                                            Completed
                                        </option>

                                    </Form.Select>

                                </div>


                                {/* Priority */}

                                <div className="col-lg-2 col-md-4">

                                    <Form.Select
                                        value={priorityFilter}
                                        onChange={(e) =>
                                            setPriorityFilter(
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="">
                                            All Priority
                                        </option>

                                        <option value="High">
                                            High
                                        </option>

                                        <option value="Medium">
                                            Medium
                                        </option>

                                        <option value="Low">
                                            Low
                                        </option>

                                    </Form.Select>

                                </div>


                                {/* Clear */}

                                <div className="col-lg-3 col-md-4">

                                    <Button
                                        variant="outline-secondary"
                                        className="w-100"
                                        onClick={
                                            clearFilters
                                        }
                                    >
                                        Clear Filters
                                    </Button>

                                </div>

                            </div>

                        </div>


                        {/* ===================================
                            TASK TABLE
                        =================================== */}

                        <Table
                            striped
                            bordered
                            hover
                            responsive
                        >

                            <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Project
                                    </th>

                                    <th>
                                        Employee
                                    </th>

                                    <th>
                                        Task
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

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>


                                {filteredTasks.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="8"
                                            className="text-center"
                                        >

                                            No Tasks Found

                                        </td>

                                    </tr>

                                ) : (

                                    filteredTasks.map(
                                        (task) => (

                                            <tr
                                                key={
                                                    task.task_id
                                                }
                                            >


                                                {/* ID */}

                                                <td>

                                                    {
                                                        task.task_id
                                                    }

                                                </td>


                                                {/* Project */}

                                                <td>

                                                    {
                                                        task.project_name
                                                    }

                                                </td>


                                                {/* Employee */}

                                                <td>

                                                    {
                                                        task.employee_name
                                                    }

                                                </td>


                                                {/* Task */}

                                                <td>

                                                    <strong>
                                                        {
                                                            task.task_name
                                                        }
                                                    </strong>

                                                    {task.description && (

                                                        <div className="text-muted small">

                                                            {
                                                                task.description
                                                            }

                                                        </div>

                                                    )}

                                                </td>


                                                {/* Priority */}

                                                <td>

                                                    <span
                                                        className={
                                                            String(
                                                                task.priority ||
                                                                ""
                                                            ).toLowerCase() ===
                                                            "high"
                                                                ? "badge bg-danger"
                                                                : String(
                                                                    task.priority ||
                                                                    ""
                                                                ).toLowerCase() ===
                                                                "medium"
                                                                    ? "badge bg-warning text-dark"
                                                                    : String(
                                                                        task.priority ||
                                                                        ""
                                                                    ).toLowerCase() ===
                                                                        "low"
                                                                        ? "badge bg-success"
                                                                        : "badge bg-secondary"
                                                        }
                                                    >

                                                        {
                                                            task.priority ||
                                                            "Not Set"
                                                        }

                                                    </span>

                                                </td>


                                                {/* Status */}

                                                <td>

                                                    <span
                                                        className={
                                                            String(
                                                                task.status ||
                                                                ""
                                                            ).toLowerCase() ===
                                                            "completed"
                                                                ? "badge bg-success"
                                                                : String(
                                                                    task.status ||
                                                                    ""
                                                                ).toLowerCase() ===
                                                                "in progress"
                                                                    ? "badge bg-warning text-dark"
                                                                    : String(
                                                                        task.status ||
                                                                        ""
                                                                    ).toLowerCase() ===
                                                                        "pending"
                                                                        ? "badge bg-secondary"
                                                                        : "badge bg-secondary"
                                                        }
                                                    >

                                                        {
                                                            task.status ||
                                                            "Unknown"
                                                        }

                                                    </span>

                                                </td>


                                                {/* Due Date */}

                                                <td>

                                                    <div className="due-date-container">

                                                        <div className="due-date-value">

                                                            {
                                                                formatDueDate(
                                                                    task.due_date
                                                                )
                                                            }

                                                        </div>


                                                        {(() => {

                                                            const dueStatus =
                                                                getDueDateStatus(
                                                                    task
                                                                );

                                                            return (

                                                                <span
                                                                    className={
                                                                        `due-status ${dueStatus.className}`
                                                                    }
                                                                >

                                                                    {
                                                                        dueStatus.label
                                                                    }

                                                                </span>

                                                            );

                                                        })()}

                                                    </div>

                                                </td>


                                                {/* Actions */}

                                                <td>

                                                    <Button
                                                        className="theme-btn action-btn"
                                                        onClick={() => {

                                                            setSelectedTask(
                                                                task
                                                            );

                                                            setShowEdit(
                                                                true
                                                            );

                                                        }}
                                                    >

                                                        Edit

                                                    </Button>


                                                    <Button
                                                        variant="danger"
                                                        className="action-btn"
                                                        onClick={() =>
                                                            deleteTask(
                                                                task.task_id
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

                    </Card.Body>

                </Card>


                {/* ===================================
                    ADD TASK MODAL
                =================================== */}

                <AddTaskModal

                    show={showAdd}

                    handleClose={() =>
                        setShowAdd(false)
                    }

                    refresh={fetchTasks}

                />


                {/* ===================================
                    EDIT TASK MODAL
                =================================== */}

                <EditTaskModal

                    show={showEdit}

                    handleClose={() =>
                        setShowEdit(false)
                    }

                    refresh={fetchTasks}

                    task={selectedTask}

                />

            </div>

        </MainLayout>

    );

}

export default Tasks;
