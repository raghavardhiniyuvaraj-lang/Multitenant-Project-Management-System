const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {

        // Get Authorization Header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Access Denied. No Token Provided."
            });
        }

        // Remove "Bearer " from the token
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

        req.user = decoded;

        next();

    } catch (err) {
        console.log("JWT Error:", err.message);

        return res.status(401).json({
            message: "Invalid Token"
        });
    }
};

module.exports = auth;