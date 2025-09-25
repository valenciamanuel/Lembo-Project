const express = require('express');
const router = express.Router();
const{ insertarUso, obtenerUsos } = require('../controllers/usoController');

router.post('/', insertarUso);
router.get('/', obtenerUsos);

module.exports = router;