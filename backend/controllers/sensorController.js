const db = require('../config/db.js');

const insertarSensor = async (req, res) => {
    try {
        const { tipoSensor, nombreSensor, unidadMedida, tiempoEscaneo, descripcion, estado } = req.body;

        if (!tipoSensor || !nombreSensor || !unidadMedida || !tiempoEscaneo || !descripcion || !estado) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const sql = 'INSERT INTO sensores (tipoSensor, nombreSensor, unidadMedida, tiempoEscaneo, descripcion, estado) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await db.query(sql, [tipoSensor, nombreSensor, unidadMedida, tiempoEscaneo, descripcion, estado]);

        res.status(201).json({
            id: result.insertId,
            tipoSensor,
            nombreSensor,
            unidadMedida,
            tiempoEscaneo,
            descripcion,
            estado
        });
    } catch (err) {
        console.error('Error al insertar el sensor:', err);
        res.status(500).json({ error: 'Error al insertar el sensor' });
    }
};

const obtenerSensores = async (req, res) => {
    try {
        const sql = 'SELECT * FROM sensores';
        const [results] = await db.query(sql);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error al obtener los sensores:', err);
        res.status(500).json({ error: 'Error al obtener los sensores' });
    }
};

module.exports = {
    insertarSensor,
    obtenerSensores,
};
