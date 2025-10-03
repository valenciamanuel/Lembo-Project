const express = require('express');
const router = express.Router();
// 1. Importar el middleware de protección
const { protect } = require('../middleware/authMiddleware'); 

const { 
    insertarRegister, 
    obtenerUsuarios, // Ahora protegida
    obtenerUsuarioPorId, 
    actualizarUsuario,
    recuperarContrasena, 
    insertarLogin 
} = require('../controllers/registerController.js');

// Rutas Públicas
router.post('/', insertarRegister); // Crear usuario
router.post('/login', insertarLogin); // Iniciar sesión
router.post('/recuperar', recuperarContrasena); // Recuperar contraseña

// Rutas Privadas (Requieren JWT válido)
// Colocamos 'protect' antes del controlador para que se ejecute primero
router.get('/', protect, obtenerUsuarios); 
router.get('/:id', protect, obtenerUsuarioPorId); 
router.put('/:id', protect, actualizarUsuario); 

module.exports = router;
