const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mainRouter = require('./routes/mainRoutes');
const { authenticateToken } = require('./middleware/authMiddleware');

const corsOptions = {
    origin: 'http://localhost:3000', // TODO: get it from env
};

const port = process.env.PORT || 1337;

const app = express();

app.use(cors(corsOptions));

app.use(express.json());

app.use(authenticateToken);
app.use(mainRouter); // TODO: selectively secure endpoint 

// error handler
app.use(function (err, req, res, next) {
    console.log("Generic error");
    res.status(err.status || 500).json({ success: false, message: err.message || 'Request failed' });
});

/* Start the server and listen on the specified port */
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
