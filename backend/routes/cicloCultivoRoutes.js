const express = require('express');
const router = express.Router();
const { insertarCicloCultivo, obtenerCiclosCultivo } = require('../controllers/ciclo_cultivoController.js');

router.post('/', insertarCicloCultivo);
router.get('/', obtenerCiclosCultivo); // ¡Esta es la línea que falta!

module.exports = router;