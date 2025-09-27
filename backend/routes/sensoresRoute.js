const express = require('express');
const router = express.Router();
// 1. Importar Multer (el archivo que creaste en 'config')
const upload = require('../config/multerConfig'); 
const { insertarSensor, obtenerSensores, obtenerSensorPorId, actualizarSensor } = require('../controllers/sensorController.js');

// 2. Aplicar Multer (upload.single('image')) a la ruta POST
// Esto asegura que la imagen se guarda y el nombre se pasa al controlador
router.post('/', upload.single('image'), insertarSensor);

// Aplicar Multer también a la ruta PUT por si se actualiza la imagen
router.put('/:id', upload.single('image'), actualizarSensor); 

router.get('/', obtenerSensores);
router.get('/:id', obtenerSensorPorId);

module.exports = router;