// routes/cicloCultivoRoutes.js
const express = require('express');
const router = express.Router();

// ✅ CORRECCIÓN: Agrega el guion bajo (_) para que coincida con el nombre del archivo.
const cicloCultivoController = require('../controllers/ciclo_cultivoController');

// ...el resto de tu código de rutas es correcto
router.post('/ciclo-cultivo', cicloCultivoController.insertarCicloCultivo);
router.get('/ciclo-cultivo', cicloCultivoController.obtenerCiclosCultivo);

module.exports = router;    