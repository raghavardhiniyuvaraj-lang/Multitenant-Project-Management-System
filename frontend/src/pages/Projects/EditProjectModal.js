import { useEffect, useState } from "react";
import {
    Modal,
    Button,
    Form
} from "react-bootstrap";
import { toast } from "react-toastify";

import api from "../../services/api";

function EditProjectModal({
    show,
    handleClose,
    refresh,
    project
}) {

    const [formData, setFormData] = useState({
        project_name: "",
        description: "",
        start_date: "",
        end_date: "",
        status: "Active"
    });

    useEffect(() => {

        if (project) {

            setFormData({
                project_name: project.project_name || "",
                description: project.description || "",
                start_date: project.start_date
                    ? project.start_date.substring(0, 10)
                    : "",
                end_date: project.end_date
                    ? project.end_date.substring(0, 10)
                    : "",
                status: project.status || "Active"
            });

        }

    }, [project]);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

const updateProject = async () => {

    // Project name validation
    if (!formData.project_name.trim()) {
        toast.error("Project Name is required");
        return;
    }

    // Date validation
    if (!formData.start_date) {
        toast.error("Start Date is required");
        return;
    }

    if (!formData.end_date) {
        toast.error("End Date is required");
        return;
    }

    // Check date order
    if (
        new Date(formData.start_date) >
        new Date(formData.end_date)
    ) {
        toast.error("End date cannot be before start date");
        return;
    }

    try {

        await api.put(
            `/projects/${project.project_id}`,
            {
                ...formData,
                project_name: formData.project_name.trim(),
                description: formData.description.trim()
            }
        );

        toast.success("Project Updated Successfully");

        refresh();

        handleClose();

    } catch (err) {

        toast.error(
            err.response?.data?.message ||
            "Something went wrong"
        );

    }

};
    return (

        <Modal
            show={show}
            onHide={handleClose}
        >

            <Modal.Header closeButton>

                <Modal.Title>
                    Edit Project
                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                <Form>

                    <Form.Group className="mb-3">

                        <Form.Label>
                            Project Name
                        </Form.Label>

                        <Form.Control
    type="text"
    name="project_name"
    value={formData.project_name}
    onChange={handleChange}
    placeholder="Enter Project Name"
    required
/>

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>
                            Description
                        </Form.Label>

                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>
                            Start Date
                        </Form.Label>

                    <Form.Control
    type="date"
    name="start_date"
    value={formData.start_date}
    onChange={handleChange}
    required
/>

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>
                            End Date
                        </Form.Label>

                        <Form.Control
    type="date"
    name="end_date"
    value={formData.end_date}
    onChange={handleChange}
    required
/>

                    </Form.Group>

                    <Form.Group>

                        <Form.Label>Status</Form.Label>

                        <Form.Select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >

                            <option>Active</option>
                            <option>Completed</option>
                            <option>On Hold</option>

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
                    onClick={updateProject}
                >
                    Update Project
                </Button>

            </Modal.Footer>

        </Modal>

    );

}

export default EditProjectModal;