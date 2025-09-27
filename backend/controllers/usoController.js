const db = require('../config/db.js');

// const insertarUso = (req, res) => {
//     const { fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo } = req.body;
    
//     if (!fecha_uso || !cantidad || !responsable || !valor_unitario || !valor_total || !observaciones || !insumo) {
//         return res.status(400).json({ error: 'Todos los campos son obligatorios' });
//     }

//     const sql = 'INSERT INTO uso_insumo (fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo) VALUES (?, ?, ?, ?, ?, ?, ?)';
//     const values = [fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo];

//     db.query(sql, values, (err, result) => {
//         if (err) {
//             console.error('Error al insertar Asociacion:', err);
//             return res.status(500).json({ error: 'Error al insertar Asociación' });
//         }
//         res.status(201).json({ id: result.insertId, fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo });
//     });
// };  

// const obtenerUsos = async (req, res) => {
//     try {
//         const sql = 'SELECT * FROM uso_insumo';
//         const [results] = await db.query(sql); // Use await with the Promise-based query
//         res.status(200).json(results);
//     } catch (err) {
//         console.error('Error al obtener usos de insumo:', err);
//         res.status(500).json({ error: 'Error al obtener usos de insumo' });
//     }
// };;

const insertarUso = async (req, res) => {
  try {
    const { fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo } = req.body;

    if (!fecha_uso || !cantidad || !responsable || !valor_unitario || !valor_total || !observaciones || !insumo) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = `
      INSERT INTO uso_insumo (fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo];

    const [result] = await db.query(sql, values);

    res.status(201).json({ id: result.insertId, fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo });
  } catch (err) {
    console.error('❌ Error al insertar uso_insumo:', err);
    res.status(500).json({ error: 'Error al insertar uso_insumo' });
  }
};

// Obtener todos
const obtenerUsos = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM uso_insumo');
    res.status(200).json(results);
  } catch (err) {
    console.error('❌ Error al obtener usos de insumo:', err);
    res.status(500).json({ error: 'Error al obtener usos de insumo' });
  }
};

// Obtener uno por ID
const obtenerUsoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM uso_insumo WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Uso de insumo no encontrado" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error al obtener uso_insumo:", err);
    res.status(500).json({ error: "Error al obtener uso_insumo" });
  }
};

// Actualizar
const actualizarUso = async (req, res) => {
  const { id } = req.params;
  const { fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo } = req.body;

  try {
    const sql = `
      UPDATE uso_insumo
      SET fecha_uso = ?, cantidad = ?, responsable = ?, valor_unitario = ?, valor_total = ?, observaciones = ?, insumo = ?
      WHERE id = ?
    `;
    const values = [fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo, id];

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Uso de insumo no encontrado" });
    }

    res.json({ message: "✅ Uso de insumo actualizado correctamente" });
  } catch (err) {
    console.error("❌ Error al actualizar uso_insumo:", err);
    res.status(500).json({ error: "Error al actualizar uso_insumo" });
  }
};

module.exports = {
    insertarUso,
    obtenerUsos,
    obtenerUsoPorId,
    actualizarUso,
};