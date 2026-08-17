const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const projectRoutes = require("./routes/projectRoutes");
const projectMemberRoutes = require("./routes/projectMemberRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const profileRoutes = require("./routes/profileRoutes");
const tenantRoutes = require("./routes/tenantRoutes");
const reportRoutes = require("./routes/reportRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// ===============================
// Uploads
// ===============================
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

// ===============================
// Routes
// ===============================
app.use("/api/auth", authRoutes);

app.use("/api/departments", departmentRoutes);

app.use("/api/employees", employeeRoutes);

app.use("/api/projects", projectRoutes);

// Project Members
app.use("/api/project-members", projectMemberRoutes);
app.use("/api/tasks", taskRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/tenant", tenantRoutes);

app.use("/api/reports", reportRoutes);

app.use("/api/settings", settingsRoutes);

// ===============================
// Home Route
// ===============================
app.get("/", (req, res) => {
    res.send("Multi Tenant Project Management API Running");
});

// ===============================
// Test Route
// ===============================
app.get("/test", (req, res) => {
    res.send("Route working");
});

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
});