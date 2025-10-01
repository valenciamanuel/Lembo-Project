const db = require('../config/db.js');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;
const BCRYPT_PATTERN = /^\$2[aby]\$.{56}$/;

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

const insertarLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
    }

    try {
        const [rows] = await db.query(
            'SELECT id, usertype, name, email, password FROM register WHERE email = ?',
            [email]
        );
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const user = rows[0];
        const stored = user.password;

        let valid = false;
        if (BCRYPT_PATTERN.test(stored)) {
            valid = await bcrypt.compare(password, stored);
        } else {
            valid = password === stored;
            if (valid) {
                const newHash = await bcrypt.hash(password, SALT_ROUNDS);
                await db.query('UPDATE register SET password = ? WHERE id = ?', [newHash, user.id]);
            }
        }

        if (!valid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        res.json({
            id: user.id,
            usertype: user.usertype,
            name: user.name,
            email: user.email
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

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

module.exports = {
    insertarRegister,
    insertarLogin,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario
};
