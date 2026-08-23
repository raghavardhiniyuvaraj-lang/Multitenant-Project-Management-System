import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
    return (
        <div className="home-page">

            {/* Navbar */}
            <nav className="home-navbar">
                <div className="home-logo">
                    🚀 MultiTenant PMS
                </div>

                <div className="home-nav-links">
                    <a href="#features">Features</a>
                    <a href="#how-it-works">How It Works</a>

                    <Link to="/login" className="nav-login">
                        Sign In
                    </Link>

                    <Link to="/register" className="nav-register">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">

                <div className="hero-content">

                    <div className="hero-badge">
                        🚀 Smart • Secure • Multi-Tenant
                    </div>

                    <h1>
                        Manage Your Projects
                        <span> Smarter & Faster</span>
                    </h1>

                    <p>
                        A powerful multi-tenant project management system
                        designed to help companies manage employees,
                        departments, projects, tasks and reports in one place.
                    </p>

                    <div className="hero-buttons">

                        <Link
                            to="/register"
                            className="hero-primary-btn"
                        >
                            Get Started →
                        </Link>

                        <Link
                            to="/login"
                            className="hero-secondary-btn"
                        >
                            Sign In
                        </Link>

                    </div>

                </div>

                <div className="hero-visual">

<div className="dashboard-preview">

    {/* Browser Header */}
    <div className="preview-header">
        <span></span>
        <span></span>
        <span></span>
        <div className="preview-browser-title">
            MultiTenant PMS
        </div>
    </div>

    <div className="preview-content">

        {/* Sidebar */}
        <div className="preview-sidebar">

            <div className="preview-brand">
                🚀
            </div>

            <div className="sidebar-active">
                📊
            </div>

            <div>🏢</div>
            <div>👥</div>
            <div>📁</div>
            <div>✅</div>
            <div>📈</div>

        </div>

        {/* Main Dashboard */}
        <div className="preview-main">

            <div className="preview-dashboard-heading">
                <div>
                    <h4>Dashboard</h4>
                    <p>Project overview</p>
                </div>

                <div className="preview-user">
                    R
                </div>
            </div>

            {/* Statistics */}
            <div className="preview-cards">

                <div className="preview-stat-card">
                    <span>📁</span>
                    <small>Total Projects</small>
                    <strong>12</strong>
                </div>

                <div className="preview-stat-card green">
                    <span>✅</span>
                    <small>Active Projects</small>
                    <strong>8</strong>
                </div>

                <div className="preview-stat-card orange">
                    <span>👥</span>
                    <small>Employees</small>
                    <strong>48</strong>
                </div>

            </div>

            {/* Chart Section */}
            <div className="preview-chart-section">

                <div className="preview-chart-heading">
                    <strong>Project Progress</strong>
                    <span>2026</span>
                </div>

                <div className="preview-chart">

                    <div
                        className="chart-bar"
                        style={{ height: "45%" }}
                    >
                        <span>45%</span>
                    </div>

                    <div
                        className="chart-bar"
                        style={{ height: "70%" }}
                    >
                        <span>70%</span>
                    </div>

                    <div
                        className="chart-bar"
                        style={{ height: "55%" }}
                    >
                        <span>55%</span>
                    </div>

                    <div
                        className="chart-bar"
                        style={{ height: "85%" }}
                    >
                        <span>85%</span>
                    </div>

                    <div
                        className="chart-bar"
                        style={{ height: "65%" }}
                    >
                        <span>65%</span>
                    </div>

                </div>

                <div className="chart-labels">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                </div>

            </div>

            {/* Bottom Project Information */}
            <div className="preview-bottom">

                <div className="preview-project">

                    <div className="project-icon">
                        📱
                    </div>

                    <div>
                        <strong>Mobile Application</strong>
                        <small>Development Project</small>
                    </div>

                    <div className="project-progress">
                        <span>78%</span>
                        <div>
                            <i></i>
                        </div>
                    </div>

                </div>

                <div className="preview-status">
                    <span></span>
                    Active
                </div>

            </div>

        </div>

    </div>

</div>
</div>

            </section>

            {/* Features */}
            <section
                className="features-section"
                id="features"
            >

                <div className="section-heading">

                    <span>FEATURES</span>

                    <h2>
                        Everything Your Team Needs
                    </h2>

                    <p>
                        Manage your entire organization from one simple platform.
                    </p>

                </div>

                <div className="features-grid">

                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Dashboard</h3>
                        <p>
                            Get a clear overview of your company,
                            projects and tasks.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">👥</div>
                        <h3>Employee Management</h3>
                        <p>
                            Easily manage employees and their
                            department information.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🏢</div>
                        <h3>Departments</h3>
                        <p>
                            Organize employees into departments
                            and manage them efficiently.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📁</div>
                        <h3>Project Management</h3>
                        <p>
                            Create and manage projects while
                            tracking project members.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">✅</div>
                        <h3>Task Management</h3>
                        <p>
                            Assign tasks, track progress and
                            monitor task status.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📈</div>
                        <h3>Reports</h3>
                        <p>
                            Generate useful reports to understand
                            your organization's performance.
                        </p>
                    </div>

                </div>

            </section>

            {/* How It Works */}
            <section
                className="how-section"
                id="how-it-works"
            >

                <div className="section-heading">

                    <span>HOW IT WORKS</span>

                    <h2>
                        Simple Steps to Get Started
                    </h2>

                </div>

                <div className="steps-container">

                    <div className="step-card">
                        <div className="step-number">01</div>
                        <h3>Create Your Company</h3>
                        <p>
                            Register your company and create
                            your organization account.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">02</div>
                        <h3>Sign In</h3>
                        <p>
                            Login securely using your company
                            account credentials.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">03</div>
                        <h3>Manage Your Team</h3>
                        <p>
                            Add employees, departments,
                            projects and tasks.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">04</div>
                        <h3>Track & Analyze</h3>
                        <p>
                            Monitor projects and view reports
                            from your dashboard.
                        </p>
                    </div>

                </div>

            </section>

            {/* CTA */}
            <section className="cta-section">

                <h2>
                    Ready to Manage Your Projects Better?
                </h2>

                <p>
                    Start managing your organization with
                    MultiTenant PMS today.
                </p>

                <Link
                    to="/register"
                    className="cta-button"
                >
                    Create Your Company →
                </Link>

            </section>

            {/* Footer */}
            <footer className="home-footer">

                <div>
                    <strong>🚀 MultiTenant PMS</strong>

                    <p>
                        Multi-Tenant Project Management System
                    </p>
                </div>

                <div className="footer-links">

                    <Link to="/login">
                        Sign In
                    </Link>

                    <Link to="/register">
                        Register
                    </Link>

                </div>

                <div>
                    © 2026 MultiTenant PMS
                </div>

            </footer>

        </div>
    );
}

export default Home;
