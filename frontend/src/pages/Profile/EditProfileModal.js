import { useEffect, useState } from "react";
import {
Modal,
Button,
Form,
Row,
Col
} from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../../services/api";
import "./EditProfileModal.css";

function EditProfileModal({
show,
handleClose,
user,
refresh
}) {

const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: ""
});

const [loading, setLoading] = useState(false);

useEffect(() => {

    if (user) {

        setFormData({
            username: user.username || "",
            email: user.email || "",
            phone: user.phone || ""
        });

    }

}, [user, show]);

const handleChange = (e) => {

    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });

};

const handleSubmit = async (e) => {

    e.preventDefault();

    if (!formData.username.trim()) {

        toast.error("Username is required");
        return;

    }

    if (!formData.email.trim()) {

        toast.error("Email is required");
        return;

    }

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {

        toast.error("Please enter a valid email address");
        return;

    }

    if (
        formData.phone &&
        !/^[0-9]{10}$/.test(formData.phone)
    ) {

        toast.error("Phone number must contain 10 digits");
        return;

    }

    try {

        setLoading(true);

        const res = await api.put(
            "/profile",
            {
                username: formData.username.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim()
            }
        );

        toast.success(
            res.data.message ||
            "Profile updated successfully"
        );

        await refresh();

        handleClose();

    }

    catch (err) {

        console.log("Update Profile Error:", err);

        toast.error(
            err.response?.data?.message ||
            "Failed to update profile"
        );

    }

    finally {

        setLoading(false);

    }

};

return (

   <Modal
    show={show}
    onHide={handleClose}
    centered
    className="edit-profile-modal"
>

        <Form onSubmit={handleSubmit}>

            <Modal.Header closeButton>

                <Modal.Title>
                    ✏️ Edit Profile
                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                <Row>

                    <Col md={12}>

                        <Form.Group className="mb-3">

                            <Form.Label>
                                Username
                            </Form.Label>

                            <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                            />

                        </Form.Group>

                    </Col>

                </Row>

                <Row>

                    <Col md={12}>

                        <Form.Group className="mb-3">

                            <Form.Label>
                                Email
                            </Form.Label>

                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                            />

                        </Form.Group>

                    </Col>

                </Row>

                <Row>

                    <Col md={12}>

                        <Form.Group className="mb-2">

                            <Form.Label>
                                Phone Number
                            </Form.Label>

                            <Form.Control
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter 10-digit phone number"
                                maxLength={10}
                            />

                            <Form.Text className="text-muted">
                                Enter a valid 10-digit mobile number.
                            </Form.Text>

                        </Form.Group>

                    </Col>

                </Row>

            </Modal.Body>

            <Modal.Footer>

                <Button
                    variant="secondary"
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Saving..."
                        : "Save Changes"}

                </Button>

            </Modal.Footer>

        </Form>

    </Modal>

);

}

export default EditProfileModal;
