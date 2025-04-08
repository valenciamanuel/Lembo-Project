const db = require('../config/db.js');

const insertarInsumo = (req, res) => {
    const { idInsumo, tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, descripcion, estado } = req.body;

    // Verificar que se hayan enviado todos los campos requeridos
    if (!idInsumo || !tipoInsumo || !nombreInsumo || !unidadMedida || !cantidad || !valorUnitario || !descripcion || !estado) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = 'INSERT INTO insumos (idInsumo, tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, descripcion, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [idInsumo, tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, descripcion, estado];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al insertar el insumo:', err);
            return res.status(500).json({ error: 'Error al insertar el insumo' });
        }
        res.status(201).json({ 
            id: result.insertId, 
            idInsumo, 
            tipoInsumo, 
            nombreInsumo, 
            unidadMedida, 
            cantidad, 
            valorUnitario, 
            descripcion, 
            estado 
        });
    });
};

module.exports = {
    insertarInsumo,
};
