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

// const insertarRegister = asyncHandler(async (req, res) => {
//     // ... CÓDIGO COMPLETO DE insertarRegister ...
//     res.status(501).json({ message: "Función de registro no implementada." });
// });

const insertarRegister = async (req, res) => {
    const { usertype, IDtype, IDnum, name, email, phone, password } = req.body;
    if (!usertype || !IDtype || !IDnum || !name || !email || !phone || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: 'Email no válido' });
    if (!/^\d+$/.test(IDnum)) return res.status(400).json({ error: 'Número de documento inválido' });
    if (!/^\d{7,15}$/.test(phone)) return res.status(400).json({ error: 'Número de teléfono inválido' });
    if (password.length < 6) return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });

    let connection;
    try {
        connection = await db.getConnection();
        const [exists] = await connection.execute(
            'SELECT id FROM register WHERE IDnum = ? OR email = ?',
            [IDnum, email]
        );
        if (exists.length > 0) {
            return res.status(400).json({ error: 'El número de documento o el email ya están registrados' });
        }
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const [result] = await connection.execute(
            `INSERT INTO register
                (usertype, IDtype, IDnum, name, email, phone, password)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [usertype, IDtype, IDnum, name, email, phone, hashedPassword]
        );
        res.status(201).json({
            id: result.insertId,
            usertype, IDtype, IDnum, name, email, phone
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno al insertar el usuario' });
    } finally {
        if (connection) connection.release();
    }
};

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

const obtenerUsuarios = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, usertype, IDtype, IDnum, name, email, phone FROM register"
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
    };

const obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(
            "SELECT id, usertype, IDtype, IDnum, name, email, phone FROM register WHERE id = ?",
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener usuario" });
    }
};

const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, usertype } = req.body;

        let hashedPassword = null;
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
            }
            hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        }

        const sql = `
            UPDATE register
            SET name = ?, email = ?, password = COALESCE(?, password), usertype = ?
            WHERE id = ?
        `;
        const values = [name, email, hashedPassword, usertype, id];

        const [result] = await db.query(sql, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({ message: "✅ Usuario actualizado correctamente" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al actualizar usuario" });
    }
    };


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