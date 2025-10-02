const db = require('../config/db.js');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const SALT_ROUNDS = 10;
const BCRYPT_PATTERN = /^\$2[aby]\$.{56}$/;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jordan.valencia@utp.edu.co',//modifique esta linea
    pass: 'tamz hlan xtbd kvjh',//modifique esta linea
  },
});

// Crea una contraseña temporal
function generateTempPassword(length = 12) {
  return crypto.getRandomValues(new Uint8Array(Math.ceil(length * 3 / 4))).toString('base64').replace(/\+/g, '0').replace(/\//g, '0').slice(0, length);
}
const recuperarContrasena = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  let connection;
  try {
    connection = await db.getConnection ? await db.getConnection() : null;

    // Use the same db.query interface you used elsewhere — adapt depending on your db helper
    const queryFn = connection ? connection.execute.bind(connection) : db.query.bind(db);

    // Find user by email
    const [rows] = await queryFn(
      'SELECT id, name, email FROM register WHERE email = ?',
      [email]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];

    // Generate temporary password
    const tempPassword = generateTempPassword(12);

    // Hash temp password and update DB
    const hashed = await bcrypt.hash(tempPassword, SALT_ROUNDS);
    await db.query('UPDATE register SET password = ? WHERE id = ?', [hashed, user.id]);

    // Prepare email
    const mailOptions = {
      from: 'jordan.valencia@utp.edu.co',///modifique esta linea
      to: user.email,
      subject: 'Password recovery / Temporary password',
      text: `Hello ${user.name},\n\nA temporary password has been generated for your account. Use the password below to log in, then change your password immediately.\n\nTemporary password: ${tempPassword}\n\nIf you did not request this, please contact support.\n\nRegards.`,
      html: `
        <p>Hello ${user.name},</p>
        <p>A temporary password has been generated for your account. Use the password below to log in, then change your password immediately.</p>
        <p><strong>Temporary password:</strong> ${tempPassword}</p>
        <p>If you did not request this, please contact support.</p>
        <p>Regards.</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Success response
    return res.json({ message: 'Fue enviada la contraseña temporal a tu correo' });
  } catch (err) {
    console.error('Error recuperarContrasena:', err);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection && connection.release) connection.release();
  }
};
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
    actualizarUsuario,
    recuperarContrasena
};
