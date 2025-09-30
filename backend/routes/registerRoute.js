const express = require('express');
const router = express.Router();
const { insertarRegister, obtenerUsuarios, obtenerUsuarioPorId, actualizarUsuario, insertarLogin } = require('../controllers/registerController.js');

router.post('/', insertarRegister);
router.get('/', obtenerUsuarios);
router.get('/:id', obtenerUsuarioPorId);
router.put('/:id', actualizarUsuario);
router.post('/login', insertarLogin);

module.exports = router;
