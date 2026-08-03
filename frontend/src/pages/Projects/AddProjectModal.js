import { useState } from "react";
import { toast } from "react-toastify";
import { Modal, Button, Form } from "react-bootstrap";

import api from "../../services/api";

function AddProjectModal({ show, handleClose, refresh }) {

    const [projectName, setProjectName] = useState("");

    const [description, setDescription] = useState("");

    const [startDate, setStartDate] = useState("");

    const [endDate, setEndDate] = useState("");

    const [status, setStatus] = useState("Active");

    const handleSubmit = async () => {

        try {

            await api.post("/projects", {

                project_name: projectName,

                description,

                start_date: startDate,

                end_date: endDate,

                status

            });

            toast.success("Project Added Successfully");

            refresh();

            handleClose();

            // Clear Form
            setProjectName("");
            setDescription("");
            setStartDate("");
            setEndDate("");
            setStatus("Active");

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

                    Add Project

                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                <Form>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Project Name

                        </Form.Label>

                        <Form.Control
                            value={projectName}
                            onChange={(e) =>
                                setProjectName(e.target.value)
                            }
                            placeholder="Enter Project Name"
                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Description

                        </Form.Label>

                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            placeholder="Enter Description"
                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Start Date

                        </Form.Label>

                        <Form.Control
                            type="date"
                            value={startDate}
                            onChange={(e) =>
                                setStartDate(e.target.value)
                            }
                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            End Date

                        </Form.Label>

                        <Form.Control
                            type="date"
                            value={endDate}
                            onChange={(e) =>
                                setEndDate(e.target.value)
                            }
                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Status

                        </Form.Label>

                        <Form.Select
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }
                        >

                            <option value="Active">
                                Active
                            </option>

                            <option value="Completed">
                                Completed
                            </option>

                            <option value="On Hold">
                                On Hold
                            </option>

                        </Form.Select>

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

                    Save Project

                </Button>

            </Modal.Footer>

        </Modal>

    );

}

export default AddProjectModal;