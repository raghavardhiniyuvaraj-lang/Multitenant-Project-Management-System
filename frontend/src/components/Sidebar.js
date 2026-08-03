import { NavLink } from "react-router-dom";
import {
    FaTachometerAlt,
    FaBuilding,
    FaUsers,
    FaProjectDiagram,
    FaTasks,
    FaUserFriends,
    FaChartBar,
    FaSignOutAlt
} from "react-icons/fa";

import { logout } from "../utils/auth";
import "../styles/sidebar.css";

function Sidebar() {

    return (

        <aside className="sidebar">

            <div className="sidebar-header">

                <div className="logo-circle">
                    🚀
                </div>

                <h2 className="logo">
                    MTPMS
                </h2>
                

                <p className="logo-subtitle">
                    Project Management
                </p>

            </div>

            <nav className="sidebar-menu">

                <NavLink to="/dashboard">
                    <FaTachometerAlt className="menu-icon" />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/departments">
                    <FaBuilding className="menu-icon" />
                    <span>Departments</span>
                </NavLink>

                <NavLink to="/employees">
                    <FaUsers className="menu-icon" />
                    <span>Employees</span>
                </NavLink>

                <NavLink to="/projects">
                    <FaProjectDiagram className="menu-icon" />
                    <span>Projects</span>
                </NavLink>

                <NavLink to="/members">
                    <FaUserFriends className="menu-icon" />
                    <span>Members</span>
                </NavLink>

                <NavLink to="/tasks">
                    <FaTasks className="menu-icon" />
                    <span>Tasks</span>
                </NavLink>

                <NavLink to="/reports">
                    <FaChartBar className="menu-icon" />
                    <span>Reports</span>
                </NavLink>
                <NavLink to="/company">
    <FaBuilding className="menu-icon" />
    <span>Company Settings</span>
</NavLink>
<NavLink
    to="/settings"
    className="nav-link"
>
    ⚙️ Settings
</NavLink>

            </nav>

            <div className="sidebar-footer">

                <button
                    className="logout-btn"
                    onClick={logout}
                >
                    <FaSignOutAlt className="me-2" />
                    Logout
                </button>

            </div>

        </aside>

    );

}

export default Sidebar;