const db = require('../config/db.js');

const insertarRegister = async (req, res) => {
    console.log('llegó');
    let { usertype, IDtype, IDnum, name, email, phone, password } = req.body;

    if (!usertype || !IDtype || !IDnum || !name || !email || !phone || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    usertype = usertype.trim();
    IDtype = IDtype.trim();
    IDnum = IDnum.trim();
    name = name.trim();
    email = email.trim();
    phone = phone.trim();
    password = password.trim();

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

    try {
        const [results] = await db.query('SELECT * FROM register WHERE IDnum = ? OR email = ?', [IDnum, email]);
        console.log('wtf');

        if (results.length > 0) {
            return res.status(400).json({ error: 'El número de documento o el email ya están registrados' });
        }

        const [result] = await db.query(
            'INSERT INTO register (usertype, IDtype, IDnum, name, email, phone, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [usertype, IDtype, IDnum, name, email, phone, password]
        );

        console.log('melo no se que pasa');

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
        console.error('Error al insertar el usuario:', err);
        res.status(500).json({ error: 'Error interno al insertar el usuario' });
    }
};

module.exports = {
    insertarRegister,
};
