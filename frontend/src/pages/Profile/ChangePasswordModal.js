import { useState } from "react";
import {
    Modal,
    Button,
    Form,
    InputGroup
} from "react-bootstrap";

import {
    EyeFill,
    EyeSlashFill
} from "react-bootstrap-icons";

import { toast } from "react-toastify";
import api from "../../services/api";

function ChangePasswordModal({

    show,
    handleClose

}) {

    const [formData, setFormData] = useState({

        currentPassword: "",
        newPassword: "",
        confirmPassword: ""

    });

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");

   const handleChange = (e) => {

    setFormData({

        ...formData,
        [e.target.name]: e.target.value

    });

    if (e.target.name === "newPassword") {

        checkPasswordStrength(e.target.value);

    }

};
    const checkPasswordStrength = (password) => {

    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2)
        setPasswordStrength("Weak");

    else if (strength <= 4)
        setPasswordStrength("Medium");

    else
        setPasswordStrength("Strong");

};

    const handleSubmit = async () => {

        if (
            formData.newPassword !==
            formData.confirmPassword
        ) {

            toast.error(
                "New Password and Confirm Password do not match"
            );

            return;

        }

        try {

            const res = await api.put(

                "/profile/change-password",

                {

                    currentPassword:
                        formData.currentPassword,

                    newPassword:
                        formData.newPassword

                }

            );

            toast.success(res.data.message);

            setFormData({

                currentPassword: "",
                newPassword: "",
                confirmPassword: ""

            });

            handleClose();

        }

        catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Failed to change password"

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

                    🔒 Change Password

                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                {/* Current Password */}

                <Form.Group className="mb-3">

                    <Form.Label>

                        Current Password

                    </Form.Label>

                    <InputGroup>

                        <Form.Control

                            type={
                                showCurrent
                                    ? "text"
                                    : "password"
                            }

                            name="currentPassword"

                            value={formData.currentPassword}

                            onChange={handleChange}

                        />

                        <Button
                            variant="outline-secondary"
                            onClick={() =>
                                setShowCurrent(!showCurrent)
                            }
                        >

                            {showCurrent
                                ? <EyeSlashFill />
                                : <EyeFill />}

                        </Button>

                    </InputGroup>

                </Form.Group>

                {/* New Password */}

                <Form.Group className="mb-3">

                    <Form.Label>

                        New Password

                    </Form.Label>

                    <InputGroup>

                        <Form.Control

                            type={
                                showNew
                                    ? "text"
                                    : "password"
                            }

                            name="newPassword"

                            value={formData.newPassword}

                            onChange={handleChange}

                        />

                        <Button
                            variant="outline-secondary"
                            onClick={() =>
                                setShowNew(!showNew)
                            }
                        >

                            {showNew
                                ? <EyeSlashFill />
                                : <EyeFill />}

                        </Button>

                    </InputGroup>

                </Form.Group>

                {formData.newPassword && (

    <div className="mt-3">

        <small className="fw-bold">

            Password Strength :
            <span
                className={
                    passwordStrength === "Weak"
                        ? "text-danger"
                        : passwordStrength === "Medium"
                        ? "text-warning"
                        : "text-success"
                }
            >
                {" "}
                {passwordStrength}
            </span>

        </small>

        <div
            className="progress mt-2"
            style={{ height: "8px" }}
        >

            <div

                className={
                    passwordStrength === "Weak"
                        ? "progress-bar bg-danger"
                        : passwordStrength === "Medium"
                        ? "progress-bar bg-warning"
                        : "progress-bar bg-success"
                }

                role="progressbar"

                style={{
                    width:
                        passwordStrength === "Weak"
                            ? "33%"
                            : passwordStrength === "Medium"
                            ? "66%"
                            : "100%"
                }}

            ></div>

        </div>

    </div>

)}
                {/* Confirm Password */}

                <Form.Group>

                    <Form.Label>

                        Confirm Password

                    </Form.Label>

                    <InputGroup>

                        <Form.Control

                            type={
                                showConfirm
                                    ? "text"
                                    : "password"
                            }

                            name="confirmPassword"

                            value={formData.confirmPassword}

                            onChange={handleChange}

                        />

                        <Button
                            variant="outline-secondary"
                            onClick={() =>
                                setShowConfirm(!showConfirm)
                            }
                        >

                            {showConfirm
                                ? <EyeSlashFill />
                                : <EyeFill />}

                        </Button>

                    </InputGroup>

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
                    onClick={handleSubmit}
                >

                    Change Password

                </Button>

            </Modal.Footer>

        </Modal>

    );

}

export default ChangePasswordModal;