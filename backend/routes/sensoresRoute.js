const express = require('express');
const router = express.Router();
const { insertarSensor, obtenerSensores, obtenerSensorPorId, actualizarSensor } = require('../controllers/sensorController.js');

router.post('/', insertarSensor);
router.get('/', obtenerSensores);

router.get('/:id', obtenerSensorPorId);
router.put('/:id', actualizarSensor);

module.exports = router;