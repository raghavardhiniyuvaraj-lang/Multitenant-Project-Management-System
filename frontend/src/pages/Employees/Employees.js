import { useEffect, useState } from "react";
import { Button, Table, Card } from "react-bootstrap";

import MainLayout from "../../layouts/MainLayout";
import { toast } from "react-toastify";
import api from "../../services/api";

import AddEmployeeModal from "./AddEmployeeModal";
import EditEmployeeModal from "./EditEmployeeModal";

import "./Employees.css";

function Employees() {

    const [employees, setEmployees] = useState([]);

    const [showAdd, setShowAdd] = useState(false);

    const [showEdit, setShowEdit] = useState(false);

    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {

        fetchEmployees();

    }, []);

    const fetchEmployees = async () => {

        try {

            const res = await api.get("/employees");

            setEmployees(res.data.employees);

        } catch (err) {

            console.log(err);

        }

    };

    const deleteEmployee = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this employee?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/employees/${id}`);

            toast.success("Employee Deleted Successfully");

            fetchEmployees();

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Delete Failed"
            );

        }

    };

    return (

        
            <MainLayout>

<div className="page-header">
    <h2>👨‍💼 Employees</h2>
    <p>Manage employee information and roles.</p>
</div>

{/* Employee Table */}




            <Card className="shadow-sm">
                <Card.Body>

                    <div className="department-header">

                        <h3>Employees</h3>

                        <Button
                            onClick={() => setShowAdd(true)}
                        >
                            + Add Employee
                        </Button>

                    </div>

                    <Table striped bordered hover>

                        <thead>

                            <tr>

                                <th>ID</th>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Designation</th>
                                <th>Salary</th>
                                <th>Status</th>
                                <th>Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {employees.map((emp) => (

                                <tr key={emp.employee_id}>

                                    <td>{emp.employee_id}</td>

                                    <td>{emp.employee_name}</td>

                                    <td>{emp.department_name}</td>

                                    <td>{emp.email}</td>

                                    <td>{emp.phone}</td>

                                    <td>{emp.designation}</td>

                                    <td>

₹{Number(emp.salary).toLocaleString("en-IN")} </td>

<td>

    <span
        className={
            emp.status === "Active"
                ? "badge bg-success"
                : "badge bg-danger"
        }
    >

        {emp.status}

    </span>

</td>

                                    <td>

                                       <Button
    className="theme-btn action-btn"
    onClick={() => {
        setSelectedEmployee(emp);
        setShowEdit(true);
    }}
>
    Edit
</Button>

{" "}

<Button
    variant="danger"
    className="action-btn"
    onClick={() => deleteEmployee(emp.employee_id)}
>
    Delete
</Button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </Table>

                </Card.Body>

            </Card>

            <AddEmployeeModal

                show={showAdd}

                handleClose={() => setShowAdd(false)}

                refresh={fetchEmployees}

            />

            <EditEmployeeModal

                show={showEdit}

                handleClose={() => setShowEdit(false)}

                refresh={fetchEmployees}

                employee={selectedEmployee}

            />

        </MainLayout>

    );

}

export default Employees;
