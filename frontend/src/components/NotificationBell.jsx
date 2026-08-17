import { useEffect, useState } from "react";
import { Dropdown, Badge, Button } from "react-bootstrap";
import {
    FaBell,
    FaCheck,
    FaTrash,
    FaRegBell
} from "react-icons/fa";
import { toast } from "react-toastify";

import api from "../services/api";

function NotificationBell() {

    const [notifications, setNotifications] = useState([]);

    const [unreadCount, setUnreadCount] = useState(0);

    const [loading, setLoading] = useState(false);


    // =======================================
    // Load Notifications
    // =======================================

    const fetchNotifications = async () => {

        try {

            setLoading(true);

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

            setLoading(false);

        }

    };


    // =======================================
    // Initial Load
    // =======================================

    useEffect(() => {

        fetchNotifications();

    }, []);


    // =======================================
    // Mark One As Read
    // =======================================

    const markAsRead = async (id) => {

        try {

            await api.put(
                `/notifications/${id}/read`
            );

            setNotifications((prev) =>
                prev.map((notification) =>
                    notification.notification_id === id
                        ? {
                            ...notification,
                            is_read: true
                        }
                        : notification
                )
            );

            setUnreadCount((prev) =>
                Math.max(prev - 1, 0)
            );

        } catch (err) {

            console.log(
                "Mark Read Error:",
                err
            );

        }

    };


    // =======================================
    // Mark All As Read
    // =======================================

    const markAllAsRead = async () => {

        try {

            await api.put(
                "/notifications/read-all"
            );

            setNotifications((prev) =>
                prev.map((notification) => ({
                    ...notification,
                    is_read: true
                }))
            );

            setUnreadCount(0);

            toast.success(
                "All notifications marked as read"
            );

        } catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Failed to mark notifications as read"
            );

        }

    };


    // =======================================
    // Delete Notification
    // =======================================

    const deleteNotification = async (id) => {

        try {

            await api.delete(
                `/notifications/${id}`
            );

            setNotifications((prev) =>
                prev.filter(
                    (notification) =>
                        notification.notification_id !== id
                )
            );

            setUnreadCount((prev) =>
                Math.max(prev - 1, 0)
            );

        } catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Failed to delete notification"
            );

        }

    };


    // =======================================
    // Format Time
    // =======================================

    const formatTime = (date) => {

        if (!date) {
            return "";
        }

        return new Date(date).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    return (

        <Dropdown align="end">

            {/* ===================================
                Bell
            =================================== */}

            <Dropdown.Toggle
                variant="light"
                className="notification-toggle"
            >

                <FaBell size={20} />

                {unreadCount > 0 && (

                    <Badge
                        bg="danger"
                        className="notification-badge"
                    >
                        {unreadCount > 99
                            ? "99+"
                            : unreadCount}
                    </Badge>

                )}

            </Dropdown.Toggle>


            {/* ===================================
                Notification Menu
            =================================== */}

            <Dropdown.Menu
                className="notification-menu"
            >

                <div className="notification-header">

                    <div>

                        <strong>
                            Notifications
                        </strong>

                        <small>
                            {unreadCount} unread
                        </small>

                    </div>


                    {unreadCount > 0 && (

                        <button
                            type="button"
                            className="mark-all-read-btn"
                            onClick={markAllAsRead}
                        >
                            Mark all as read
                        </button>

                    )}

                </div>


                <Dropdown.Divider />


                {/* ===================================
                    Loading
                =================================== */}

                {loading ? (

                    <div className="no-notifications">

                        <FaRegBell
                            className="notification-empty-icon"
                        />

                        <p>
                            Loading notifications...
                        </p>

                    </div>

                ) : notifications.length === 0 ? (

                    /* ===================================
                       Empty
                    =================================== */

                    <div className="no-notifications">

                        <FaRegBell
                            className="notification-empty-icon"
                        />

                        <p>
                            No notifications
                        </p>

                    </div>

                ) : (

                    /* ===================================
                       Notification List
                    =================================== */

                    notifications.map(
                        (notification) => (

                            <div
                                key={
                                    notification.notification_id
                                }
                                className={
                                    `notification-item ${
                                        notification.is_read
                                            ? "read"
                                            : "unread"
                                    }`
                                }
                            >

                                <div className="notification-content">

                                    <div className="notification-icon">

                                        <FaBell />

                                    </div>


                                    <div
                                        className="notification-text"
                                        onClick={() => {

                                            if (
                                                !notification.is_read
                                            ) {

                                                markAsRead(
                                                    notification.notification_id
                                                );

                                            }

                                        }}
                                    >

                                        <div className="notification-message">

                                            <strong>
                                                {
                                                    notification.title
                                                }
                                            </strong>

                                            <br />

                                            {
                                                notification.message
                                            }

                                        </div>


                                        <small>

                                            {
                                                formatTime(
                                                    notification.created_at
                                                )
                                            }

                                        </small>

                                    </div>


                                    {!notification.is_read && (

                                        <span
                                            className="unread-dot"
                                        />

                                    )}


                                    <Button
                                        variant="link"
                                        className="notification-delete-btn"
                                        onClick={() =>
                                            deleteNotification(
                                                notification.notification_id
                                            )
                                        }
                                    >

                                        <FaTrash />

                                    </Button>

                                </div>

                            </div>

                        )
                    )

                )}

            </Dropdown.Menu>

        </Dropdown>

    );

}

export default NotificationBell;
