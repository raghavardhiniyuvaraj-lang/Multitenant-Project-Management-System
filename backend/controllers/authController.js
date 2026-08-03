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

        // Check Email
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        // Create Tenant
        const tenantResult = await pool.query(
            `INSERT INTO tenants
            (tenant_name,email)
            VALUES($1,$2)
            RETURNING *`,
            [tenant_name, email]
        );

        const tenantId = tenantResult.rows[0].tenant_id;

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const userResult = await pool.query(
            `INSERT INTO users
            (tenant_id,username,email,password,role)
            VALUES($1,$2,$3,$4,$5)
            RETURNING *`,
            [
                tenantId,
                username,
                email,
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

        console.log(err);

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

        const result = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        const user = result.rows[0];

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid Password"
            });
        }

        // JWT
        const token = jwt.sign(
            {
                userId: user.user_id,
                tenantId: user.tenant_id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: userWithoutPassword
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};