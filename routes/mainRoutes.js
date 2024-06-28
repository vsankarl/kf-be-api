const express = require('express');
const terminalController = require('../controllers/terminalController');
const loginController = require('../controllers/loginController');

const router = express.Router();

router.post(
    '/v1/api/login', 
    loginController.login
);

router.post(
    '/v1/api/cd', 
    terminalController.postCd
);

router.post(
    '/v1/api/ls', 
    terminalController.postLs
);

router.post(
    '/v1/api/mkdir', 
    terminalController.postMkdir
);

// 404
router.get('*', (req, res) => res.status(404).json({ success: false, message: 'Page not found' }));

module.exports = router;