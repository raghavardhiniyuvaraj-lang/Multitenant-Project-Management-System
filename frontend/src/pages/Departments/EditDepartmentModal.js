import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../../services/api";

function EditDepartmentModal({
    show,
    handleClose,
    refresh,
    department
}) {

    const [departmentName, setDepartmentName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {

        if (department) {

            setDepartmentName(department.department_name);
            setDescription(department.description);

        }

    }, [department]);

    const updateDepartment = async () => {

        try {

            await api.put(
                `/departments/${department.department_id}`,
                {
                    department_name: departmentName,
                    description: description
                }
            );

            toast.success("Department Updated Successfully");

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

                    Edit Department

                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                <Form>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Department Name

                        </Form.Label>

                        <Form.Control
                            value={departmentName}
                            onChange={(e)=>
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
                            value={description}
                            onChange={(e)=>
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
                    variant="success"
                    onClick={updateDepartment}
                >
                    Update
                </Button>

            </Modal.Footer>

        </Modal>

    );

}

export default EditDepartmentModal;