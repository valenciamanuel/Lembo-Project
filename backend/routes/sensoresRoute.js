const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig'); 
const { insertarSensor, obtenerSensores, obtenerSensorPorId, actualizarSensor, eliminarSensor } = require('../controllers/sensorController.js');
const { protect } = require('../middleware/authMiddleware');

router.post('/', upload.single('image'), insertarSensor);

router.put('/:id', upload.single('image'), actualizarSensor); 

router.get('/', obtenerSensores);
router.get('/:id', obtenerSensorPorId);

// Eliminar sensor -> ahora protegida y realiza un "soft delete" (estado = 'Inactivo')
router.delete('/:id', protect, eliminarSensor);

module.exports = router;