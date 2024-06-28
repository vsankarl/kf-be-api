const jwt = require('jsonwebtoken');
const SECRET_KEY = '11e7134a-18f4';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (req.path.startsWith('/v1/api/login')) {
        return next();
    }

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token

        req.user = user;
        next();
    });
};

module.exports = {
    authenticateToken,
};
