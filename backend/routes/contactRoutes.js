const express = require('express');
const router = express.Router();
const { sendContactMessage } = require('../controllers/contactController');

// Public route — no authentication required
router.post('/', sendContactMessage);

module.exports = router;
