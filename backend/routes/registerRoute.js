const express = require('express');
const router = express.Router();
const { insertarRegister, obtenerUsuarios, obtenerUsuarioPorId, actualizarUsuario,recuperarContrasena, insertarLogin } = require('../controllers/registerController.js');

router.post('/', insertarRegister);
router.get('/', obtenerUsuarios);
router.get('/:id', obtenerUsuarioPorId);
router.put('/:id', actualizarUsuario);
router.post('/login', insertarLogin);
router.post('/recuperar', recuperarContrasena);

module.exports = router;
