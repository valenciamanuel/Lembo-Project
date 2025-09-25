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


module.exports = {
    insertarCicloCultivo,
    obtenerCiclosCultivo,
};