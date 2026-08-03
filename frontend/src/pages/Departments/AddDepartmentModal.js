import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import api from "../../services/api";

function AddDepartmentModal({ show, handleClose, refresh }) {

    const [departmentName, setDepartmentName] = useState("");
    const [description, setDescription] = useState("");

    const saveDepartment = async () => {

        try {

            await api.post("/departments", {
                department_name: departmentName,
                description: description
            });

            toast.success("Department Added Successfully");

            setDepartmentName("");
            setDescription("");

            refresh();

            handleClose();

        } catch (err) {

            toast.error(
                err.response?.data?.message || "Something went wrong"
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
                    Add Department
                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                <Form>

                    <Form.Group className="mb-3">

                        <Form.Label>
                            Department Name
                        </Form.Label>

                        <Form.Control
                            type="text"
                            placeholder="Enter Department Name"
                            value={departmentName}
                            onChange={(e) =>
                                setDepartmentName(e.target.value)
                            }
                        />

                    </Form.Group>

                    <Form.Group>

                        <Form.Label>
                            Description
                        </Form.Label>

                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter Description"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
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
                    onClick={saveDepartment}
                >
                    Save
                </Button>

            </Modal.Footer>

        </Modal>

    );

}

export default AddDepartmentModal;