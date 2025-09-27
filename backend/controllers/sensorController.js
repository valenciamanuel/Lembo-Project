const db = require('../config/db.js');

const insertarSensor = async (req, res) => {
    try {
        const { tipoSensor, nombreSensor, unidadMedida, tiempoEscaneo, descripcion, estado } = req.body;
        // ✅ CORRECCIÓN: Obtener el nombre del archivo de req.file
        const image = req.file ? req.file.filename : null; 

        if (!tipoSensor || !nombreSensor || !unidadMedida || !tiempoEscaneo || !descripcion || !estado) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // ✅ CORRECCIÓN: Incluir la columna 'image' en el SQL
        const sql = 'INSERT INTO sensores (tipoSensor, nombreSensor, unidadMedida, tiempoEscaneo, descripcion, estado, image) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const [result] = await db.query(sql, [tipoSensor, nombreSensor, unidadMedida, tiempoEscaneo, descripcion, estado, image]);

        res.status(201).json({
            id: result.insertId,
            tipoSensor,
            nombreSensor,
            unidadMedida,
            tiempoEscaneo,
            descripcion,
            estado,
            image // Devolver el nombre de la imagen al frontend
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

// ✅ Obtener un sensor por ID (esta función ya estaba correcta)
const obtenerSensorPorId = async (req, res) => {
    try {
        const { id } = req.params; // viene de la URL
        const [rows] = await db.query("SELECT * FROM sensores WHERE idSensor = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Sensor no encontrado" });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error("❌ Error al obtener sensor:", err);
        res.status(500).json({ error: "Error al obtener sensor" });
    }
};


const actualizarSensor = async (req, res) => {
    try {
        const { id } = req.params;
        let { tipoSensor, nombreSensor, unidadMedida, tiempoEscaneo, descripcion, estado } = req.body;
        
        // ✅ CORRECCIÓN: Usar req.file.filename si se subió una nueva imagen;
        // de lo contrario, usar la imagen que viene en el body (si se envió, si no null)
        const image = req.file ? req.file.filename : (req.body.image ?? null);


        // Normalizar: undefined → null
        tipoSensor = tipoSensor ?? null;
        nombreSensor = nombreSensor ?? null;
        unidadMedida = unidadMedida ?? null;
        tiempoEscaneo = tiempoEscaneo ?? null;
        descripcion = descripcion ?? null;
        estado = estado ?? null;

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

        res.json({ message: "✅ Sensor actualizado correctamente" });
    } catch (err) {
        console.error("❌ Error al actualizar el sensor:", err.message || err);
        res.status(500).json({ error: "Error al actualizar el sensor" });
    }
};


module.exports = {
    insertarSensor,
    obtenerSensores,
    obtenerSensorPorId,
    actualizarSensor,
};