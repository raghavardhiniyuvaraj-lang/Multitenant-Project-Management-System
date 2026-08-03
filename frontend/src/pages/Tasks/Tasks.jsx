import { useEffect, useState } from "react";
import { Card, Table, Button } from "react-bootstrap";

import MainLayout from "../../layouts/MainLayout";
import { toast } from "react-toastify";
import api from "../../services/api";

import AddTaskModal from "./AddTaskModal";
import EditTaskModal from "./EditTaskModal";

import "./Tasks.css";

function Tasks() {

    const [tasks, setTasks] = useState([]);

    const [showAdd, setShowAdd] = useState(false);

    const [showEdit, setShowEdit] = useState(false);

    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {

        fetchTasks();

    }, []);

    const fetchTasks = async () => {

        try {

            const res = await api.get("/tasks");

            setTasks(res.data.tasks);

        } catch (err) {

            console.log(err);

        }

    };

    const deleteTask = async (id) => {

        if (!window.confirm("Delete this task?")) return;

        try {

            await api.delete(`/tasks/${id}`);

            toast.success("Task Deleted Successfully");

            fetchTasks();

        } catch (err) {

           toast.error(
    err.response?.data?.message || "Something went wrong"
);

        }

    };

    return (

        <MainLayout>

<div className="page-header">
    <h2>✅ Tasks</h2>
    <p>Create, assign and monitor project tasks.</p>
</div>

{/* Task Table */}


            <Card className="shadow-sm">

                <Card.Body>

                    <div className="task-header">

                        <h3>Tasks</h3>

                        <Button
                            onClick={() => setShowAdd(true)}
                        >
                            + Add Task
                        </Button>

                    </div>

                    <Table striped bordered hover responsive>

                        <thead>

                            <tr>

                                <th>ID</th>
                                <th>Project</th>
                                <th>Employee</th>
                                <th>Task</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Due Date</th>
                                <th>Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {tasks.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="text-center"
                                    >
                                        No Tasks Found
                                    </td>

                                </tr>

                            ) : (

                                tasks.map((task) => (

                                    <tr key={task.task_id}>

                                        <td>{task.task_id}</td>

                                        <td>{task.project_name}</td>

                                        <td>{task.employee_name}</td>

                                        <td>{task.task_name}</td>

                                        <td>{task.priority}</td>

                                        <td>

    <span
        className={
            task.status === "Active"
                ? "badge bg-success"
                : "badge bg-danger"
        }
    >

        {task.status}

    </span>

</td>

                                        <td>
                                            {new Date(task.due_date).toLocaleDateString()}
                                        </td>

                                        <td>

                                           <Button
    className="theme-btn action-btn"
    onClick={() => {
        setSelectedTask(task);
        setShowEdit(true);
    }}
>
    Edit
</Button>

<Button
    variant="danger"
    className="action-btn"
    onClick={() => deleteTask(task.task_id)}
>
    Delete
</Button>
                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </Table>

                </Card.Body>

            </Card>

            <AddTaskModal
                show={showAdd}
                handleClose={() => setShowAdd(false)}
                refresh={fetchTasks}
            />

            <EditTaskModal
                show={showEdit}
                handleClose={() => setShowEdit(false)}
                refresh={fetchTasks}
                task={selectedTask}
            />

        </MainLayout>

    );

}

export default Tasks;