const express = require('express');
const router = express.Router();
const { insertarCultivo, obtenerCultivos } = require('../controllers/cultivoController.js');

router.post('/', insertarCultivo);
router.get('/', obtenerCultivos);

module.exports = router;