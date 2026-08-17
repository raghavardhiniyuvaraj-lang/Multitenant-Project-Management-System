import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import api from "../../services/api";

function AddMemberModal({
    show,
    handleClose,
    refresh
}) {

    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [form, setForm] = useState({
        project_id: "",
        employee_id: "",
        role: "",
        assigned_date: ""
    });

    // ===============================
    // Load Projects & Employees
    // ===============================
    useEffect(() => {

        if (show) {
            loadData();
        }

    }, [show]);

    const loadData = async () => {

        try {

            const projectRes =
                await api.get("/projects");

            const employeeRes =
                await api.get("/employees");

            setProjects(
                projectRes.data.projects || []
            );

            setEmployees(
                employeeRes.data.employees || []
            );

        } catch (err) {

            console.log(
                "Load Member Data Error:",
                err
            );

            toast.error(
                "Failed to load projects or employees"
            );

        }

    };

    // ===============================
    // Handle Change
    // ===============================
    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    // ===============================
    // Assign Member
    // ===============================
    const handleSubmit = async (e) => {

        e.preventDefault();

        // Validate Project
        if (!form.project_id) {

            toast.error(
                "Please select a project"
            );

            return;
        }

        // Validate Employee
        if (!form.employee_id) {

            toast.error(
                "Please select an employee"
            );

            return;
        }

        // Validate Assigned Date
        if (!form.assigned_date) {

            toast.error(
                "Please select assigned date"
            );

            return;
        }

        try {

            // =================================
            // IMPORTANT:
            // Backend route is /project-members
            // =================================

            const res = await api.post(
                "/project-members",
                {
                    project_id:
                        Number(form.project_id),

                    employee_id:
                        Number(form.employee_id),

                    role:
                        form.role.trim(),

                    assigned_date:
                        form.assigned_date
                }
            );

            console.log(
                "Assign Member Response:",
                res.data
            );

            toast.success(
                res.data.message ||
                "Member Assigned Successfully"
            );

            // Refresh members table
            await refresh();

            // Close modal
            handleClose();

            // Clear form
            setForm({
                project_id: "",
                employee_id: "",
                role: "",
                assigned_date: ""
            });

        } catch (err) {

            console.log(
                "Assign Member Error:",
                err
            );

            toast.error(
                err.response?.data?.message ||
                "Failed to assign member"
            );

        }

    };

    return (

        <Modal
            show={show}
            onHide={handleClose}
            centered
        >

            <Modal.Header closeButton>

                <Modal.Title>
                    Assign Member
                </Modal.Title>

            </Modal.Header>

            <Form onSubmit={handleSubmit}>

                <Modal.Body>

                    {/* ===============================
                        Project
                    =============================== */}

                    <Form.Group className="mb-3">

                        <Form.Label>
                            Project
                        </Form.Label>

                        <Form.Select
                            name="project_id"
                            value={form.project_id}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Project
                            </option>

                            {projects.map(
                                (project) => (

                                    <option
                                        key={
                                            project.project_id
                                        }
                                        value={
                                            project.project_id
                                        }
                                    >

                                        {
                                            project.project_name
                                        }

                                    </option>

                                )
                            )}

                        </Form.Select>

                    </Form.Group>

                    {/* ===============================
                        Employee
                    =============================== */}

                    <Form.Group className="mb-3">

                        <Form.Label>
                            Employee
                        </Form.Label>

                        <Form.Select
                            name="employee_id"
                            value={form.employee_id}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Employee
                            </option>

                            {employees.map(
                                (employee) => (

                                    <option
                                        key={
                                            employee.employee_id
                                        }
                                        value={
                                            employee.employee_id
                                        }
                                    >

                                        {
                                            employee.employee_name
                                        }

                                    </option>

                                )
                            )}

                        </Form.Select>

                    </Form.Group>

                    {/* ===============================
                        Role
                    =============================== */}

                    <Form.Group className="mb-3">

                        <Form.Label>
                            Role
                        </Form.Label>

                        <Form.Control
                            type="text"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            placeholder="Enter Project Role"
                        />

                    </Form.Group>

                    {/* ===============================
                        Assigned Date
                    =============================== */}

                    <Form.Group className="mb-3">

                        <Form.Label>
                            Assigned Date
                        </Form.Label>

                        <Form.Control
                            type="date"
                            name="assigned_date"
                            value={
                                form.assigned_date
                            }
                            onChange={handleChange}
                            required
                        />

                    </Form.Group>

                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="secondary"
                        type="button"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="primary"
                        type="submit"
                    >
                        Assign Member
                    </Button>

                </Modal.Footer>

            </Form>

        </Modal>

    );

}

export default AddMemberModal;
