const express = require('express');
const router = express.Router();
const { insertarInsumo, obtenerInsumos } = require('../controllers/insumoController.js');

router.post('/', insertarInsumo);
router.get('/', obtenerInsumos);

module.exports = router;