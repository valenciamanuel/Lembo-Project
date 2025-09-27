const express = require('express');
const router = express.Router();
const{ insertarUso, obtenerUsos, obtenerUsoPorId, actualizarUso } = require('../controllers/usoController');

router.post('/', insertarUso);
router.get('/', obtenerUsos);

router.get('/:id', obtenerUsoPorId);
router.put('/:id', actualizarUso);

module.exports = router;