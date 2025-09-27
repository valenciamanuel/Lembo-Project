const db = require('../config/db.js');

// Insertar insumo
const insertarInsumo = async (req, res) => {
  const { tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, valorTotal, descripcion, estado } = req.body;
  const image = req.file ? req.file.filename : req.body.image || null; // multer o string

  // Validación mínima
  if (!tipoInsumo || !nombreInsumo || !unidadMedida || cantidad == null || valorUnitario == null || valorTotal == null || !descripcion || !estado) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios (image opcional)' });
  }

  try {
    const sql = `
      INSERT INTO insumo 
      (tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, valorTotal, descripcion, estado, image) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, valorTotal, descripcion, estado, image];

    const [result] = await db.query(sql, values);

    res.status(201).json({
      idInsumo: result.insertId,
      tipoInsumo,
      nombreInsumo,
      unidadMedida,
      cantidad,
      valorUnitario,
      valorTotal,
      descripcion,
      estado,
      image
    });
  } catch (err) {
    console.error('❌ Error al insertar el insumo:', err);
    res.status(500).json({ error: 'Error al insertar el insumo' });
  }
};

// Obtener todos los insumos
const obtenerInsumos = async (req, res) => {
  try {
    const sql = 'SELECT idInsumo, nombreInsumo, image FROM insumo';
    const [results] = await db.query(sql);
    res.status(200).json(results);
  } catch (err) {
    console.error('❌ Error al obtener los insumos:', err);
    res.status(500).json({ error: 'Error al obtener los insumos' });
  }
};

// Obtener insumo por ID
const obtenerInsumoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM insumo WHERE idInsumo = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Insumo no encontrado" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error al obtener insumo:", err);
    res.status(500).json({ error: "Error al obtener insumo" });
  }
};

// Actualizar insumo
const actualizarInsumo = async (req, res) => {
  const { id } = req.params;
  let { nombreInsumo, tipoInsumo, cantidad, unidadMedida, valorUnitario, valorTotal, descripcion, estado, image } = req.body;

  // Normalizar valores: undefined → null
  nombreInsumo = nombreInsumo ?? null;
  tipoInsumo = tipoInsumo ?? null;
  cantidad = cantidad ?? null;
  unidadMedida = unidadMedida ?? null;
  valorUnitario = valorUnitario ?? null;
  valorTotal = valorTotal ?? null;
  descripcion = descripcion ?? null;
  estado = estado ?? null;
  image = image ?? null;

  try {
    const sql = `
      UPDATE insumo
      SET nombreInsumo = ?, tipoInsumo = ?, cantidad = ?, unidadMedida = ?, valorUnitario = ?, valorTotal = ?, descripcion = ?, estado = ?, image = ?
      WHERE idInsumo = ?
    `;
    const values = [nombreInsumo, tipoInsumo, cantidad, unidadMedida, valorUnitario, valorTotal, descripcion, estado, image, id];

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Insumo no encontrado" });
    }

    res.json({ message: "✅ Insumo actualizado correctamente" });
  } catch (err) {
    console.error("❌ Error al actualizar insumo:", err);
    res.status(500).json({ error: "Error al actualizar insumo" });
  }
};

module.exports = {
  insertarInsumo,
  obtenerInsumos,
  obtenerInsumoPorId,
  actualizarInsumo,
};
