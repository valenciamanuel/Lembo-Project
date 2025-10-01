const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig'); 
const { insertarSensor, obtenerSensores, obtenerSensorPorId, actualizarSensor } = require('../controllers/sensorController.js');

router.post('/', upload.single('image'), insertarSensor);

router.put('/:id', upload.single('image'), actualizarSensor); 

router.get('/', obtenerSensores);
router.get('/:id', obtenerSensorPorId);

module.exports = router;