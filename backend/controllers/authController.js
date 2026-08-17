const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================

exports.register = async (req, res) => {
    try {
        const {
            tenant_name,
            username,
            email,
            password
        } = req.body;

        // Validate required fields
        if (!tenant_name || !tenant_name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Company Name is required"
            });
        }

        if (!username || !username.trim()) {
            return res.status(400).json({
                success: false,
                message: "Username is required"
            });
        }

        if (!email || !email.trim()) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required"
            });
        }

        // Check if email already exists
        const existingUser = await pool.query(
            `SELECT user_id
             FROM users
             WHERE LOWER(email) = LOWER($1)`,
            [email.trim()]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        // ================= CREATE TENANT =================

        const tenantResult = await pool.query(
            `INSERT INTO tenants
                (tenant_name, email)
             VALUES
                ($1, $2)
             RETURNING *`,
            [
                tenant_name.trim(),
                email.trim()
            ]
        );

        const tenantId = tenantResult.rows[0].tenant_id;

        // ================= HASH PASSWORD =================

        const hashedPassword = await bcrypt.hash(password, 10);

        // ================= CREATE USER =================

        const userResult = await pool.query(
            `INSERT INTO users
                (tenant_id, username, email, password, role)
             VALUES
                ($1, $2, $3, $4, $5)
             RETURNING *`,
            [
                tenantId,
                username.trim(),
                email.trim(),
                hashedPassword,
                "Admin"
            ]
        );

        const { password: _, ...user } = userResult.rows[0];

        res.status(201).json({
            success: true,
            message: "Registered Successfully",
            user
        });

    } catch (err) {
        console.log("REGISTER ERROR:", err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// ================= LOGIN =================

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user
        const result = await pool.query(
            `SELECT *
             FROM users
             WHERE LOWER(email) = LOWER($1)`,
            [email.trim()]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        const user = result.rows[0];

        // Check password
        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        }

        // ================= JWT =================

        const token = jwt.sign(
            {
                userId: user.user_id,
                tenantId: user.tenant_id,
                email: user.email,       // IMPORTANT
                username: user.username, // IMPORTANT
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // Remove password before sending user information
        const { password: _, ...userWithoutPassword } = user;

        console.log("=================================");
        console.log("LOGIN SUCCESSFUL");
        console.log("User ID:", user.user_id);
        console.log("Tenant ID:", user.tenant_id);
        console.log("Username:", user.username);
        console.log("Email:", user.email);
        console.log("Role:", user.role);
        console.log("=================================");

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: userWithoutPassword
        });

    } catch (err) {
        console.log("LOGIN ERROR:", err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};