const db = require('../config/db.js');

const insertarCicloCultivo = (req, res) => {
    const { cicloID, cicloName, siembraDate, cosechaDate, news, description, state } = req.body;
    
    if (!cicloID || !cicloName || !siembraDate || !cosechaDate || !news || !description || !state) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = 'INSERT INTO ciclocultivo (cicloID, cicloName, siembraDate, cosechaDate, news, description, state) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [cicloID, cicloName, siembraDate, cosechaDate, news, description, state];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al insertar el ciclo de cultivo:', err);
            return res.status(500).json({ error: 'Error al insertar el ciclo de cultivo' });
        }
        res.status(201).json({ id: result.insertId, cicloID, cicloName, siembraDate, cosechaDate, news, description, state });
    });
};

module.exports = {
    insertarCicloCultivo,
};