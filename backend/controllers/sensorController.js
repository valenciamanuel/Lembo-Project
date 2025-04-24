const db = require('../config/db.js');

const insertarSensor = (req, res) => {
    const { tipoSensor, nombreSensor, unidadMedida, tiempoEscaneo, descripcion, estado } = req.body;

    // Validación de campos obligatorios
    if (!tipoSensor || !nombreSensor || !unidadMedida || !tiempoEscaneo || !descripcion || !estado) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = 'INSERT INTO sensores (tipoSensor, nombreSensor, unidadMedida, tiempoEscaneo, descripcion, estado) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [tipoSensor, nombreSensor, unidadMedida, tiempoEscaneo, descripcion, estado];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al insertar el sensor:', err);
            return res.status(500).json({ error: 'Error al insertar el sensor' });
        }
        res.status(201).json({
            id: result.insertId,
            tipoSensor,
            nombreSensor,
            unidadMedida,
            tiempoEscaneo,
            descripcion,
            estado
        });
    });
};

const obtenerSensores = (req, res) => {
    const sql = 'SELECT idSensor, nombreSensor FROM sensores';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener los sensores:', err);
            return res.status(500).json({ error: 'Error al obtener los sensores' });
        }
        res.status(200).json(results);
    });
};

module.exports = {
    insertarSensor,
    obtenerSensores,
};