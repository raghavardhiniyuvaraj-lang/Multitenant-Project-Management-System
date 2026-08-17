import { useEffect, useState } from "react";
import { Card, Table, Button } from "react-bootstrap";

import MainLayout from "../../layouts/MainLayout";

import api from "../../services/api";
import AddMemberModal from "./AddMemberModal";
import EditMemberModal from "./EditMemberModal";

function Members() {

    const [members, setMembers] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {

        try {

            const res = await api.get("/project-members");

            setMembers(res.data.members);

        } catch (err) {

            console.log(err);

        }

    };
const handleEdit = (member) => {
    setSelectedMember(member);
    setShowEdit(true);
};
const deleteMember = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to remove this member?"
    );

    if (!confirmDelete) return;

    try {

        await api.delete(`/project-members/${id}`);

        fetchMembers();

        alert("Member deleted successfully");

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
    <h2>👥 Project Members</h2>
    <p>Assign employees to projects.</p>
</div>

{/* Members Table */}



            <Card className="shadow-sm">

                <Card.Body>

                    <div className="d-flex justify-content-between mb-3">

                        <h3>Project Members</h3>

                        <Button
                            onClick={() => setShowAdd(true)}
                        >
                            + Assign Member
                        </Button>

                    </div>

                    <Table striped bordered hover responsive>

                        <thead>

                            <tr>

                                <th>ID</th>
                                <th>Project</th>
                                <th>Employee</th>
                                <th>Role</th>
                                <th>Assigned Date</th>
                                <th>Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {members.length === 0 ? (

                                <tr>

                                    <td colSpan="6" className="text-center">

                                        No Members Assigned

                                    </td>

                                </tr>

                            ) : (

                                members.map((member) => (

                                    <tr key={member.member_id}>

                                        <td>{member.member_id}</td>

                                        <td>{member.project_name}</td>

                                        <td>{member.employee_name}</td>

                                        <td>{member.role}</td>

                                        <td>
                                            {new Date(member.assigned_date).toLocaleDateString()}
                                        </td>

                                        <td>

                                            <Button
    className="theme-btn action-btn"
    onClick={() => {
    setSelectedMember(member);
    setShowEdit(true);
}}
>
    Edit
</Button>
                                           <Button
    variant="danger"
    className="action-btn"
    onClick={() => deleteMember(member.member_id)}
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

            <AddMemberModal
                show={showAdd}
                handleClose={() => setShowAdd(false)}
                refresh={fetchMembers}
            />
            <EditMemberModal
    show={showEdit}
    handleClose={() => setShowEdit(false)}
    refresh={fetchMembers}
    member={selectedMember}
/>

        </MainLayout>

    );

}

export default Members;