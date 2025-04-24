const express = require('express');
const router = express.Router();
const { insertarInsumo } = require('../controllers/insumoController.js');

router.post('/', insertarInsumo);

module.exports = router;
