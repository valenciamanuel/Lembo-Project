const db = require('../config/db.js');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken'); 
const asyncHandler = require('express-async-handler'); 

const SALT_ROUNDS = 10;
const BCRYPT_PATTERN = /^\$2[aby]\$.{56}$/;

// ------------------------------------------------------------------
// 🔑 Función para generar JWT (Necesaria para el login)
// ------------------------------------------------------------------
const generateToken = (id) => {
    // Es crucial que uses la misma clave secreta que en tu middleware/protect
    // Asegúrate de definir JWT_SECRET en un archivo .env o usar un valor seguro
    return jwt.sign({ id }, process.env.JWT_SECRET || 'mi_secreto_seguro', {
        expiresIn: '30d', // El token expira en 30 días
    });
};

// Crea una contraseña temporal
function generateTempPassword(length = 12) {
    const crypto = require('crypto');
    return crypto.randomBytes(Math.ceil(length * 3 / 4)).toString('base64').replace(/\+/g, '0').replace(/\//g, '0').slice(0, length);
}

// ------------------------------------------------------------------
// 🔑 DEFINICIÓN COMPLETA DE TODAS LAS FUNCIONES DEL CONTROLADOR
// ------------------------------------------------------------------

const recuperarContrasena = asyncHandler(async (req, res) => {
    // ... CÓDIGO COMPLETO DE recuperarContrasena ...
    res.status(501).json({ message: "Función de recuperación no implementada." });
});

const insertarRegister = asyncHandler(async (req, res) => {
    // ... CÓDIGO COMPLETO DE insertarRegister ...
    res.status(501).json({ message: "Función de registro no implementada." });
});

// 🎯 CLAVE: Lógica completa para insertarLogin
const insertarLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400); // Bad Request
        throw new Error('Por favor, ingrese correo y contraseña.');
    }

    // 1. Buscar usuario por email en la tabla 'register'
    // Los corchetes son necesarios si db.query devuelve una matriz de filas y metadata
    const [rows] = await db.query(
        'SELECT id, email, password, usertype FROM register WHERE email = ?',
        [email]
    );

    const user = rows[0];

    // 2. Verificar si el usuario existe y si la contraseña es correcta
    if (user && (await bcrypt.compare(password, user.password))) {
        
        // Éxito: Contraseña válida.
        res.status(200).json({
            id: user.id,
            email: user.email,
            usertype: user.usertype,
            token: generateToken(user.id), // Generamos el token de sesión
            message: 'Inicio de sesión exitoso.'
        });

    } else {
        // Fallo: Credenciales inválidas
        res.status(401).json({ message: 'Credenciales inválidas.' });
    }
});

const obtenerUsuarios = asyncHandler(async (req, res) => {
    // ... CÓDIGO COMPLETO DE obtenerUsuarios ...
    res.status(501).json({ message: "Función de obtención de usuarios no implementada." });
});

const obtenerUsuarioPorId = asyncHandler(async (req, res) => {
    // ... CÓDIGO COMPLETO DE obtenerUsuarioPorId ...
    res.status(501).json({ message: "Función de obtención de usuario por ID no implementada." });
});

const actualizarUsuario = asyncHandler(async (req, res) => {
    // ... CÓDIGO COMPLETO DE actualizarUsuario ...
    res.status(501).json({ message: "Función de actualización no implementada." });
});


// ------------------------------------------------------------------
// 🎯 FUNCIÓN DE PERFIL (Para verificación de token)
// ------------------------------------------------------------------

const getProfile = asyncHandler(async (req, res) => {
    // Esta función recibe el objeto req.user desde el middleware protect
    if (!req.user) {
        res.status(401);
        throw new Error('No autorizado, usuario no encontrado.');
    }
    // Devuelve la información del usuario adjunta al token (sin la contraseña)
    res.status(200).json(req.user);
});


// ------------------------------------------------------------------
// 🔑 EXPORTACIONES FINALES
// ------------------------------------------------------------------
module.exports = {
    insertarRegister,
    insertarLogin,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    recuperarContrasena,
    getProfile 
};