const express = require('express');
const router = express.Router();
const { insertarCultivo, obtenerCultivos, obtenerCultivoPorId, actualizarCultivo } = require('../controllers/cultivoController.js');

router.get('/', obtenerCultivos);
router.get('/', insertarCultivo);


router.get('/:id', obtenerCultivoPorId);
router.put('/:id', actualizarCultivo);

module.exports = router;