const db = require('../config/db.js');
const fs = require('fs/promises'); // Para manejar archivos (útil en actualización/eliminación)
const path = require('path');

// --- Función de utilidad para obtener la ruta de uploads ---
// Asumiendo que MulterConfig guarda en: 
// backend/../fronted/public/uploads
const UPLOADS_PATH = path.join(__dirname, '..', '..', 'fronted', 'public', 'uploads');


// Insertar insumo
const insertarInsumo = async (req, res) => {
  // El nombre de la imagen viene de req.file si se subió algo.
  // req.body contiene los campos de texto.
  const { tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, valorTotal, descripcion, estado } = req.body;
  
  // ✅ CORRECCIÓN: Usar req.file.filename si existe, si no, es NULL.
  const image = req.file ? req.file.filename : null; 

  // Validación mínima
  if (!tipoInsumo || !nombreInsumo || !unidadMedida || cantidad == null || valorUnitario == null || valorTotal == null || !descripcion || !estado) {
    // Si la validación falla, y se subió un archivo, debemos ELIMINARLO.
    if (req.file) {
        await fs.unlink(req.file.path).catch(err => console.error("Error al eliminar archivo fallido:", err));
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
    // Si falla la DB, eliminar el archivo subido.
    if (req.file) {
        await fs.unlink(req.file.path).catch(err => console.error("Error al eliminar archivo después de fallo DB:", err));
    }
    console.error('❌ Error al insertar el insumo:', err);
    res.status(500).json({ error: 'Error al insertar el insumo' });
  }
};

// Obtener todos los insumos
// (Esta función estaba en el router, pero la ponemos aquí si la necesitas en el futuro)
const obtenerInsumos = async (req, res) => {
  try {
    // Si la usas desde el router, es mejor obtener *todos* los campos necesarios para visualizar
    const sql = 'SELECT idInsumo, tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, valorTotal, descripcion, estado, image FROM insumo';
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
  // Los datos de texto están en req.body
  let { nombreInsumo, tipoInsumo, cantidad, unidadMedida, valorUnitario, valorTotal, descripcion, estado, image: oldImage } = req.body;
  
  // 1. Determinar la imagen a guardar: 
  // Si Multer subió una nueva imagen, usamos esa. Si no, usamos la que ya venía en el body (oldImage).
  const newImageName = req.file ? req.file.filename : oldImage;
  
  // 2. Si se subió un nuevo archivo, eliminar el archivo antiguo si es diferente
  if (req.file && oldImage && req.file.filename !== oldImage) {
      const oldImagePath = path.join(UPLOADS_PATH, oldImage);
      await fs.unlink(oldImagePath).catch(err => console.error("Advertencia: No se pudo eliminar la imagen antigua:", oldImage, err));
  }
  
  // 3. Normalizar valores (Esto ya lo tenías, lo mantengo)
  nombreInsumo = nombreInsumo ?? null;
  tipoInsumo = tipoInsumo ?? null;
  cantidad = cantidad ?? null;
  unidadMedida = unidadMedida ?? null;
  valorUnitario = valorUnitario ?? null;
  valorTotal = valorTotal ?? null;
  descripcion = descripcion ?? null;
  estado = estado ?? null;
  
  try {
    const sql = `
      UPDATE insumo
      SET nombreInsumo = ?, tipoInsumo = ?, cantidad = ?, unidadMedida = ?, valorUnitario = ?, valorTotal = ?, descripcion = ?, estado = ?, image = ?
      WHERE idInsumo = ?
    `;
    const values = [nombreInsumo, tipoInsumo, cantidad, unidadMedida, valorUnitario, valorTotal, descripcion, estado, newImageName, id];

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      // Si la actualización falla, y se subió un archivo nuevo, eliminarlo.
      if (req.file) {
          await fs.unlink(req.file.path).catch(err => console.error("Error al eliminar nuevo archivo después de fallo UPDATE:", err));
      }
      return res.status(404).json({ error: "Insumo no encontrado o no se realizaron cambios" });
    }

    res.json({ message: "✅ Insumo actualizado correctamente", newImage: newImageName });
  } catch (err) {
    // Si falla la DB, eliminar el archivo subido.
    if (req.file) {
        await fs.unlink(req.file.path).catch(err => console.error("Error al eliminar archivo después de fallo DB:", err));
    }
    console.error("❌ Error al actualizar insumo:", err);
    res.status(500).json({ error: "Error al actualizar insumo" });
  }
};

module.exports = {
  insertarInsumo,
  obtenerInsumos, // Exportamos esta función aunque no se use en el router actual.
  obtenerInsumoPorId,
  actualizarInsumo,
};