const db = require('../config/db.js');
const fs = require('fs');
const path = require('path');

const deleteFileIfExist = (filename) => {
    if (filename) {
        const filePath = path.join(__dirname, '..', '..', 'fronted', 'public', 'uploads', filename); 
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                console.log(`Archivo de ciclo ${filename} eliminado.`);
            } catch (err) {
                console.error(`Error al eliminar el archivo ${filename}:`, err);
            }
        }
    }
};

const getTodayString = () => {
    const d = new Date();
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

    const numericCicloID = Number(cicloID);
    if (isNaN(numericCicloID) || numericCicloID <= 0) {
        deleteFileIfExist(image);
        return res.status(400).json({ error: 'El ID del ciclo debe ser un número positivo (mayor a cero).' });
    }
    
    const todayString = getTodayString();
    const siembraStr = siembraDate.split('T')[0];
    const cosechaStr = cosechaDate.split('T')[0];

    if (siembraStr < todayString) {
        deleteFileIfExist(image);
        return res.status(400).json({ error: 'La fecha de siembra no puede ser anterior al día de hoy.' });
    }
    
    const siembra = new Date(siembraStr);
    const cosecha = new Date(cosechaStr);
    siembra.setHours(0, 0, 0, 0); 
    cosecha.setHours(0, 0, 0, 0);

    if (cosecha <= siembra) {
        deleteFileIfExist(image);
        return res.status(400).json({ error: 'La fecha de cosecha debe ser posterior a la fecha de siembra.' });
    }

    const diffTime = Math.abs(cosecha - siembra);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    let tipoCiclo = '';
    if (diffDays < 365) {
        tipoCiclo = 'Corto';
    } else if (diffDays >= 365 && diffDays <= 730) {
        tipoCiclo = 'Intermedio';
    } else {
        tipoCiclo = 'Largo (perenne)';
    }

    state = state.toLowerCase();

    const sql = "INSERT INTO ciclocultivo (cicloID, cicloName, siembraDate, cosechaDate, news, description, state, image, tipoCiclo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [cicloID, cicloName, siembraStr, cosechaStr, news, description, state, image, tipoCiclo];

    let connection;
    try {
        console.log('Preparando para ejecutar la consulta SQL.'); 
        connection = await db.getConnection();
        const [result] = await connection.execute(sql, values);
        
        console.log('Ciclo de cultivo insertado con ID:', result.insertId);
        
        return res.status(201).json({ 
            success: true,
            message: `Ciclo de cultivo "${cicloName}" creado exitosamente.`,
            id: result.insertId, 
            image: image,
            tipoCiclo: tipoCiclo
        });

    } catch (err) {
        console.error('Error al insertar el ciclo de cultivo:', err.message || err);
        deleteFileIfExist(image);
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
        const sql = "SELECT id, cicloID, cicloName, siembraDate, cosechaDate, news, description, state, image, tipoCiclo FROM ciclocultivo";
        const [rows] = await connection.execute(sql);

        console.log(`${rows.length} ciclos de cultivo obtenidos`);
        return res.status(200).json(rows);
    } catch (err) {
        console.error('Error al obtener los ciclos de cultivo:', err.message || err);
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
        const sql = "SELECT * FROM ciclocultivo WHERE id = ?";
        const [rows] = await connection.execute(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Ciclo de cultivo no encontrado' });
        }

        console.log(`Ciclo de cultivo con id ${id} obtenido`);
        return res.status(200).json(rows[0]);
    } catch (err) {
        console.error('Error al obtener el ciclo por id:', err.message || err);
        return res.status(500).json({ error: 'Error al obtener el ciclo de cultivo' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// --- NUEVO: Actualizar ciclo ---
const actualizarCicloCultivo = async (req, res) => {
    const { id } = req.params;
    let { cicloID, cicloName, siembraDate, cosechaDate, news, description, state } = req.body;
    const image = req.file ? req.file.filename : null;

    let connection;
    try {
        connection = await db.getConnection();
        const [exist] = await connection.execute("SELECT image FROM ciclocultivo WHERE id = ?", [id]);
        if (exist.length === 0) {
            if (image) deleteFileIfExist(image);
            return res.status(404).json({ error: 'Ciclo no encontrado' });
        }

        const siembraStr = siembraDate.split('T')[0];
        const cosechaStr = cosechaDate.split('T')[0];
        if (new Date(cosechaStr) <= new Date(siembraStr)) {
            if (image) deleteFileIfExist(image);
            return res.status(400).json({ error: 'La cosecha debe ser posterior a la siembra.' });
        }

        const diffTime = Math.abs(new Date(cosechaStr) - new Date(siembraStr));
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        let tipoCiclo = '';
        if (diffDays < 365) {
            tipoCiclo = 'Corto';
        } else if (diffDays >= 365 && diffDays <= 730) {
            tipoCiclo = 'Intermedio';
        } else {
            tipoCiclo = 'Largo (perenne)';
        }

        state = state.toLowerCase();

        const sql = `
            UPDATE ciclocultivo 
            SET cicloID=?, cicloName=?, siembraDate=?, cosechaDate=?, news=?, description=?, state=?, image=?, tipoCiclo=? 
            WHERE id=?`;
        const values = [cicloID, cicloName, siembraStr, cosechaStr, news, description, state, image || exist[0].image, tipoCiclo, id];
        await connection.execute(sql, values);

        // Si se actualizó la imagen, borrar la anterior
        if (image && exist[0].image) {
            deleteFileIfExist(exist[0].image);
        }

        return res.status(200).json({ success: true, message: 'Ciclo actualizado correctamente.' });
    } catch (err) {
        console.error('Error al actualizar ciclo:', err.message || err);
        if (image) deleteFileIfExist(image);
        return res.status(500).json({ error: 'Error al actualizar ciclo de cultivo' });
    } finally {
        if (connection) connection.release();
    }
};

// --- NUEVO: Cambiar estado ---
const toggleCicloEstado = async (req, res) => {
    const { id } = req.params;
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.execute("SELECT state FROM ciclocultivo WHERE id=?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Ciclo no encontrado' });
        }

        const nuevoEstado = rows[0].state === 'activo' ? 'inactivo' : 'activo';
        await connection.execute("UPDATE ciclocultivo SET state=? WHERE id=?", [nuevoEstado, id]);

        return res.status(200).json({ success: true, message: `Estado cambiado a ${nuevoEstado}` });
    } catch (err) {
        console.error('Error al cambiar estado:', err.message || err);
        return res.status(500).json({ error: 'Error al cambiar estado del ciclo' });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    insertarCicloCultivo,
    obtenerCiclosCultivo,
    obtenerCicloPorId,
    actualizarCicloCultivo,
    toggleCicloEstado
};
