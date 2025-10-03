const db = require('../config/db.js');

const validarTiempoPositivo = (value) => {
    const numericValue = Number(value);
    return !isNaN(numericValue) && numericValue >= 0; 
};

const insertarSensor = async (req, res) => {
    try {
        const { tipoSensor, nombreSensor, unidadMedida, tiempoEscaneo, descripcion, estado } = req.body;
        const image = req.file ? req.file.filename : null; 

        if (!tipoSensor || !nombreSensor || !unidadMedida || tiempoEscaneo == null || !descripcion || !estado) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        
        if (!validarTiempoPositivo(tiempoEscaneo)) {
            return res.status(400).json({ error: 'El tiempo de escaneo debe ser un número positivo o cero.' });
        }
        const numericTiempoEscaneo = Number(tiempoEscaneo);

        const sql = 'INSERT INTO sensores (tipoSensor, nombreSensor, unidadMedida, tiempoEscaneo, descripcion, estado, image) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const [result] = await db.query(sql, [tipoSensor, nombreSensor, unidadMedida, numericTiempoEscaneo, descripcion, estado, image]);

        console.log(`Sensor creado: ID ${result.insertId}, Tipo: ${tipoSensor}, Nombre: ${nombreSensor}`);

        res.status(201).json({
            message: "Sensor creado correctamente",
            id: result.insertId,
            tipoSensor,
            nombreSensor,
            unidadMedida,
            tiempoEscaneo: numericTiempoEscaneo,
            descripcion,
            estado,
            image 
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
    try {
        const { id } = req.params;
        
        const numericId = Number(id);
        if (isNaN(numericId) || !Number.isInteger(numericId) || numericId <= 0) {
            return res.status(400).json({ error: "El ID del sensor debe ser un número entero positivo." });
        }
        
        const [rows] = await db.query("SELECT * FROM sensores WHERE idSensor = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Sensor no encontrado" });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error("Error al obtener sensor:", err);
        res.status(500).json({ error: "Error al obtener sensor" });
    }
};

const actualizarSensor = async (req, res) => {
    try {
        const { id } = req.params;
        let { tipoSensor, nombreSensor, unidadMedida, tiempoEscaneo, descripcion, estado } = req.body;
        
        const numericId = Number(id);
        if (isNaN(numericId) || !Number.isInteger(numericId) || numericId <= 0) {
            return res.status(400).json({ error: "El ID del sensor a actualizar debe ser un número entero positivo." });
        }
        
        const image = req.file ? req.file.filename : (req.body.image ?? null);

        tipoSensor = tipoSensor ?? null;
        nombreSensor = nombreSensor ?? null;
        unidadMedida = unidadMedida ?? null;
        descripcion = descripcion ?? null;
        estado = estado ?? null;

        if (tiempoEscaneo !== null && tiempoEscaneo !== undefined) {
             if (!validarTiempoPositivo(tiempoEscaneo)) {
                return res.status(400).json({ error: 'El tiempo de escaneo debe ser un número positivo o cero.' });
            }
            tiempoEscaneo = Number(tiempoEscaneo);
        }

        const sql = `
            UPDATE sensores
            SET tipoSensor = ?, nombreSensor = ?, unidadMedida = ?, tiempoEscaneo = ?, descripcion = ?, estado = ?, image = ?
            WHERE idSensor = ?
        `;

        const values = [tipoSensor, nombreSensor, unidadMedida, tiempoEscaneo, descripcion, estado, image, id];

        const connection = await db.getConnection();
        const [result] = await connection.execute(sql, values);
        connection.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Sensor no encontrado" });
        }

        res.json({ message: "Sensor actualizado correctamente" });
    } catch (err) {
        console.error("Error al actualizar el sensor:", err.message || err);
        res.status(500).json({ error: "Error al actualizar el sensor" });
    }
};

module.exports = {
    insertarSensor,
    obtenerSensores,
    obtenerSensorPorId,
    actualizarSensor,
};
