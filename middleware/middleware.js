const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
   
    const token = req.cookies.token|| req.headers.authorization?.split(" ")[1];
    
    console.log(token);

    if (!token) {
        return res.status(403).json({ message: "Token is required" });
    }


    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }


        req.userId = decoded.userId;
       

        next();
    });
};

module.exports = authenticateToken;
