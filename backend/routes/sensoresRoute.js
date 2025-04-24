const express = require('express');
const router = express.Router();
const { insertarSensor, obtenerSensores } = require('../controllers/sensorController.js');

router.post('/', insertarSensor);
router.get('/', obtenerSensores);

module.exports = router;