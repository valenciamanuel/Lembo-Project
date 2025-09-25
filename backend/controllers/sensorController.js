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

const obtenerSensorPorId = async (req, res) => {
    const { id } = req.params;
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.execute('SELECT * FROM sensores WHERE idSensor = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Sensor no encontrado' });
        }
        
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('❌ Error al obtener el sensor:', err.message || err);
        res.status(500).json({ error: 'Error al obtener el sensor' });
    } finally {
        if (connection) connection.release();
    }
};

const actualizarSensor = async (req, res) => {
    const { id } = req.params;
    const { tipoSensor, nombreSensor, ubicacion, tiempoEscaneo, descripcion, estado } = req.body;
    
    let connection;
    try {
        const sql = `
            UPDATE sensores 
            SET tipoSensor = ?, nombreSensor = ?, ubicacion = ?, tiempoEscaneo = ?, descripcion = ?, estado = ?
            WHERE idSensor = ?
        `;
        const values = [tipoSensor, nombreSensor, ubicacion, tiempoEscaneo, descripcion, estado, id];
        
        connection = await db.getConnection();
        const [result] = await connection.execute(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Sensor no encontrado' });
        }

        res.status(200).json({ message: 'Sensor actualizado exitosamente' });
    } catch (err) {
        console.error('❌ Error al actualizar el sensor:', err.message || err);
        res.status(500).json({ error: 'Error al actualizar el sensor' });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    insertarSensor,
    obtenerSensores,
    obtenerSensorPorId,
    actualizarSensor
};
