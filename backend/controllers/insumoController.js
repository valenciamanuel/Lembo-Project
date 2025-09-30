const db = require('../config/db.js');
const fs = require('fs/promises');
const path = require('path');
const multer = require('multer');

// Directorio de uploads en el frontend
const UPLOADS_PATH = path.join(__dirname, '..', '..', 'fronted', 'public', 'uploads');

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_PATH);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random()*1E9)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage });

// Middleware para rutas que suben archivos
// Ejemplo: router.post('/insumo', upload.single('image'), insertarInsumo);

const insertarInsumo = async (req, res) => {
  const { tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, valorTotal, descripcion, estado } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!tipoInsumo || !nombreInsumo || !unidadMedida || cantidad == null ||
      valorUnitario == null || valorTotal == null || !descripcion || !estado) {
    if (req.file) {
      await fs.unlink(path.join(UPLOADS_PATH, req.file.filename)).catch(console.error);
    }
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
    res.status(201).json({ idInsumo: result.insertId, tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, valorTotal, descripcion, estado, image });
  } catch (err) {
    if (req.file) await fs.unlink(path.join(UPLOADS_PATH, req.file.filename)).catch(console.error);
    console.error('❌ Error al insertar el insumo:', err);
    res.status(500).json({ error: 'Error al insertar el insumo' });
  }
};

const obtenerInsumos = async (req, res) => {
  try {
    const sql = 'SELECT idInsumo, tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, valorTotal, descripcion, estado, image FROM insumo';
    const [results] = await db.query(sql);
    res.status(200).json(results);
  } catch (err) {
    console.error('❌ Error al obtener los insumos:', err);
    res.status(500).json({ error: 'Error al obtener los insumos' });
  }
};

const obtenerInsumoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM insumo WHERE idInsumo = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Insumo no encontrado" });
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error al obtener insumo:", err);
    res.status(500).json({ error: "Error al obtener insumo" });
  }
};

const actualizarInsumo = async (req, res) => {
  const { id } = req.params;
  let { nombreInsumo, tipoInsumo, cantidad, unidadMedida, valorUnitario, valorTotal, descripcion, estado, image: oldImage } = req.body;
  const newImage = req.file ? req.file.filename : oldImage;

  if (req.file && oldImage && newImage !== oldImage) {
    await fs.unlink(path.join(UPLOADS_PATH, oldImage)).catch(console.error);
  }

  try {
    const sql = `
      UPDATE insumo
      SET nombreInsumo=?, tipoInsumo=?, cantidad=?, unidadMedida=?, valorUnitario=?, valorTotal=?, descripcion=?, estado=?, image=?
      WHERE idInsumo=?
    `;
    const values = [nombreInsumo, tipoInsumo, cantidad, unidadMedida, valorUnitario, valorTotal, descripcion, estado, newImage, id];
    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      if (req.file) await fs.unlink(path.join(UPLOADS_PATH, newImage)).catch(console.error);
      return res.status(404).json({ error: "Insumo no encontrado o sin cambios" });
    }
    res.json({ message: "✅ Insumo actualizado correctamente", image: newImage });
  } catch (err) {
    if (req.file) await fs.unlink(path.join(UPLOADS_PATH, req.file.filename)).catch(console.error);
    console.error("❌ Error al actualizar insumo:", err);
    res.status(500).json({ error: "Error al actualizar insumo" });
  }
};

module.exports = {
  upload,
  insertarInsumo,
  obtenerInsumos,
  obtenerInsumoPorId,
  actualizarInsumo
};
