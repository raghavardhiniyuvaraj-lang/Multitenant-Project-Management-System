const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access Denied. No Token Provided."
            });
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("=================================");
        console.log("AUTHENTICATED USER");
        console.log("User ID:", decoded.userId);
        console.log("Tenant ID:", decoded.tenantId);
        console.log("Email:", decoded.email);
        console.log("Role:", decoded.role);
        console.log("=================================");

        if (!decoded.tenantId) {
            return res.status(401).json({
                success: false,
                message: "Tenant ID missing from authentication token"
            });
        }

        req.user = decoded;

        next();

    } catch (err) {
        console.error("JWT Error:", err.message);

        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });
    }
};

module.exports = auth;