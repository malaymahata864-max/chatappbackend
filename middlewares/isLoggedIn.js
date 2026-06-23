const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Please login to access this resource" });
    }
    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Please login to access this resource" });
    }
};

module.exports = { isLoggedIn };