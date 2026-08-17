import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../../services/api";

function EditEmployeeModal({
    show,
    handleClose,
    refresh,
    employee
}) {

    const [departments, setDepartments] = useState([]);

    const [departmentId, setDepartmentId] = useState("");
    const [employeeName, setEmployeeName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [designation, setDesignation] = useState("");
    const [salary, setSalary] = useState("");

    useEffect(() => {

        if (show) {
            fetchDepartments();
        }

    }, [show]);

    useEffect(() => {

        if (employee) {

            setDepartmentId(employee.department_id);
            setEmployeeName(employee.employee_name);
            setEmail(employee.email);
            setPhone(employee.phone);
            setDesignation(employee.designation);
            setSalary(employee.salary);

        }

    }, [employee]);

    const fetchDepartments = async () => {

        try {

            const res = await api.get("/departments");
            setDepartments(res.data.departments);

        } catch (err) {

            console.log(err);

        }

    };

    const handleSubmit = async () => {

    // Validation
    if (!departmentId) {
        toast.error("Please select a department");
        return;
    }

    if (!employeeName.trim()) {
        toast.error("Employee name is required");
        return;
    }

    if (!email.trim()) {
        toast.error("Email is required");
        return;
    }

    if (salary !== "" && Number(salary) < 0) {
        toast.error("Salary cannot be negative");
        return;
    }

    try {

        await api.put(`/employees/${employee.employee_id}`, {

            department_id: departmentId,
            employee_name: employeeName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            designation: designation.trim(),
            salary: salary || null

        });

        toast.success("Employee Updated Successfully");

        refresh();
        handleClose();

    } catch (err) {

        toast.error(
            err.response?.data?.message ||
            "Update Failed"
        );

    }

};
    return (

        <Modal show={show} onHide={handleClose}>

            <Modal.Header closeButton>
                <Modal.Title>Edit Employee</Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <Form>

                    <Form.Group className="mb-3">

                        <Form.Label>Department</Form.Label>

                        <Form.Select
    value={departmentId}
    onChange={(e) => setDepartmentId(e.target.value)}
    required
>

                            <option value="">
                                Select Department
                            </option>

                            {departments.map((dept) => (

                                <option
                                    key={dept.department_id}
                                    value={dept.department_id}
                                >
                                    {dept.department_name}
                                </option>

                            ))}

                        </Form.Select>

                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Employee Name</Form.Label>
                        <Form.Control
    value={employeeName}
    onChange={(e) => setEmployeeName(e.target.value)}
    required
/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
    type="tel"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Designation</Form.Label>
                        <Form.Control
                            value={designation}
                            onChange={(e)=>setDesignation(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Salary</Form.Label>
                        <Form.Control
    type="number"
    min="0"
    value={salary}
    onChange={(e) => setSalary(e.target.value)}
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
                    onClick={handleSubmit}
                >
                    Update Employee
                </Button>

            </Modal.Footer>

        </Modal>

    );

}

export default EditEmployeeModal;