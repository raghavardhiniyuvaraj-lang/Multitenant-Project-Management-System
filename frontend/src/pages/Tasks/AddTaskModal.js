import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../../services/api";

function AddTaskModal({ show, handleClose, refresh }) {

    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [formData, setFormData] = useState({
        project_id: "",
        employee_id: "",
        task_name: "",
        description: "",
        priority: "Medium",
        status: "Pending",
        due_date: ""
    });

    useEffect(() => {

        if (show) {
            fetchProjects();
            fetchEmployees();
        }

    }, [show]);

    const fetchProjects = async () => {

        try {

            const res = await api.get("/projects");

            setProjects(res.data.projects);

        } catch (err) {

            console.log(err);

        }

    };

    const fetchEmployees = async () => {

        try {

            const res = await api.get("/employees");

            setEmployees(res.data.employees);

        } catch (err) {

            console.log(err);

        }

    };

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.post("/tasks", formData);

            toast.success("Task Added Successfully");

            refresh();

            handleClose();

            setFormData({
                project_id: "",
                employee_id: "",
                task_name: "",
                description: "",
                priority: "Medium",
                status: "Pending",
                due_date: ""
            });

        } catch (err) {

            toast.error(
    err.response?.data?.message || "Something went wrong"
);
        }

    };

    return (

        <Modal show={show} onHide={handleClose} centered>

            <Modal.Header closeButton>

                <Modal.Title>Add Task</Modal.Title>

            </Modal.Header>

            <Form onSubmit={handleSubmit}>

                <Modal.Body>

                    <Form.Group className="mb-3">

                        <Form.Label>Project</Form.Label>

                        <Form.Select
                            name="project_id"
                            value={formData.project_id}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Project
                            </option>

                            {projects.map(project => (

                                <option
                                    key={project.project_id}
                                    value={project.project_id}
                                >
                                    {project.project_name}
                                </option>

                            ))}

                        </Form.Select>

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>Employee</Form.Label>

                        <Form.Select
                            name="employee_id"
                            value={formData.employee_id}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Employee
                            </option>

                            {employees.map(employee => (

                                <option
                                    key={employee.employee_id}
                                    value={employee.employee_id}
                                >
                                    {employee.employee_name}
                                </option>

                            ))}

                        </Form.Select>

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>Task Name</Form.Label>

                        <Form.Control
                            type="text"
                            name="task_name"
                            value={formData.task_name}
                            onChange={handleChange}
                            required
                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>Description</Form.Label>

                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>Priority</Form.Label>

                        <Form.Select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                        >

                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>

                        </Form.Select>

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>Status</Form.Label>

                        <Form.Select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >

                            <option>Pending</option>
                            <option>In Progress</option>
                            <option>Completed</option>

                        </Form.Select>

                    </Form.Group>

                    <Form.Group>

                        <Form.Label>Due Date</Form.Label>

                        <Form.Control
                            type="date"
                            name="due_date"
                            value={formData.due_date}
                            onChange={handleChange}
                            required
                        />

                    </Form.Group>

                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="secondary"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="primary"
                        type="submit"
                    >
                        Save Task
                    </Button>

                </Modal.Footer>

            </Form>

        </Modal>

    );

}

export default AddTaskModal;