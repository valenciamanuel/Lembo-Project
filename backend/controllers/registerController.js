// contusertypelers/registerContusertypeler.js
const db = require('../config/db.js');

const insertarRegister = async (req, res) => {
    console.log('llegó');
    const { usertype, IDtype, IDnum, name, email, phone, password } = req.body;

    // Validación de campos obligatorios
    if (!usertype || !IDtype || !IDnum || !name || !email || !phone || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Validación de formato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Email no válido' });
    }

    if (!/^\d+$/.test(IDnum)) {
        return res.status(400).json({ error: 'Número de documento inválido' });
    }

    if (!/^\d{7,15}$/.test(phone)) {
        return res.status(400).json({ error: 'Número de teléfono inválido' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    let connection;
    try {
        console.log('✅ Obteniendo conexión del pool para el registro.');
        connection = await db.getConnection();

        // 1. Revisar si el usuario ya existe
        const [results] = await connection.execute('SELECT * FROM register WHERE IDnum = ? OR email = ?', [IDnum, email]);
        

        if (results.length > 0) {
            return res.status(400).json({ error: 'El número de documento o el email ya están registrados' });
        }

        // 2. Insertar el nuevo usuario
        const [result] = await connection.execute(
            'INSERT INTO register (usertype, IDtype, IDnum, name, email, phone, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [usertype, IDtype, IDnum, name, email, phone, password]
        );

       

        res.status(201).json({
            id: result.insertId,
            usertype,
            IDtype,
            IDnum,
            name,
            email,
            phone
        });

    } catch (err) {
        console.error('❌ Error al insertar el usuario:', err);
        res.status(500).json({ error: 'Error interno al insertar el usuario' });
    } finally {
        if (connection) {
            connection.release(); // ✅ Esto asegura que la conexión se libera siempre
        }
    }
};

const obtenerUsuarios = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, email, usertype FROM register");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error al obtener usuarios:", err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// Obtener usuario por ID
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM register WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error al obtener usuario:", err);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

// Actualizar usuario
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, usertype } = req.body;

    const sql = `
      UPDATE register 
      SET name = ?, email = ?, password = IFNULL(?, password), usertype = ?
      WHERE id = ?
    `;
    const values = [name, email, password || null, usertype, id];

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "✅ Usuario actualizado correctamente" });
  } catch (err) {
    console.error("❌ Error al actualizar usuario:", err);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};
const insertarLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
    }

    // Buscar usuario por email y password sin hashing ni encriptación
    const [rows] = await db.query(
      'SELECT id, usertype, name, email FROM register WHERE email = ? AND password = ?',
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = rows[0];

    // Retornar info básica del usuario para almacenar en localStorage
    res.json({
      id: user.id,
      usertype: user.usertype,
      name: user.name,
      email: user.email
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};
module.exports = {
    insertarRegister,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    insertarLogin
};