const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: "Not Authorized, please Login" });
        }

        // Verify token
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database using the token's userId
        const user = await User.findById(verified.id).select("-password");

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        // Attach the user to the request for future use
        req.user = user;
        next();
    } catch (err) {
        console.error("Error in protect middleware:", err);
        res.status(401).json({ error: "Not Authorized, please Login" });
    }
};

module.exports = {
    protect,
};
