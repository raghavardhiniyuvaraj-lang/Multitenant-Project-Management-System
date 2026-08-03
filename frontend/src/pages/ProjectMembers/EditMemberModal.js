import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../../services/api";

function EditMemberModal({
    show,
    handleClose,
    refresh,
    member
}) {

    const [role, setRole] = useState("");

    useEffect(() => {

        if (member) {
            setRole(member.role);
        }

    }, [member]);

    const handleUpdate = async () => {

        try {

            await api.put(
                `/project-members/${member.member_id}`,
                {
                    project_id: member.project_id,
                    employee_id: member.employee_id,
                    role: role,
                    assigned_date: member.assigned_date
                }
            );

            toast.success("Member Updated Successfully");

            refresh();

            handleClose();

        } catch (err) {

            toast.error(
    err.response?.data?.message || "Something went wrong"
);

        }

    };

    return (

        <Modal show={show} onHide={handleClose}>

            <Modal.Header closeButton>

                <Modal.Title>

                    Edit Member

                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                <Form.Group>

                    <Form.Label>Role</Form.Label>

                    <Form.Control
                        type="text"
                        value={role}
                        onChange={(e) =>
                            setRole(e.target.value)
                        }
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
                    onClick={handleUpdate}
                >
                    Update
                </Button>

            </Modal.Footer>

        </Modal>

    );

}

export default EditMemberModal;