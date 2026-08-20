import { useEffect, useState } from "react";
import {
    Card,
    Row,
    Col,
    Form,
    Button
} from "react-bootstrap";
import { toast } from "react-toastify";

import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";

import "./CompanyProfile.css";

function CompanyProfile() {

    // Backend URL
    const IMAGE_URL = "https://multitenant-project-management-system.onrender.com/";

    const [company, setCompany] = useState({

        tenant_name: "",
        email: "",
        phone: "",
        address: "",
        website: "",
        theme_color: "#0d6efd",
        status: "Active",
        logo: null

    });

    const [logoFile, setLogoFile] = useState(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        fetchCompany();

    }, []);

    const fetchCompany = async () => {

        try {

           const res = await api.get("/tenant");

setCompany(res.data.tenant);

document.documentElement.style.setProperty(
    "--primary-color",
    res.data.tenant.theme_color
);

        }

        catch (err) {

            console.log(err);

            toast.error("Failed to load company");

        }

    };

    const handleChange = (e) => {

        setCompany({

            ...company,

            [e.target.name]: e.target.value

        });

    };

    const handleSave = async () => {

        setLoading(true);

        try {

            const res = await api.put("/tenant", company);

            toast.success(res.data.message);

            fetchCompany();

        }

        catch (err) {

            console.log(err);

            toast.error("Failed to update company");

        }

        setLoading(false);

    };

    const handleLogoUpload = async () => {

        if (!logoFile) {

            toast.warning("Please select a logo");

            return;

        }

        try {

            const formData = new FormData();

            formData.append("logo", logoFile);

            const res = await api.put(

                "/tenant/logo",

                formData,

                {

                    headers: {

                        "Content-Type": "multipart/form-data"

                    }

                }

            );

            toast.success(res.data.message);

            setLogoFile(null);

            fetchCompany();

        }

        catch (err) {

            console.log(err);

            toast.error("Logo upload failed");

        }

    };
    console.log(company);
    console.log("Logo =", company.logo);

    return (

        <MainLayout>

            <div className="company-header">

                <h2>🏢 Company Settings</h2>

                <p>Manage your company information</p>

            </div>

            <Card className="company-card shadow">

                <Card.Body>

                    <Row className="mb-5">

                        <Col className="text-center">

                           <img
    src={
        company.logo
            ? `${IMAGE_URL}${company.logo}`
            : "https://via.placeholder.com/180x180?text=Company+Logo"
    }
    alt="Company Logo"
    className="company-logo"
/>

                            <div className="mt-4">

                                <Form.Control

                                    type="file"

                                    accept="image/*"

                                    onChange={(e) =>

                                        setLogoFile(e.target.files[0])

                                    }

                                />

                                <Button

                                    className="mt-3"

                                    onClick={handleLogoUpload}

                                >

                                    Upload Company Logo

                                </Button>

                            </div>

                        </Col>

                    </Row>

                    <Row>

                        <Col md={6}>

                            <Form.Group className="mb-3">

                                <Form.Label>

                                    Company Name

                                </Form.Label>

                                <Form.Control

                                    name="tenant_name"

                                    value={company.tenant_name}

                                    onChange={handleChange}

                                />

                            </Form.Group>

                        </Col>

                        <Col md={6}>

                            <Form.Group className="mb-3">

                                <Form.Label>

                                    Email

                                </Form.Label>

                                <Form.Control

                                    name="email"

                                    value={company.email}

                                    onChange={handleChange}

                                />

                            </Form.Group>

                        </Col>

                    </Row>

                    <Row>

                        <Col md={6}>

                            <Form.Group className="mb-3">

                                <Form.Label>

                                    Phone

                                </Form.Label>

                                <Form.Control

                                    name="phone"

                                    value={company.phone || ""}

                                    onChange={handleChange}

                                />

                            </Form.Group>

                        </Col>

                        <Col md={6}>

                            <Form.Group className="mb-3">

                                <Form.Label>

                                    Website

                                </Form.Label>

                                <Form.Control

                                    name="website"

                                    value={company.website || ""}

                                    onChange={handleChange}

                                />

                            </Form.Group>

                        </Col>

                    </Row>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Address

                        </Form.Label>

                        <Form.Control

                            as="textarea"

                            rows={4}

                            name="address"

                            value={company.address || ""}

                            onChange={handleChange}

                        />

                    </Form.Group>

                    <Row>

                        <Col md={6}>

                            <Form.Group className="mb-3">

                                <Form.Label>

                                    Theme Color

                                </Form.Label>

                                <Form.Control

                                    type="color"

                                    name="theme_color"

                                    value={company.theme_color}

                                    onChange={handleChange}

                                />

                            </Form.Group>

                        </Col>

                        <Col md={6}>

                            <Form.Group className="mb-3">

                                <Form.Label>

                                    Status

                                </Form.Label>

                                <Form.Select

                                    name="status"

                                    value={company.status}

                                    onChange={handleChange}

                                >

                                    <option>Active</option>

                                    <option>Inactive</option>

                                </Form.Select>

                            </Form.Group>

                        </Col>

                    </Row>

                    <div className="text-center mt-4">

                        <Button

                            variant="primary"

                            size="lg"

                            onClick={handleSave}

                            disabled={loading}

                        >

                            {

                                loading

                                    ? "Saving..."

                                    : "Save Changes"

                            }

                        </Button>

                    </div>

                </Card.Body>

            </Card>

        </MainLayout>

    );

}

export default CompanyProfile;