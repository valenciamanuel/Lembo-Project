const db = require('../config/db.js');

const insertarUso = (req, res) => {
    const { fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo } = req.body;
    
    if (!fecha_uso || !cantidad || !responsable || !valor_unitario || !valor_total || !observaciones || !insumo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = 'INSERT INTO uso_insumo (fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al insertar Asociacion:', err);
            return res.status(500).json({ error: 'Error al insertar Asociación' });
        }
        res.status(201).json({ id: result.insertId, fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo });
    });
};  

module.exports = {
    insertarUso,
};