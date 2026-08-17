import { useState, useEffect } from "react";
import { BellFill, Search } from "react-bootstrap-icons";

import {
    Form,
    InputGroup,
    Badge,
    Dropdown,
    Button
} from "react-bootstrap";

import { formatDistanceToNow } from "date-fns";

import api from "../services/api";
import { getUser } from "../utils/auth";

import "../styles/navbar.css";

function Navbar() {

    const user = getUser();

    const [notifications, setNotifications] = useState([]);

    const [unreadCount, setUnreadCount] = useState(0);

    const [search, setSearch] = useState("");

    const [loadingNotifications, setLoadingNotifications] =
        useState(false);


    // =========================================
    // Load Notifications
    // =========================================

    useEffect(() => {

        fetchNotifications();

        // Refresh notifications every 30 seconds

        const interval = setInterval(() => {

            fetchNotifications();

        }, 30000);


        return () => {

            clearInterval(interval);

        };

    }, []);


    // =========================================
    // Fetch Notifications From Backend
    // =========================================

    const fetchNotifications = async () => {

        try {

            setLoadingNotifications(true);

            const res =
                await api.get("/notifications");


            if (res.data.success) {

                setNotifications(
                    res.data.notifications || []
                );

                setUnreadCount(
                    Number(
                        res.data.unread_count || 0
                    )
                );

            }

        } catch (err) {

            console.log(
                "Notification Error:",
                err
            );

        } finally {

            setLoadingNotifications(false);

        }

    };


    // =========================================
    // Mark Single Notification As Read
    // =========================================

    const markAsRead = async (notification) => {

        if (notification.is_read) {

            return;

        }


        try {

            await api.put(
                `/notifications/${notification.notification_id}/read`
            );


            // Update notification locally

            setNotifications((prev) =>

                prev.map((item) =>

                    item.notification_id ===
                    notification.notification_id

                        ? {
                            ...item,
                            is_read: true
                        }

                        : item

                )

            );


            // Decrease unread count

            setUnreadCount((prev) =>
                Math.max(prev - 1, 0)
            );


        } catch (err) {

            console.log(
                "Mark Notification Read Error:",
                err
            );

        }

    };


    // =========================================
    // Mark All Notifications As Read
    // =========================================

    const markAllAsRead = async () => {

        if (unreadCount === 0) {

            return;

        }


        try {

            await api.put(
                "/notifications/read-all"
            );


            // Update UI

            setNotifications((prev) =>

                prev.map((item) => ({

                    ...item,

                    is_read: true

                }))

            );


            setUnreadCount(0);


        } catch (err) {

            console.log(
                "Mark All Notifications Error:",
                err
            );

        }

    };


    // =========================================
    // Delete Notification
    // =========================================

    const deleteNotification = async (
        notificationId
    ) => {

        try {

            const notification =
                notifications.find(
                    (item) =>
                        item.notification_id ===
                        notificationId
                );


            await api.delete(
                `/notifications/${notificationId}`
            );


            // Remove notification

            setNotifications((prev) =>

                prev.filter(
                    (item) =>
                        item.notification_id !==
                        notificationId
                )

            );


            // If it was unread,
            // decrease unread count

            if (
                notification &&
                !notification.is_read
            ) {

                setUnreadCount((prev) =>
                    Math.max(prev - 1, 0)
                );

            }


        } catch (err) {

            console.log(
                "Delete Notification Error:",
                err
            );

        }

    };


    // =========================================
    // Format Notification Time
    // =========================================

    const formatNotificationTime = (date) => {

        if (!date) {

            return "Recently";

        }


        try {

            return formatDistanceToNow(
                new Date(date),
                {
                    addSuffix: true
                }
            );

        } catch (err) {

            return "Recently";

        }

    };


    // =========================================
    // Render
    // =========================================

    return (

        <div className="navbar-custom">


            {/* ================================= */}
            {/* LEFT */}
            {/* ================================= */}

            <div className="navbar-left">

                <h4 className="navbar-title">

                    Multi Tenant Project
                    Management System

                </h4>

            </div>


            {/* ================================= */}
            {/* SEARCH */}
            {/* ================================= */}

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


            {/* ================================= */}
            {/* RIGHT */}
            {/* ================================= */}

            <div className="navbar-right">


                {/* ================================= */}
                {/* NOTIFICATIONS */}
                {/* ================================= */}

                <Dropdown align="end">


                    <Dropdown.Toggle

                        variant="light"

                        className="notification-toggle"

                    >

                        <BellFill size={22} />


                        {/* Unread Badge */}

                        {unreadCount > 0 && (

                            <Badge

                                bg="danger"

                                pill

                                className="notification-badge"

                            >

                                {unreadCount > 99
                                    ? "99+"
                                    : unreadCount}

                            </Badge>

                        )}

                    </Dropdown.Toggle>


                    {/* ================================= */}
                    {/* NOTIFICATION MENU */}
                    {/* ================================= */}

                    <Dropdown.Menu

                        className="notification-menu"

                    >


                        {/* ================================= */}
                        {/* HEADER */}
                        {/* ================================= */}

                        <div className="notification-header">


                            <div>

                                <strong>

                                    🔔 Notifications

                                </strong>


                                <small>

                                    {unreadCount > 0

                                        ? `${unreadCount} unread notification${unreadCount > 1
                                            ? "s"
                                            : ""
                                        }`

                                        : "All notifications are read"

                                    }

                                </small>

                            </div>


                            {/* Mark All */}

                            {unreadCount > 0 && (

                                <button

                                    type="button"

                                    className="mark-all-read-btn"

                                    onClick={
                                        markAllAsRead
                                    }

                                >

                                    Mark all as read

                                </button>

                            )}

                        </div>


                        <Dropdown.Divider />


                        {/* ================================= */}
                        {/* LOADING */}
                        {/* ================================= */}

                        {loadingNotifications ? (

                            <div className="no-notifications">

                                <div className="notification-empty-icon">

                                    🔔

                                </div>


                                <p>

                                    Loading notifications...

                                </p>

                            </div>


                        ) : notifications.length === 0 ? (


                            /* ================================= */
                            /* NO NOTIFICATIONS */
                            /* ================================= */

                            <div className="no-notifications">

                                <div className="notification-empty-icon">

                                    🔔

                                </div>


                                <p>

                                    No notifications

                                </p>

                            </div>


                        ) : (


                            /* ================================= */
                            /* NOTIFICATION LIST */
                            /* ================================= */

                            notifications.map(
                                (item) => (

                                    <Dropdown.Item

                                        key={
                                            item.notification_id
                                        }

                                        className={
                                            `notification-item ${
                                                item.is_read
                                                    ? "read"
                                                    : "unread"
                                            }`
                                        }

                                        onClick={() =>
                                            markAsRead(item)
                                        }

                                    >


                                        <div className="notification-content">


                                            {/* ================================= */}
                                            {/* ICON */}
                                            {/* ================================= */}

                                            <div className="notification-icon">

                                                <BellFill />

                                            </div>


                                            {/* ================================= */}
                                            {/* MESSAGE */}
                                            {/* ================================= */}

                                            <div className="notification-text">


                                                <div className="notification-message">

                                                    <strong>

                                                        {
                                                            item.title ||
                                                            "Notification"
                                                        }

                                                    </strong>


                                                    <br />


                                                    {

                                                        item.message

                                                    }

                                                </div>


                                                <small className="text-muted">

                                                    {

                                                        formatNotificationTime(
                                                            item.created_at
                                                        )

                                                    }

                                                </small>

                                            </div>


                                            {/* ================================= */}
                                            {/* UNREAD DOT */}
                                            {/* ================================= */}

                                            {!item.is_read && (

                                                <div className="unread-dot">

                                                </div>

                                            )}


                                            {/* ================================= */}
                                            {/* DELETE */}
                                            {/* ================================= */}

                                            <Button

                                                variant="link"

                                                className="notification-delete-btn"

                                                onClick={(e) => {

                                                    e.stopPropagation();

                                                    deleteNotification(
                                                        item.notification_id
                                                    );

                                                }}

                                            >

                                                ×

                                            </Button>


                                        </div>

                                    </Dropdown.Item>

                                )

                            )

                        )}

                    </Dropdown.Menu>

                </Dropdown>


                {/* ================================= */}
                {/* PROFILE */}
                {/* ================================= */}

                <Dropdown align="end">


                    <Dropdown.Toggle

                        variant="light"

                        className="profile-btn"

                    >


                        <div className="avatar-circle">

                            {(

                                user?.username ||

                                "U"

                            )

                                .charAt(0)

                                .toUpperCase()}

                        </div>


                        <span className="ms-2">

                            {user?.username ||

                                "User"}

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

                            onClick={() =>
                                window.location.href =
                                "/profile"
                            }

                        >

                            👤 Profile

                        </Dropdown.Item>


                        <Dropdown.Item

                            onClick={() =>
                                window.location.href =
                                "/settings"
                            }

                        >

                            ⚙ Settings

                        </Dropdown.Item>


                        <Dropdown.Divider />


                        <Dropdown.Item

                            onClick={() => {

                                localStorage.clear();

                                window.location.href =
                                    "/login";

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
