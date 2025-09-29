const express = require('express');
const router = express.Router();
const { insertarRegister, obtenerUsuarios, obtenerUsuarioPorId, actualizarUsuario } = require('../controllers/registerController.js');

router.post('/', insertarRegister);
router.get('/', obtenerUsuarios);
router.get('/:id', obtenerUsuarioPorId);
router.put('/:id', actualizarUsuario);

module.exports = router;
