import { useState, useEffect } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import {
    PersonCircle,
    EnvelopeFill,
    BuildingFill,
    PersonBadgeFill
} from "react-bootstrap-icons";

import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
// Default professional avatar
import profileImage from "../../assets/images/profile.png";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";


import "./Profile.css";

function Profile() {

    const [user, setUser] = useState({});
    const [showEdit, setShowEdit] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {

        try {

            const res = await api.get("/profile");
            setUser(res.data.profile);

        } catch (err) {

            console.log(err);

        }

    };

    return (

        <MainLayout>

            <div className="profile-header">

                <h2>👤 My Profile</h2>

                <p>
                    Manage your personal information
                </p>

            </div>

            <Card className="profile-card shadow">

                <Card.Body>

                    <Row>

                        {/* Left Side */}

                        <Col md={4} className="text-center">

                            <div className="profile-avatar">

                                <img
                                    src={
                                       user.profile_photo
    ? `https://multitenant-project-management-system.onrender.com/${user.profile_photo}`
    : profileImage
                                    }
                                    alt="Profile"
                                    className="profile-image"
                                />

                            </div>

                            <h4 className="mt-3">

                                {user.username || "User"}

                            </h4>

                            <span className="text-muted">

                                @{user.username || "user"}

                            </span>

                        </Col>

                        {/* Right Side */}

                        <Col md={8}>

                            <Row className="mb-4">

                                <Col md={6}>

                                    <div className="info-box">

                                        <PersonBadgeFill
                                            className="profile-icon"
                                        />

                                        <div>

                                            <small>Name</small>

                                            <h6>
                                                {user.username}
                                            </h6>

                                        </div>

                                    </div>

                                </Col>

                                <Col md={6}>

                                    <div className="info-box">

                                        <EnvelopeFill
                                            className="profile-icon"
                                        />

                                        <div>

                                            <small>Email</small>

                                            <h6>
                                                {user.email}
                                            </h6>

                                        </div>

                                    </div>

                                </Col>

                            </Row>

                            <Row>

                                <Col md={6}>

                                    <div className="info-box">

                                        <BuildingFill
                                            className="profile-icon"
                                        />

                                        <div>

                                            <small>Role</small>

                                            <h6>

                                                {user.role || "Admin"}

                                            </h6>

                                        </div>

                                    </div>

                                </Col>

                                <Col md={6}>

                                    <div className="info-box">

                                        <PersonCircle
                                            className="profile-icon"
                                        />

                                        <div>

                                            <small>Phone</small>

                                            <h6>

                                                {user.phone || "Not Added"}

                                            </h6>

                                        </div>

                                    </div>

                                </Col>

                            </Row>

                            <div className="profile-buttons mt-4">

                                <Button
                                    variant="primary"
                                    className="me-3"
                                    onClick={() => setShowEdit(true)}
                                >

                                    Edit Profile

                                </Button>

                               <Button
    variant="outline-primary"
    onClick={() => setShowPassword(true)}
>

    Change Password

</Button>

                            </div>

                        </Col>

                    </Row>

                </Card.Body>

            </Card>

            <EditProfileModal
                show={showEdit}
                handleClose={() => setShowEdit(false)}
                user={user}
                refresh={fetchProfile}
            />
            <ChangePasswordModal
    show={showPassword}
    handleClose={() => setShowPassword(false)}
/>

        </MainLayout>

    );

}

export default Profile;