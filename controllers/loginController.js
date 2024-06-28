const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = '11e7134a-18f4';
const TOKEN_EXPIRATION = '1h';

// In-memory user storage for demo purposes
const users = {
    user1: { password: bcrypt.hashSync('password1', 8), history: [] },
    user2: { password: bcrypt.hashSync('password2', 8), history: [] }
};

const login = (req, res, next) => {
    const { username, password } = req.body;

    console.log('Login ' + username + ' ' + password);
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    const user = users[username];

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).send('Invalid credentials');
    }
    console.log('Login ' + username + ' validated ');

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
    res.json({ success: true, result: token });
};

module.exports = {
    login,
    users, // Exporting users for use in other controllers if needed
};
