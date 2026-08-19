import { useEffect, useState } from "react";

import {
    Card,
    Form,
    Button,
    Row,
    Col
} from "react-bootstrap";

import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import { toast } from "react-toastify";

import "./Settings.css";


function Settings() {

    const [companyName, setCompanyName] = useState("");
    const [companyEmail, setCompanyEmail] = useState("");
    const [companyPhone, setCompanyPhone] = useState("");
    const [companyAddress, setCompanyAddress] = useState("");

    const [companyLogo, setCompanyLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState("");

    const [saving, setSaving] = useState(false);


    // ===============================
    // Load Settings
    // ===============================

    useEffect(() => {
        loadSettings();
    }, []);


    const loadSettings = async () => {

        try {

            const res = await api.get("/settings");

            const data = res.data.settings || {};

            setCompanyName(data.company_name || "");
            setCompanyEmail(data.company_email || "");
            setCompanyPhone(data.company_phone || "");
            setCompanyAddress(data.company_address || "");


         if (data.company_logo) {
    setLogoPreview(
        `https://multitenant-project-management-system.onrender.com/${data.company_logo}`
    );
} else {

                setLogoPreview("");

            }

        } catch (err) {

            console.log("LOAD SETTINGS ERROR:", err);

            toast.error("Failed to Load Company Settings");
        }
    };


    // ===============================
    // Logo Selection
    // ===============================

    const handleLogoChange = (e) => {

        const file = e.target.files[0];

        if (!file) {
            return;
        }


        // Allow only images

        if (!file.type.startsWith("image/")) {

            toast.error("Please select an image file");

            e.target.value = "";

            return;
        }


        // Maximum 5 MB

        if (file.size > 5 * 1024 * 1024) {

            toast.error("Logo size must be less than 5 MB");

            e.target.value = "";

            return;
        }


        setCompanyLogo(file);


        // Instant preview

        const previewUrl = URL.createObjectURL(file);

        setLogoPreview(previewUrl);
    };


    // ===============================
    // Save Settings
    // ===============================

    const saveSettings = async () => {

        if (!companyName.trim()) {

            toast.warning("Company Name is required");

            return;
        }


        try {

            setSaving(true);

            const formData = new FormData();

            formData.append(
                "company_name",
                companyName.trim()
            );

            formData.append(
                "company_email",
                companyEmail.trim()
            );

            formData.append(
                "company_phone",
                companyPhone.trim()
            );

            formData.append(
                "company_address",
                companyAddress.trim()
            );


            if (companyLogo) {

                formData.append(
                    "company_logo",
                    companyLogo
                );
            }


            const res = await api.post(
                "/settings",
                formData
            );


            toast.success(
                res.data.message ||
                "Company Settings Saved Successfully"
            );


            // Reload saved settings

            await loadSettings();

            setCompanyLogo(null);


        } catch (err) {

            console.log(
                "SAVE SETTINGS ERROR:",
                err
            );

            toast.error(
                err.response?.data?.message ||
                "Failed to Save Settings"
            );

        } finally {

            setSaving(false);

        }
    };


    return (

        <MainLayout>

            <div className="page-header mb-4">

                <h2>
                    Company Settings
                </h2>

                <p>
                    Manage your company information and logo.
                </p>

            </div>


            <Card className="settings-card shadow">

                <Card.Header>

                    <h3 className="mb-0">
                        Company Information
                    </h3>

                </Card.Header>


                <Card.Body>

                    <Row>

                        {/* COMPANY NAME */}

                        <Col md={6}>

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Company Name
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    value={companyName}
                                    placeholder="Enter company name"
                                    onChange={(e) =>
                                        setCompanyName(
                                            e.target.value
                                        )
                                    }
                                />

                            </Form.Group>

                        </Col>


                        {/* EMAIL */}

                        <Col md={6}>

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Company Email
                                </Form.Label>

                                <Form.Control
                                    type="email"
                                    value={companyEmail}
                                    placeholder="Enter company email"
                                    onChange={(e) =>
                                        setCompanyEmail(
                                            e.target.value
                                        )
                                    }
                                />

                            </Form.Group>

                        </Col>

                    </Row>


                    <Row>

                        {/* PHONE */}

                        <Col md={6}>

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Company Phone
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    value={companyPhone}
                                    placeholder="Enter company phone"
                                    onChange={(e) =>
                                        setCompanyPhone(
                                            e.target.value
                                        )
                                    }
                                />

                            </Form.Group>

                        </Col>


                        {/* LOGO */}

                        <Col md={6}>

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Company Logo
                                </Form.Label>

                                <Form.Control
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={handleLogoChange}
                                />

                                <Form.Text className="text-muted">

                                    PNG, JPG or WebP. Maximum 5 MB.

                                </Form.Text>


                                {/* LOGO PREVIEW */}

                                {logoPreview && (

                                    <div className="logo-preview-container">

                                        <img
                                            src={logoPreview}
                                            alt="Company Logo Preview"
                                            className="logo-preview"
                                        />

                                    </div>

                                )}

                            </Form.Group>

                        </Col>

                    </Row>


                    {/* ADDRESS */}

                    <Form.Group className="mb-4">

                        <Form.Label>
                            Company Address
                        </Form.Label>

                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={companyAddress}
                            placeholder="Enter company address"
                            onChange={(e) =>
                                setCompanyAddress(
                                    e.target.value
                                )
                            }
                        />

                    </Form.Group>


                    {/* SAVE BUTTON */}

                    <Button
                        className="save-btn"
                        onClick={saveSettings}
                        disabled={saving}
                    >

                        {saving
                            ? "Saving..."
                            : "Save Company Settings"
                        }

                    </Button>

                </Card.Body>

            </Card>

        </MainLayout>
    );
}


export default Settings;