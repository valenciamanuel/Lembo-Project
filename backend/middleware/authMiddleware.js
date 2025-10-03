const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
// Usamos el servicio de base de datos SQL en lugar del modelo Mongoose
const db = require('../config/db'); // ¡Asegúrate de que esta ruta sea correcta!


/**
 * @desc Middleware para proteger rutas.
 * Verifica si hay un token válido en la cabecera de la solicitud.
 */
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            // 1. Verificar el token usando el mismo secreto que en el controlador
            const decoded = jwt.verify(
                token, 
                process.env.JWT_SECRET || 'mi_secreto_seguro' // Usar el fallback del secreto
            );

            // 2. 🎯 CRÍTICO: Buscar el usuario en la tabla 'register' por ID
            // Seleccionamos los campos correctos de tu tabla: 'id', 'usertype', 'name', 'email'
            const [rows] = await db.query(
                'SELECT id, usertype, name, email FROM register WHERE id = ?', 
                [decoded.id]
            );

            // Si el usuario no se encuentra (la consulta devuelve 0 filas)
            if (rows.length === 0) {
                res.status(401);
                throw new Error('Usuario no encontrado');
            }

            // 3. Adjuntar los datos del usuario a la solicitud
            req.user = rows[0]; 
            next(); // Continuar con la ejecución de la ruta

        } catch (error) {
            // Este bloque captura errores como token expirado o firma inválida
            console.error(error);
            res.status(401);
            throw new Error('Token no autorizado, fallo en la verificación');
        }
    } else {
        // No se encontró la cabecera 'Authorization' o no tiene formato 'Bearer'
        res.status(401);
        throw new Error('No autorizado, no hay token');
    }
});

module.exports = { protect };
