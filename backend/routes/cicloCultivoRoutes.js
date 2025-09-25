// routes/cicloCultivoRoutes.js
const express = require('express');
const router = express.Router();
const { insertarCicloCultivo, obtenerCiclosCultivo, obtenerCicloPorId, actualizarCicloCultivo, toggleCicloEstado} = require('../controllers/ciclo_cultivoController.js');

router.post('/', insertarCicloCultivo);
router.get('/', obtenerCiclosCultivo);

// New routes for editing
router.get('/:id', obtenerCicloPorId); // Route to get a single item
router.put('/:id', actualizarCicloCultivo); // Route to update an item
router.put('/:id/estado', toggleCicloEstado);

module.exports = router;        

