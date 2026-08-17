import { useEffect, useState } from "react";
import { Button, Table, Card } from "react-bootstrap";

import MainLayout from "../../layouts/MainLayout";
import { toast } from "react-toastify";
import api from "../../services/api";

import AddDepartmentModal from "./AddDepartmentModal";
import EditDepartmentModal from "./EditDepartmentModal";

import "./Departments.css";

function Departments() {

    const [departments, setDepartments] = useState([]);

    const [showAdd, setShowAdd] = useState(false);

    const [showEdit, setShowEdit] = useState(false);

    const [selectedDepartment, setSelectedDepartment] = useState(null);

    useEffect(() => {

        fetchDepartments();

    }, []);

    // ===============================
    // Fetch Departments
    // ===============================
    const fetchDepartments = async () => {

        try {

            const res = await api.get("/departments");

            setDepartments(res.data.departments);

        }catch (err) {
    toast.error(
        err.response?.data?.message ||
        "Failed to load departments"
    );
}

    };

    // ===============================
    // Delete Department
    // ===============================
    const deleteDepartment = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this department?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/departments/${id}`);

            toast.success("Department Deleted Successfully");

            fetchDepartments();

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
    <h2>🏢 Departments</h2>
    <p>Manage your company departments.</p>
</div>

{/* Department Table */}



<Card className="shadow-sm">

                <Card.Body>

                    <div className="department-header">

                        <h3>Departments</h3>

                        <Button
                            onClick={() => setShowAdd(true)}
                        >
                            + Add Department
                        </Button>

                    </div>
                    <div className="table-responsive">

                    <Table striped bordered hover>

                        <thead>

                            <tr>

                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Created</th>
                                <th>Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {departments.map((dept) => (

                                <tr key={dept.department_id}>

                                    <td>{dept.department_id}</td>

                                    <td>{dept.department_name}</td>

                                    <td>{dept.description}</td>

                                    <td>
                                        {new Date(dept.created_at).toLocaleDateString()}
                                    </td>

                                    <td>

                                        <Button
    className="theme-btn action-btn"
    onClick={() => {
        setSelectedDepartment(dept);
        setShowEdit(true);
    }}
>
    Edit
</Button>

{" "}

<Button
    variant="danger"
    className="action-btn"
    onClick={() => deleteDepartment(dept.department_id)}
>
    Delete
</Button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </Table>
                    </div>

                </Card.Body>

            </Card>

            <AddDepartmentModal

                show={showAdd}

                handleClose={() => setShowAdd(false)}

                refresh={fetchDepartments}

            />

            <EditDepartmentModal

                show={showEdit}

                handleClose={() => setShowEdit(false)}

                refresh={fetchDepartments}

                department={selectedDepartment}

            />

        </MainLayout>

    );

}

export default Departments;