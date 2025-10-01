const db = require('../config/db.js');
const fs = require('fs');
const path = require('path');

const deleteFileIfExist = (filename) => {
    if (filename) {
        const filePath = path.join(__dirname, '..', '..', 'fronted', 'public', 'uploads', filename); 
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                console.log(` Archivo de ciclo ${filename} eliminado.`);
            } catch (err) {
                console.error(` Error al eliminar el archivo ${filename}:`, err);
            }
        }
    }
};

// Función auxiliar: Obtiene la fecha de hoy en formato YYYY-MM-DD (string)
const getTodayString = () => {
    const d = new Date();
    // Creamos un nuevo objeto Date fijado a las 00:00:00 local del servidor.
    const todayLocal = new Date(d.getFullYear(), d.getMonth(), d.getDate()); 

    const year = todayLocal.getFullYear();
    const month = String(todayLocal.getMonth() + 1).padStart(2, '0');
    const day = String(todayLocal.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const insertarCicloCultivo = async (req, res) => {
    let { cicloID, cicloName, siembraDate, cosechaDate, news, description, state } = req.body;
    const image = req.file ? req.file.filename : null; 
    
    if (!cicloID || !cicloName || !siembraDate || !cosechaDate || !news || !state) {
        deleteFileIfExist(image);
        return res.status(400).json({ error: 'Faltan campos obligatorios para el ciclo: ID, Nombre, Fechas, Novedades y Estado.' });
    }

    // ✅ VALIDACIÓN 1: El ID debe ser un número positivo
    const numericCicloID = Number(cicloID);
    if (isNaN(numericCicloID) || numericCicloID <= 0) {
        deleteFileIfExist(image);
        return res.status(400).json({ error: 'El ID del ciclo debe ser un número positivo (mayor a cero).' });
    }
    
    const todayString = getTodayString();
    const siembraStr = siembraDate.split('T')[0];
    const cosechaStr = cosechaDate.split('T')[0];

    // ✅ VALIDACIÓN 2: Siembra debe ser HOY o FUTURA (siembra >= today).
    // Usamos comparación de strings para evitar problemas de hora/zona horaria.
    if (siembraStr < todayString) {
        deleteFileIfExist(image);
        return res.status(400).json({ error: 'La fecha de siembra no puede ser anterior al día de hoy.' });
    }
    
    // Convertimos a objetos Date limpios (medianoche) para la comparación lógica siembra vs. cosecha
    const siembra = new Date(siembraStr);
    const cosecha = new Date(cosechaStr);
    siembra.setHours(0, 0, 0, 0); 
    cosecha.setHours(0, 0, 0, 0);

    // ✅ VALIDACIÓN 3: Cosecha debe ser estrictamente posterior a siembra.
    if (cosecha <= siembra) {
        deleteFileIfExist(image);
        return res.status(400).json({ error: 'La fecha de cosecha debe ser posterior a la fecha de siembra.' });
    }

    state = state.toLowerCase();

    const sql = "INSERT INTO ciclocultivo (cicloID, cicloName, siembraDate, cosechaDate, news, description, state, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [cicloID, cicloName, siembraStr, cosechaStr, news, description, state, image];

    let connection;
    try {
        console.log(' Preparando para ejecutar la consulta SQL.'); 
        connection = await db.getConnection();
        const [result] = await connection.execute(sql, values);
        
        console.log(' Ciclo de cultivo insertado con ID:', result.insertId);
        
        return res.status(201).json({ 
            message: 'Ciclo de cultivo creado exitosamente',
            id: result.insertId, 
            image: image
        });

    } catch (err) {
        console.error(' Error al insertar el ciclo de cultivo:', err.message || err);
        deleteFileIfExist(image);
        // Puedes agregar más manejo de errores SQL si el ID ya existe, por ejemplo.
        return res.status(500).json({ error: 'Error al insertar el ciclo de cultivo', details: err.message });
    } finally {
        if (connection) {
            connection.release(); 
        }
    }
};

const obtenerCiclosCultivo = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        const sql = "SELECT id, cicloID, cicloName, siembraDate, cosechaDate, news, description, state, image FROM ciclocultivo";
        const [rows] = await connection.execute(sql);

        console.log(` ${rows.length} ciclos de cultivo obtenidos`);
        return res.status(200).json(rows);
    } catch (err) {
        console.error(' Error al obtener los ciclos de cultivo:', err.message || err);
        return res.status(500).json({ error: 'Error al obtener los ciclos de cultivo' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const obtenerCicloPorId = async (req, res) => {
    const { id } = req.params; 
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.execute('SELECT * FROM ciclocultivo WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Ciclo de cultivo no encontrado' });
        }
        
        res.status(200).json(rows[0]); 
    } catch (err) {
        console.error(' Error al obtener el ciclo de cultivo:', err.message || err);
        res.status(500).json({ error: 'Error al obtener el ciclo de cultivo' });
    } finally {
        if (connection) connection.release();
    }
};

const actualizarCicloCultivo = async (req, res) => {
    const { id } = req.params;
    let { cicloID, cicloName, siembraDate, cosechaDate, news, description, state } = req.body;
    const newImage = req.file ? req.file.filename : null;

    if (!cicloID || !cicloName || !siembraDate || !cosechaDate || !news || !description || !state) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    
    // ✅ VALIDACIÓN 1: El ID debe ser un número positivo
    const numericCicloID = Number(cicloID);
    if (isNaN(numericCicloID) || numericCicloID <= 0) {
        return res.status(400).json({ error: 'El ID del ciclo debe ser un número positivo (mayor a cero).' });
    }

    const todayString = getTodayString();
    const siembraStr = siembraDate.split('T')[0];
    const cosechaStr = cosechaDate.split('T')[0];

    // ✅ VALIDACIÓN 2: Siembra debe ser HOY o FUTURA (siembra >= today).
    if (siembraStr < todayString) {
        return res.status(400).json({ error: 'La fecha de siembra no puede ser anterior al día de hoy.' });
    }
    
    // Convertimos a objetos Date limpios (medianoche) para la comparación lógica siembra vs. cosecha
    const siembra = new Date(siembraStr);
    const cosecha = new Date(cosechaStr);
    siembra.setHours(0, 0, 0, 0); 
    cosecha.setHours(0, 0, 0, 0);
    
    // ✅ VALIDACIÓN 3: Cosecha debe ser estrictamente posterior a siembra.
    if (cosecha <= siembra) {
        return res.status(400).json({ error: 'La fecha de cosecha debe ser posterior a la fecha de siembra.' });
    }

    state = state.toLowerCase();

    let connection;
    try {
        const sql = `
            UPDATE ciclocultivo
            SET cicloID     = ?,
                cicloName   = ?,
                siembraDate = ?,
                cosechaDate = ?,
                news        = ?,
                description = ?,
                state       = ?,
                image       = IFNULL(?, image)
            WHERE id = ?
        `;
        const values = [
            cicloID,
            cicloName,
            siembraStr,
            cosechaStr,
            news,
            description,
            state,
            newImage,
            id
        ];

        connection = await db.getConnection();
        const [result] = await connection.execute(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Ciclo de cultivo no encontrado' });
        }

        res.status(200).json({ message: 'Ciclo de cultivo actualizado exitosamente' });
    } catch (err) {
        console.error(' Error al actualizar el ciclo de cultivo:', err.message || err);
        res.status(500).json({ error: 'Error al actualizar el ciclo de cultivo', details: err.message });
    } finally {
        if (connection) connection.release();
    }
};


const toggleCicloEstado = async (req, res) => {
    const { id } = req.params; 
    let { state } = req.body; 
    
    state = state.toLowerCase();

    if (state !== 'activo' && state !== 'inactivo') {
        return res.status(400).json({ error: 'Estado no válido. Debe ser "activo" o "inactivo".' });
    }

    let connection;
    try {
        const sql = 'UPDATE ciclocultivo SET state = ? WHERE id = ?';
        const values = [state, id];

        connection = await db.getConnection();
        const [result] = await connection.execute(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Ciclo de cultivo no encontrado' });
        }

        res.status(200).json({ message: `Ciclo de cultivo ${state} exitosamente.` });
    } catch (err) {
        console.error(' Error al cambiar el estado del ciclo:', err.message || err);
        res.status(500).json({ error: 'Error al cambiar el estado del ciclo' });
    } finally {
        if (connection) connection.release();
    }
};


module.exports = {
    insertarCicloCultivo,
    obtenerCiclosCultivo,
    obtenerCicloPorId,
    actualizarCicloCultivo,
    toggleCicloEstado,
};