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

    // ==========================================
    // BACKEND URL
    // ==========================================

    const BACKEND_URL =
        "https://multitenant-project-management-system.onrender.com";


    // ==========================================
    // COMPANY STATE
    // ==========================================

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


    // ==========================================
    // LOGO FILE
    // ==========================================

    const [logoFile, setLogoFile] = useState(null);


    // ==========================================
    // LOADING STATES
    // ==========================================

    const [loading, setLoading] = useState(false);
    const [logoUploading, setLogoUploading] = useState(false);


    // ==========================================
    // FETCH COMPANY WHEN PAGE LOADS
    // ==========================================

    useEffect(() => {

        fetchCompany();

    }, []);


    // ==========================================
    // CREATE LOGO URL
    // ==========================================

    const getLogoUrl = (logo) => {

        if (!logo) {
            return null;
        }

        // If backend already returns a full URL
        if (
            logo.startsWith("http://") ||
            logo.startsWith("https://")
        ) {

            return `${logo}?t=${Date.now()}`;

        }

        // Remove starting slash if present
        const cleanLogo = logo.startsWith("/")
            ? logo.substring(1)
            : logo;

        return `${BACKEND_URL}/${cleanLogo}?t=${Date.now()}`;

    };


    // ==========================================
    // FETCH COMPANY
    // ==========================================

    const fetchCompany = async () => {

        try {

            const res = await api.get("/tenant");

            console.log("Company response:", res.data);

            if (res.data.success && res.data.tenant) {

                const tenant = res.data.tenant;

                setCompany({

                    tenant_name: tenant.tenant_name || "",
                    email: tenant.email || "",
                    phone: tenant.phone || "",
                    address: tenant.address || "",
                    website: tenant.website || "",
                    theme_color: tenant.theme_color || "#0d6efd",
                    status: tenant.status || "Active",
                    logo: tenant.logo || null

                });

                // Apply company theme color
                document.documentElement.style.setProperty(
                    "--primary-color",
                    tenant.theme_color || "#0d6efd"
                );

                console.log(
                    "Saved logo path:",
                    tenant.logo
                );

                console.log(
                    "Generated logo URL:",
                    getLogoUrl(tenant.logo)
                );

            }

        }

        catch (err) {

            console.error(
                "Fetch company error:",
                err
            );

            toast.error(
                "Failed to load company"
            );

        }

    };


    // ==========================================
    // HANDLE INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setCompany((prev) => ({

            ...prev,

            [name]: value

        }));

    };


    // ==========================================
    // SAVE COMPANY DETAILS
    // ==========================================

    const handleSave = async () => {

        setLoading(true);

        try {

            const res = await api.put(
                "/tenant",
                {

                    tenant_name: company.tenant_name,
                    email: company.email,
                    phone: company.phone,
                    address: company.address,
                    website: company.website,
                    theme_color: company.theme_color,
                    status: company.status

                }
            );

            toast.success(
                res.data.message ||
                "Company updated successfully"
            );


            // Update state immediately
            if (res.data.tenant) {

                setCompany((prev) => ({

                    ...prev,

                    ...res.data.tenant

                }));


                document.documentElement.style.setProperty(
                    "--primary-color",
                    res.data.tenant.theme_color ||
                    "#0d6efd"
                );

            }


            // Fetch latest company data
            await fetchCompany();

        }

        catch (err) {

            console.error(
                "Update company error:",
                err
            );

            toast.error(
                err.response?.data?.message ||
                "Failed to update company"
            );

        }

        finally {

            setLoading(false);

        }

    };


    // ==========================================
    // HANDLE LOGO FILE SELECT
    // ==========================================

    const handleLogoSelect = (e) => {

        const file = e.target.files?.[0];

        if (!file) {

            setLogoFile(null);

            return;

        }

        // Check image type
        if (!file.type.startsWith("image/")) {

            toast.error(
                "Please select a valid image file"
            );

            e.target.value = "";

            setLogoFile(null);

            return;

        }

        setLogoFile(file);

    };


    // ==========================================
    // UPLOAD COMPANY LOGO
    // ==========================================

    const handleLogoUpload = async () => {

        if (!logoFile) {

            toast.warning(
                "Please select a logo"
            );

            return;

        }

        setLogoUploading(true);

        try {

            const formData = new FormData();

            formData.append(
                "logo",
                logoFile
            );


            const res = await api.put(

                "/tenant/logo",

                formData,

                {
                    headers: {

                        "Content-Type":
                            "multipart/form-data"

                    }

                }

            );


            console.log(
                "Logo upload response:",
                res.data
            );


            if (res.data.success) {

                toast.success(
                    res.data.message ||
                    "Company logo uploaded successfully"
                );


                // Clear selected file
                setLogoFile(null);


                // Clear file input
                const fileInput =
                    document.getElementById(
                        "companyLogoInput"
                    );

                if (fileInput) {

                    fileInput.value = "";

                }


                // IMPORTANT:
                // Fetch latest logo from database
                await fetchCompany();

            }

        }

        catch (err) {

            console.error(
                "Logo upload error:",
                err
            );

            toast.error(
                err.response?.data?.message ||
                "Logo upload failed"
            );

        }

        finally {

            setLogoUploading(false);

        }

    };


    // ==========================================
    // LOGO ERROR
    // ==========================================

    const handleLogoError = (e) => {

        console.error(
            "Logo could not be loaded:",
            company.logo
        );

        e.currentTarget.src =
            "https://via.placeholder.com/180x180?text=Company+Logo";

    };


    // ==========================================
    // CURRENT LOGO URL
    // ==========================================

    const logoUrl =
        getLogoUrl(company.logo);


    // ==========================================
    // DEBUG
    // ==========================================

    console.log(
        "Company:",
        company
    );

    console.log(
        "Company logo:",
        company.logo
    );

    console.log(
        "Logo URL:",
        logoUrl
    );


    // ==========================================
    // UI
    // ==========================================

    return (

        <MainLayout>

            <div className="company-header">

                <h2>
                    🏢 Company Settings
                </h2>

                <p>
                    Manage your company information
                </p>

            </div>


            <Card className="company-card shadow">

                <Card.Body>


                    {/* ==================================
                        COMPANY LOGO
                    ================================== */}

                    <Row className="mb-5">

                        <Col className="text-center">


                            <img

                                src={
                                    logoUrl ||
                                    "https://via.placeholder.com/180x180?text=Company+Logo"
                                }

                                alt="Company Logo"

                                className="company-logo"

                                onError={
                                    handleLogoError
                                }

                            />


                            <div className="mt-4">

                                <Form.Control

                                    id="companyLogoInput"

                                    type="file"

                                    accept="image/*"

                                    onChange={
                                        handleLogoSelect
                                    }

                                />


                                <Button

                                    className="mt-3"

                                    onClick={
                                        handleLogoUpload
                                    }

                                    disabled={
                                        logoUploading
                                    }

                                >

                                    {

                                        logoUploading

                                            ? "Uploading..."

                                            : "Upload Company Logo"

                                    }

                                </Button>

                            </div>

                        </Col>

                    </Row>


                    {/* ==================================
                        COMPANY NAME + EMAIL
                    ================================== */}

                    <Row>

                        <Col md={6}>

                            <Form.Group
                                className="mb-3"
                            >

                                <Form.Label>
                                    Company Name
                                </Form.Label>

                                <Form.Control

                                    name="tenant_name"

                                    value={
                                        company.tenant_name
                                    }

                                    onChange={
                                        handleChange
                                    }

                                />

                            </Form.Group>

                        </Col>


                        <Col md={6}>

                            <Form.Group
                                className="mb-3"
                            >

                                <Form.Label>
                                    Email
                                </Form.Label>

                                <Form.Control

                                    name="email"

                                    value={
                                        company.email
                                    }

                                    onChange={
                                        handleChange
                                    }

                                />

                            </Form.Group>

                        </Col>

                    </Row>


                    {/* ==================================
                        PHONE + WEBSITE
                    ================================== */}

                    <Row>

                        <Col md={6}>

                            <Form.Group
                                className="mb-3"
                            >

                                <Form.Label>
                                    Phone
                                </Form.Label>

                                <Form.Control

                                    name="phone"

                                    value={
                                        company.phone || ""
                                    }

                                    onChange={
                                        handleChange
                                    }

                                />

                            </Form.Group>

                        </Col>


                        <Col md={6}>

                            <Form.Group
                                className="mb-3"
                            >

                                <Form.Label>
                                    Website
                                </Form.Label>

                                <Form.Control

                                    name="website"

                                    value={
                                        company.website || ""
                                    }

                                    onChange={
                                        handleChange
                                    }

                                />

                            </Form.Group>

                        </Col>

                    </Row>


                    {/* ==================================
                        ADDRESS
                    ================================== */}

                    <Form.Group
                        className="mb-3"
                    >

                        <Form.Label>
                            Address
                        </Form.Label>

                        <Form.Control

                            as="textarea"

                            rows={4}

                            name="address"

                            value={
                                company.address || ""
                            }

                            onChange={
                                handleChange
                            }

                        />

                    </Form.Group>


                    {/* ==================================
                        THEME + STATUS
                    ================================== */}

                    <Row>

                        <Col md={6}>

                            <Form.Group
                                className="mb-3"
                            >

                                <Form.Label>
                                    Theme Color
                                </Form.Label>

                                <Form.Control

                                    type="color"

                                    name="theme_color"

                                    value={
                                        company.theme_color ||
                                        "#0d6efd"
                                    }

                                    onChange={
                                        handleChange
                                    }

                                />

                            </Form.Group>

                        </Col>


                        <Col md={6}>

                            <Form.Group
                                className="mb-3"
                            >

                                <Form.Label>
                                    Status
                                </Form.Label>

                                <Form.Select

                                    name="status"

                                    value={
                                        company.status ||
                                        "Active"
                                    }

                                    onChange={
                                        handleChange
                                    }

                                >

                                    <option>
                                        Active
                                    </option>

                                    <option>
                                        Inactive
                                    </option>

                                </Form.Select>

                            </Form.Group>

                        </Col>

                    </Row>


                    {/* ==================================
                        SAVE BUTTON
                    ================================== */}

                    <div className="text-center mt-4">

                        <Button

                            variant="primary"

                            size="lg"

                            onClick={
                                handleSave
                            }

                            disabled={
                                loading
                            }

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