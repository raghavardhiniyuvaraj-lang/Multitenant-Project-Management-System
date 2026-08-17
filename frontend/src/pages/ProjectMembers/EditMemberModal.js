import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../../services/api";

function EditMemberModal({
    show,
    handleClose,
    refresh,
    member
}) {

    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [formData, setFormData] = useState({
        project_id: "",
        employee_id: "",
        role: "",
        assigned_date: ""
    });

    // ===============================
    // Fetch Projects & Employees
    // ===============================
    useEffect(() => {

        if (show) {
            fetchProjects();
            fetchEmployees();
        }

    }, [show]);

    // ===============================
    // Load Selected Member
    // ===============================
    useEffect(() => {

        if (member) {

            setFormData({
                project_id: member.project_id
                    ? String(member.project_id)
                    : "",

                employee_id: member.employee_id
                    ? String(member.employee_id)
                    : "",

                role: member.role || "",

                assigned_date: member.assigned_date
                    ? member.assigned_date.substring(0, 10)
                    : ""
            });

        }

    }, [member]);

    // ===============================
    // Fetch Projects
    // ===============================
    const fetchProjects = async () => {

        try {

            const res = await api.get("/projects");

            setProjects(res.data.projects || []);

        } catch (err) {

            console.log("Project Error:", err);

            toast.error("Failed to load projects");

        }

    };

    // ===============================
    // Fetch Employees
    // ===============================
    const fetchEmployees = async () => {

        try {

            const res = await api.get("/employees");

            setEmployees(res.data.employees || []);

        } catch (err) {

            console.log("Employee Error:", err);

            toast.error("Failed to load employees");

        }

    };

    // ===============================
    // Handle Input Change
    // ===============================
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };

    // ===============================
    // Update Member
    // ===============================
    const handleSubmit = async (e) => {
e.preventDefault();

if (!formData.project_id) {
    toast.error("Project is required");
    return;
}

if (!formData.employee_id) {
    toast.error("Employee is required");
    return;
}

if (!formData.assigned_date) {
    toast.error("Assigned Date is required");
    return;
}

if (!member || !member.member_id) {
    toast.error("Member ID not found");
    return;
}

try {

    const response = await api.put(
        `/project-members/${member.member_id}`,
        {
            project_id: Number(formData.project_id),
            employee_id: Number(formData.employee_id),
            role: formData.role.trim(),
            assigned_date: formData.assigned_date
        }
    );

    console.log("UPDATE SUCCESS:", response.data);

    toast.success("Member Updated Successfully");

    refresh();

    handleClose();

} catch (err) {

    console.log("========== UPDATE MEMBER ERROR ==========");
    console.log("Status:", err.response?.status);
    console.log("Response:", err.response?.data);
    console.log("Full Error:", err);

    toast.error(
        err.response?.data?.message ||
        "Update Failed"
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
                    Edit Project Member
                </Modal.Title>

            </Modal.Header>

            <Form onSubmit={handleSubmit}>

                <Modal.Body>

                    {/* ================= PROJECT ================= */}

                    <Form.Group className="mb-3">

                        <Form.Label>
                            Project
                        </Form.Label>

                        <Form.Select
                            name="project_id"
                            value={formData.project_id}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Project
                            </option>

                            {projects.map((project) => (

                                <option
                                    key={project.project_id}
                                    value={project.project_id}
                                >

                                    {project.project_name}

                                </option>

                            ))}

                        </Form.Select>

                    </Form.Group>


                    {/* ================= EMPLOYEE ================= */}

                    <Form.Group className="mb-3">

                        <Form.Label>
                            Employee
                        </Form.Label>

                        <Form.Select
                            name="employee_id"
                            value={formData.employee_id}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Employee
                            </option>

                            {employees.map((employee) => (

                                <option
                                    key={employee.employee_id}
                                    value={employee.employee_id}
                                >

                                    {employee.employee_name}

                                </option>

                            ))}

                        </Form.Select>

                    </Form.Group>


                    {/* ================= ROLE ================= */}

                    <Form.Group className="mb-3">

                        <Form.Label>
                            Role
                        </Form.Label>

                        <Form.Control
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            placeholder="Enter Project Role"
                        />

                    </Form.Group>


                    {/* ================= ASSIGNED DATE ================= */}

                    <Form.Group className="mb-3">

                        <Form.Label>
                            Assigned Date
                        </Form.Label>

                        <Form.Control
                            type="date"
                            name="assigned_date"
                            value={formData.assigned_date}
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
                        Update Member
                    </Button>

                </Modal.Footer>

            </Form>

        </Modal>

    );

}

export default EditMemberModal;