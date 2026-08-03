import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import api from "../../services/api";

function EditProfileModal({
    show,
    handleClose,
    user,
    refresh
}) {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {

        if (user) {

            setUsername(user.username || "");
            setEmail(user.email || "");
            setPhone(user.phone || "");

        }

    }, [user]);

    const handleSubmit = async () => {

        try {

            await api.put("/profile", {
                username,
                email,
                phone
            });

            toast.success(
                "Profile updated successfully"
            );

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

        <Modal
            show={show}
            onHide={handleClose}
            centered
        >

            <Modal.Header closeButton>

                <Modal.Title>

                    Edit Profile

                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                <Form>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Username

                        </Form.Label>

                        <Form.Control
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Email

                        </Form.Label>

                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                    </Form.Group>

                    <Form.Group>

                        <Form.Label>

                            Phone

                        </Form.Label>

                        <Form.Control
                            value={phone}
                            onChange={(e) =>
                                setPhone(e.target.value)
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
                    onClick={handleSubmit}
                >

                    Save Changes

                </Button>

            </Modal.Footer>

        </Modal>

    );

}

export default EditProfileModal;