// controllers/ciclo_cultivoController.js
const db = require('../config/db.js');

const insertarCicloCultivo = async (req, res) => {
    console.log("📩 Body recibido:", req.body);
    const { cicloID, cicloName, siembraDate, cosechaDate, news, description, state, image } = req.body;

    if (!cicloID || !cicloName || !siembraDate || !cosechaDate || !news || !description || !state) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = `
        INSERT INTO ciclocultivo 
        (cicloID, cicloName, siembraDate, cosechaDate, news, description, state, image) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [cicloID, cicloName, siembraDate, cosechaDate, news, description, state, image || null];

    let connection;
    try {
        console.log('✅ Preparando para ejecutar la consulta SQL.'); 
        connection = await db.getConnection();
        const [result] = await connection.execute(sql, values);
        
        console.log('✅ Ciclo de cultivo insertado con ID:', result.insertId);
        
        return res.status(201).json({ 
            message: 'Ciclo de cultivo creado exitosamente',
            id: result.insertId, 
            cicloID, 
            cicloName, 
            siembraDate, 
            cosechaDate, 
            news, 
            description, 
            state,
            image: image || null
        });

    } catch (err) {
        console.error('❌ Error al insertar el ciclo de cultivo:', err.message || err);
        return res.status(500).json({ error: 'Error al insertar el ciclo de cultivo', details: err.message });
    } finally {
        if (connection) {
            connection.release(); // ✅ Esta es la clave: siempre libera la conexión
        }
    }
};

const obtenerCiclosCultivo = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.execute(`
            SELECT id, cicloID, cicloName, siembraDate, cosechaDate, news, description, state, image 
            FROM ciclocultivo
        `);
        console.log(`✅ ${rows.length} ciclos de cultivo obtenidos`);
        return res.status(200).json(rows);
    } catch (err) {
        console.error('❌ Error al obtener los ciclos de cultivo:', err.message || err);
        return res.status(500).json({ error: 'Error al obtener los ciclos de cultivo' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// New function to get a single crop cycle by its ID
const obtenerCicloPorId = async (req, res) => {
    const { id } = req.params; // Get the ID from the URL parameter
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.execute('SELECT * FROM ciclocultivo WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Ciclo de cultivo no encontrado' });
        }
        
        res.status(200).json(rows[0]); // Send back the first (and only) row
    } catch (err) {
        console.error('❌ Error al obtener el ciclo de cultivo:', err.message || err);
        res.status(500).json({ error: 'Error al obtener el ciclo de cultivo' });
    } finally {
        if (connection) connection.release();
    }
};

// New function to update a crop cycle
const actualizarCicloCultivo = async (req, res) => {
    const { id } = req.params; // Get the ID from the URL
    const { cicloID, cicloName, siembraDate, cosechaDate, news, description, state, image } = req.body;
    
    // Add validation for required fields
    if (!cicloID || !cicloName || !siembraDate || !cosechaDate || !news || !description || !state) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    let connection;
    try {
        const sql = `
            UPDATE ciclocultivo 
            SET cicloID = ?, cicloName = ?, siembraDate = ?, cosechaDate = ?, news = ?, description = ?, state = ?, image = ?
            WHERE id = ?
        `;
        const values = [cicloID, cicloName, siembraDate, cosechaDate, news, description, state, image || null, id];
        
        connection = await db.getConnection();
        const [result] = await connection.execute(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Ciclo de cultivo no encontrado' });
        }

        res.status(200).json({ message: 'Ciclo de cultivo actualizado exitosamente' });
    } catch (err) {
        console.error('❌ Error al actualizar el ciclo de cultivo:', err.message || err);
        res.status(500).json({ error: 'Error al actualizar el ciclo de cultivo', details: err.message });
    } finally {
        if (connection) connection.release();
    }
};

// New function to toggle the state of a crop cycle
const toggleCicloEstado = async (req, res) => {
    const { id } = req.params; // Get the ID from the URL
    const { state } = req.body; // Get the new state from the request body

    if (state !== 'Activo' && state !== 'Inactivo') {
        return res.status(400).json({ error: 'Estado no válido. Debe ser "Activo" o "Inactivo".' });
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

        res.status(200).json({ message: `Ciclo de cultivo ${state.toLowerCase()} exitosamente.` });
    } catch (err) {
        console.error('❌ Error al cambiar el estado del ciclo:', err.message || err);
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