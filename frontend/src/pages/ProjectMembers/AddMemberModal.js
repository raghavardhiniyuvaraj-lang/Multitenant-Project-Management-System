import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

import api from "../../services/api";

function AddMemberModal({ show, handleClose, refresh }) {

    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [form, setForm] = useState({
        project_id: "",
        employee_id: "",
        role: "",
        assigned_date: ""
    });

    useEffect(() => {

        if (show) {
            loadData();
        }

    }, [show]);

    const loadData = async () => {

        try {

            const projectRes = await api.get("/projects");
            const employeeRes = await api.get("/employees");

            setProjects(projectRes.data.projects);
            setEmployees(employeeRes.data.employees);

        } catch (err) {

            console.log(err);

        }

    };

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async () => {

        try {

            await api.post("/project-members", form);

            refresh();

            handleClose();

        } catch (err) {

            console.log(err);

        }

    };

    return (

        <Modal show={show} onHide={handleClose}>

            <Modal.Header closeButton>

                <Modal.Title>
                    Assign Member
                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                <Form>

                    <Form.Group className="mb-3">

                        <Form.Label>Project</Form.Label>

                        <Form.Select
                            name="project_id"
                            value={form.project_id}
                            onChange={handleChange}
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
                            value={form.employee_id}
                            onChange={handleChange}
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

                        <Form.Label>Role</Form.Label>

                        <Form.Control
                            type="text"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                        />

                    </Form.Group>

                    <Form.Group>

                        <Form.Label>Assigned Date</Form.Label>

                        <Form.Control
                            type="date"
                            name="assigned_date"
                            value={form.assigned_date}
                            onChange={handleChange}
                        />

                    </Form.Group>

                </Form>

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
                    onClick={handleSubmit}
                >
                    Assign
                </Button>

            </Modal.Footer>

        </Modal>

    );

}

export default AddMemberModal;