const db = require('../config/db.js');

const insertarInsumo = (req, res) => {
    const { tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, valorTotal, descripcion, estado } = req.body;

    // Verificar que se hayan enviado todos los campos requeridos
    if (!tipoInsumo || !nombreInsumo || !unidadMedida || !cantidad || !valorUnitario || !valorTotal || !descripcion || !estado) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = 'INSERT INTO insumo (tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, valorTotal, descripcion, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, valorTotal, descripcion, estado];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al insertar el insumo:', err);
            return res.status(500).json({ error: 'Error al insertar el insumo' });
        }
        res.status(201).json({
            id: result.insertId,
            tipoInsumo,
            nombreInsumo,
            unidadMedida,
            cantidad,
            valorUnitario,
            valorTotal,
            descripcion,
            estado
        });
    });
};

const obtenerInsumos = (req, res) => {
    const sql = 'SELECT idInsumo, nombreInsumo FROM insumo';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener los insumos:', err);
            return res.status(500).json({ error: 'Error al obtener los insumos' });
        }
        res.status(200).json(results);
    });
};

module.exports = {
    insertarInsumo,
    obtenerInsumos,
};