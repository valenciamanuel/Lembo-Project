const db = require('../config/db.js');

const insertarCultivo = (req, res) => {
    const { cultivoType, cultivoName, cultivoID, size, location, description, state } = req.body;

    if (!cultivoType || !cultivoName || !cultivoID || !size || !location || !description || !state) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = 'INSERT INTO cultivo (cultivoType, cultivoName, cultivoID, size, location, description, state) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [cultivoType, cultivoName, cultivoID, size, location, description, state];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al insertar el cultivo:', err);
            return res.status(500).json({ error: 'Error al insertar el cultivo' });
        }
        res.status(201).json({ id: result.insertId, cultivoType, cultivoName, cultivoID, size, location, description, state });
    });
};

module.exports = {
    insertarCultivo,
};