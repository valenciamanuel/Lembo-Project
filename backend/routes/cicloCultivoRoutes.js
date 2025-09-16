// routes/cicloCultivoRoutes.js
const express = require('express');
const router = express.Router();

// ✅ CORRECCIÓN: Usar el nombre exacto del archivo con el guion bajo
const cicloCultivoController = require('../controllers/ciclo_cultivoController');

// ...el resto de tu código
// ...el resto de tu código de rutas es correcto
router.post('/ciclo-cultivo', cicloCultivoController.insertarCicloCultivo);
router.get('/ciclo-cultivo', cicloCultivoController.obtenerCiclosCultivo);

module.exports = router;        