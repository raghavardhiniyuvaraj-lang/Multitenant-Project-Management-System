import { useState, useEffect } from "react";
import { BellFill, Search } from "react-bootstrap-icons";
import {
    Form,
    InputGroup,
    Badge,
    Dropdown
} from "react-bootstrap";
import { formatDistanceToNow } from "date-fns";
import api from "../services/api";
import { getUser } from "../utils/auth";

import "../styles/navbar.css";

function Navbar() {

    const user = getUser();

    const [notifications, setNotifications] = useState([]);

    const [search, setSearch] = useState("");

    useEffect(() => {

        fetchNotifications();

    }, []);

    const fetchNotifications = async () => {

        try {

            const res = await api.get("/notifications");

            setNotifications(res.data.notifications);

        }

        catch (err) {

            console.log(err);

        }

    };

    return (

        <div className="navbar-custom">

            {/* Left */}

            <div className="navbar-left">

                <h4 className="navbar-title">

                    Multi Tenant Project Management System

                </h4>

            </div>

            {/* Search */}

            <div className="navbar-search">

                <InputGroup>

                    <InputGroup.Text>

                        <Search />

                    </InputGroup.Text>

                    <Form.Control
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </InputGroup>

            </div>

            {/* Right */}

            <div className="navbar-right">

                {/* Notification Bell */}

                <Dropdown align="end">

                    <Dropdown.Toggle
                        variant="light"
                        className="notification-toggle"
                    >

                        <BellFill size={22} />

                        <Badge
                            bg="danger"
                            pill
                            className="notification-badge"
                        >

                            {notifications.length}

                        </Badge>

                    </Dropdown.Toggle>

                    <Dropdown.Menu
                        className="notification-menu"
                    >

                        <Dropdown.Header>

                            🔔 Notifications

                        </Dropdown.Header>

                        {

                            notifications.length === 0 ?

                            (

                                <Dropdown.Item>

                                    No Notifications

                                </Dropdown.Item>

                            )

                            :

                            notifications.map((item, index) => (

                                <Dropdown.Item
                                    key={index}
                                >

                                    <div>

                                        <strong>

                                            {item.icon}

                                        </strong>

                                        {" "}

                                        {item.message}

                                        <br />

                                       <small className="text-muted">

    {

        formatDistanceToNow(
            new Date(item.time),
            {
                addSuffix: true
            }
        )

    }

</small>

                                    </div>

                                </Dropdown.Item>

                            ))

                        }

                    </Dropdown.Menu>

                </Dropdown>

                {/* Profile */}

                <Dropdown align="end">

                    <Dropdown.Toggle
                        variant="light"
                        className="profile-btn"
                    >

                        <div className="avatar-circle">

                            {

                                (user?.username || "U")
                                    .charAt(0)
                                    .toUpperCase()

                            }

                        </div>

                        <span className="ms-2">

                            {user?.username || "User"}

                        </span>

                    </Dropdown.Toggle>

                    <Dropdown.Menu>

                        <Dropdown.Header>

                            Welcome

                            <br />

                            <strong>

                                {user?.username}

                            </strong>

                        </Dropdown.Header>

                        <Dropdown.Divider />

                        <Dropdown.Item
    onClick={() => window.location.href = "/profile"}
>

    👤 Profile

</Dropdown.Item>

                        <Dropdown.Item>

                            ⚙ Settings

                        </Dropdown.Item>

                        <Dropdown.Divider />

                        <Dropdown.Item

                            onClick={() => {

                                localStorage.clear();

                                window.location.href = "/login";

                            }}

                        >

                            🚪 Logout

                        </Dropdown.Item>

                    </Dropdown.Menu>

                </Dropdown>

            </div>

        </div>

    );

}

export default Navbar;