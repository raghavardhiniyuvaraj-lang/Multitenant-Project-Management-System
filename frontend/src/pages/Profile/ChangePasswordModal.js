import { useState } from "react";
import {
Modal,
Button,
Form,
InputGroup
} from "react-bootstrap";

import {
EyeFill,
EyeSlashFill,
CheckCircleFill,
XCircleFill
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

const [loading, setLoading] = useState(false);

// =====================================
// Password Strength
// =====================================

const checkPasswordStrength = (password) => {

    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (!password) {
        setPasswordStrength("");
    }
    else if (strength <= 2) {
        setPasswordStrength("Weak");
    }
    else if (strength <= 4) {
        setPasswordStrength("Medium");
    }
    else {
        setPasswordStrength("Strong");
    }
};

// =====================================
// Handle Input
// =====================================

const handleChange = (e) => {

    const {
        name,
        value
    } = e.target;

    setFormData((prev) => ({
        ...prev,
        [name]: value
    }));

    if (name === "newPassword") {

        checkPasswordStrength(value);

    }

};

// =====================================
// Password Validation
// =====================================

const isPasswordValid = () => {

    const password = formData.newPassword;

    return (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password)
    );

};

// =====================================
// Close + Reset
// =====================================

const closeModal = () => {

    setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);

    setPasswordStrength("");

    setLoading(false);

    handleClose();

};

// =====================================
// Submit
// =====================================

const handleSubmit = async () => {

    if (!formData.currentPassword) {

        toast.error("Please enter your current password");
        return;

    }

    if (!formData.newPassword) {

        toast.error("Please enter a new password");
        return;

    }

    if (!isPasswordValid()) {

        toast.error(
            "Password must contain at least 8 characters, uppercase, lowercase, number and special character"
        );

        return;

    }

    if (!formData.confirmPassword) {

        toast.error("Please confirm your new password");
        return;

    }

    if (
        formData.newPassword !==
        formData.confirmPassword
    ) {

        toast.error(
            "New Password and Confirm Password do not match"
        );

        return;

    }

    if (
        formData.currentPassword ===
        formData.newPassword
    ) {

        toast.error(
            "New password must be different from current password"
        );

        return;

    }

    try {

        setLoading(true);

        const res = await api.put(
            "/profile/change-password",
            {
                currentPassword:
                    formData.currentPassword,

                newPassword:
                    formData.newPassword
            }
        );

        toast.success(
            res.data.message ||
            "Password changed successfully"
        );

        closeModal();

    }
    catch (err) {

        console.log(
            "Change Password Error:",
            err
        );

        toast.error(
            err.response?.data?.message ||
            "Failed to change password"
        );

        setLoading(false);

    }

};

// =====================================
// Strength Color
// =====================================

const getStrengthClass = () => {

    if (passwordStrength === "Weak")
        return "text-danger";

    if (passwordStrength === "Medium")
        return "text-warning";

    if (passwordStrength === "Strong")
        return "text-success";

    return "";

};

const getProgressWidth = () => {

    if (passwordStrength === "Weak")
        return "33%";

    if (passwordStrength === "Medium")
        return "66%";

    if (passwordStrength === "Strong")
        return "100%";

    return "0%";

};

// =====================================
// Requirement Helper
// =====================================

const Requirement = ({
    valid,
    children
}) => {

    return (

        <div
            className={
                valid
                    ? "text-success"
                    : "text-muted"
            }
            style={{
                fontSize: "13px"
            }}
        >

            {valid ? (
                <CheckCircleFill className="me-1" />
            ) : (
                <XCircleFill className="me-1" />
            )}

            {children}

        </div>

    );

};

return (

    <Modal
        show={show}
        onHide={closeModal}
        centered
        backdrop="static"
    >

        <Modal.Header closeButton>

            <Modal.Title>
                🔒 Change Password
            </Modal.Title>

        </Modal.Header>

        <Modal.Body>

            {/* =========================
                CURRENT PASSWORD
            ========================= */}

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
                        value={
                            formData.currentPassword
                        }
                        onChange={handleChange}
                        placeholder="Enter current password"
                        disabled={loading}
                    />

                    <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={() =>
                            setShowCurrent(
                                !showCurrent
                            )
                        }
                        disabled={loading}
                        aria-label={
                            showCurrent
                                ? "Hide password"
                                : "Show password"
                        }
                    >

                        {showCurrent ? (
                            <EyeSlashFill />
                        ) : (
                            <EyeFill />
                        )}

                    </Button>

                </InputGroup>

            </Form.Group>


            {/* =========================
                NEW PASSWORD
            ========================= */}

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
                        value={
                            formData.newPassword
                        }
                        onChange={handleChange}
                        placeholder="Enter new password"
                        disabled={loading}
                    />

                    <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={() =>
                            setShowNew(
                                !showNew
                            )
                        }
                        disabled={loading}
                        aria-label={
                            showNew
                                ? "Hide password"
                                : "Show password"
                        }
                    >

                        {showNew ? (
                            <EyeSlashFill />
                        ) : (
                            <EyeFill />
                        )}

                    </Button>

                </InputGroup>

            </Form.Group>


            {/* =========================
                PASSWORD STRENGTH
            ========================= */}

            {formData.newPassword && (

                <div className="mb-3">

                    <div className="d-flex justify-content-between">

                        <small className="fw-semibold">

                            Password Strength

                        </small>

                        <small
                            className={
                                `fw-bold ${getStrengthClass()}`
                            }
                        >

                            {passwordStrength}

                        </small>

                    </div>

                    <div
                        className="progress mt-2"
                        style={{
                            height: "7px"
                        }}
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
                                    getProgressWidth()
                            }}
                        />

                    </div>

                    <div className="mt-2">

                        <Requirement
                            valid={
                                formData.newPassword.length >= 8
                            }
                        >
                            At least 8 characters
                        </Requirement>

                        <Requirement
                            valid={
                                /[A-Z]/.test(
                                    formData.newPassword
                                )
                            }
                        >
                            One uppercase letter
                        </Requirement>

                        <Requirement
                            valid={
                                /[a-z]/.test(
                                    formData.newPassword
                                )
                            }
                        >
                            One lowercase letter
                        </Requirement>

                        <Requirement
                            valid={
                                /[0-9]/.test(
                                    formData.newPassword
                                )
                            }
                        >
                            One number
                        </Requirement>

                        <Requirement
                            valid={
                                /[^A-Za-z0-9]/.test(
                                    formData.newPassword
                                )
                            }
                        >
                            One special character
                        </Requirement>

                    </div>

                </div>

            )}


            {/* =========================
                CONFIRM PASSWORD
            ========================= */}

            <Form.Group>

                <Form.Label>
                    Confirm New Password
                </Form.Label>

                <InputGroup>

                    <Form.Control
                        type={
                            showConfirm
                                ? "text"
                                : "password"
                        }
                        name="confirmPassword"
                        value={
                            formData.confirmPassword
                        }
                        onChange={handleChange}
                        placeholder="Re-enter new password"
                        disabled={loading}
                        isInvalid={
                            formData.confirmPassword.length > 0 &&
                            formData.newPassword !==
                            formData.confirmPassword
                        }
                        isValid={
                            formData.confirmPassword.length > 0 &&
                            formData.newPassword ===
                            formData.confirmPassword
                        }
                    />

                    <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={() =>
                            setShowConfirm(
                                !showConfirm
                            )
                        }
                        disabled={loading}
                        aria-label={
                            showConfirm
                                ? "Hide password"
                                : "Show password"
                        }
                    >

                        {showConfirm ? (
                            <EyeSlashFill />
                        ) : (
                            <EyeFill />
                        )}

                    </Button>

                </InputGroup>

                {formData.confirmPassword &&
                    formData.newPassword !==
                    formData.confirmPassword && (

                        <Form.Text className="text-danger">

                            Passwords do not match.

                        </Form.Text>

                    )}

            </Form.Group>

        </Modal.Body>

        <Modal.Footer>

            <Button
                variant="secondary"
                onClick={closeModal}
                disabled={loading}
            >
                Cancel
            </Button>

            <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={loading}
            >

                {loading ? (
                    <>
                        <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                        />

                        Changing...

                    </>
                ) : (
                    "Change Password"
                )}

            </Button>

        </Modal.Footer>

    </Modal>

);
}

export default ChangePasswordModal;
