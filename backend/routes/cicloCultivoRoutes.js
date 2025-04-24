const express = require('express');
const router = express.Router();
const{ insertarCicloCultivo } = require('../controllers/ciclo_cultivoController.js');

router.post('/', insertarCicloCultivo);

module.exports = router;