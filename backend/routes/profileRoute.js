const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); 
const { getProfile } = require('../controllers/registerController'); // Onde está a sua função

// Esta ruta (GET /api/profile) es el punto que dashboard.js llamará.
router.get('/', protect, getProfile);

module.exports = router;