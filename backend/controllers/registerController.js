const db = require('../config/db.js');

const insertarRegister = (req, res) => {
    const { usertype, IDtype, IDnum, name, email, phone, password } = req.body;
    
    if (!usertype || !IDtype || !IDnum || !name || !email || !phone || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = 'INSERT INTO register (usertype, IDtype, IDnum, name, email, phone, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [usertype, IDtype, IDnum, name, email, phone, password];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al insertar el ciclo de cultivo:', err);
            return res.status(500).json({ error: 'Error al insertar el ciclo de cultivo' });
        }
        res.status(201).json({ id: result.insertId, usertype, IDtype, IDnum, name, email, phone, password });
    });
};

module.exports = {
    insertarRegister,
};