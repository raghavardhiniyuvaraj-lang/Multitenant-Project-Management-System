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

    useEffect(() => {

        loadSettings();

    }, []);

    const loadSettings = async () => {

        try {

            const res = await api.get("/settings");

            const data = res.data.settings;

            if (data) {

    setCompanyName(data.company_name || "");
    setCompanyEmail(data.company_email || "");
    setCompanyPhone(data.company_phone || "");
    setCompanyAddress(data.company_address || "");

    if (data.company_logo) {

        setLogoPreview(
            "http://localhost:5000/uploads/company/" +
            data.company_logo
        );

    }

}

        }

        catch (err) {

            console.log(err);

        }

    };

    const saveSettings = async () => {

        try {

            const formData = new FormData();

            formData.append("company_name", companyName);
            formData.append("company_email", companyEmail);
            formData.append("company_phone", companyPhone);
            formData.append("company_address", companyAddress);

            if (companyLogo) {

                formData.append(
                    "company_logo",
                    companyLogo
                );

            }

            const res = await api.post(
                "/settings",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            toast.success(res.data.message);

            loadSettings();

        }

        catch (err) {

            console.log(err);

            toast.error("Failed to Save Settings");

        }

    };

    return (

        <MainLayout>

            <Card className="shadow">

                <Card.Header>

                    <h3>Company Settings</h3>

                </Card.Header>

                <Card.Body>

                    <Row>

                        <Col md={6}>

                            <Form.Group className="mb-3">

                                <Form.Label>

                                    Company Name

                                </Form.Label>

                                <Form.Control

                                    value={companyName}

                                    onChange={(e) =>
                                        setCompanyName(e.target.value)
                                    }

                                />

                            </Form.Group>

                        </Col>

                        <Col md={6}>

                            <Form.Group className="mb-3">

                                <Form.Label>

                                    Company Email

                                </Form.Label>

                                <Form.Control

                                    value={companyEmail}

                                    onChange={(e) =>
                                        setCompanyEmail(e.target.value)
                                    }

                                />

                            </Form.Group>

                        </Col>

                    </Row>

                    <Row>

                        <Col md={6}>

                            <Form.Group className="mb-3">

                                <Form.Label>

                                    Company Phone

                                </Form.Label>

                                <Form.Control

                                    value={companyPhone}

                                    onChange={(e) =>
                                        setCompanyPhone(e.target.value)
                                    }

                                />

                            </Form.Group>

                        </Col>

                        <Col md={6}>

                            <Form.Group className="mb-3">

                                <Form.Label>

                                    Company Logo

                                </Form.Label>

                                <Form.Control

                                    type="file"

                                    onChange={(e) =>
                                        setCompanyLogo(
                                            e.target.files[0]
                                        )
                                    }

                                />
                                {
    logoPreview && (

        <div className="mt-3 text-center">

            <img

                src={logoPreview}

                alt="Company Logo"

                className="logo-preview"

            />

        </div>

    )
}

                            </Form.Group>

                        </Col>

                    </Row>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Company Address

                        </Form.Label>

                        <Form.Control

                            as="textarea"

                            rows={4}

                            value={companyAddress}

                            onChange={(e) =>
                                setCompanyAddress(
                                    e.target.value
                                )
                            }

                        />

                    </Form.Group>

                    <Button

                        className="theme-btn"

                        onClick={saveSettings}

                    >

                        Save Settings

                    </Button>

                </Card.Body>

            </Card>

        </MainLayout>

    );

}

export default Settings;