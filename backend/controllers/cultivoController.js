// controllers/cultivoController.js
const pool = require('../config/db');
const fs = require('fs/promises');
const path = require('path');
const multer = require('multer');

// Ruta de uploads en frontend
const UPLOADS_PATH = path.join(__dirname, '..', '..', 'fronted', 'public', 'uploads');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_PATH),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage });

// Borrar archivo si existe
const deleteFileIfExist = async filename => {
  if (!filename) return;
  const filePath = path.join(UPLOADS_PATH, filename);
  try { await fs.unlink(filePath); } catch {}
};

// Insertar cultivo
const insertarCultivo = async (req, res) => {
  const { cultivoType, cultivoName, cultivoID, size, location, description, state } = req.body;
  const image = req.file ? req.file.filename : null;
  if (!cultivoType || !cultivoName || !cultivoID || !size || !location || !state) {
    await deleteFileIfExist(image);
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }
  const descVal = description?.trim() ? description : null;
  try {
    const sql = `
      INSERT INTO cultivo
      (cultivoType,cultivoName,cultivoID,size,location,description,state,image)
      VALUES(?,?,?,?,?,?,?,?)
    `;
    const vals = [cultivoType, cultivoName, cultivoID, size, location, descVal, state.toLowerCase(), image];
    const [resDB] = await pool.query(sql, vals);
    res.status(201).json({ id: resDB.insertId, cultivoName, cultivoID, image });
  } catch (err) {
    await deleteFileIfExist(image);
    console.error(err);
    res.status(500).json({ error: 'Error al insertar cultivo' });
  }
};

// Obtener todos
const obtenerCultivos = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cultivo');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener cultivos' });
  }
};

// Obtener por ID
const obtenerCultivoPorId = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cultivo WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener cultivo' });
  }
};

// Actualizar cultivo
const actualizarCultivo = async (req, res) => {
    console.log(req.body);
  const { id } = req.params;
  const { cultivoType, cultivoName, cultivoID, size, location, description, state, image: oldImage } = req.body;
  let newImage = req.file ? req.file.filename : oldImage;
  if (req.file && oldImage && oldImage !== newImage) {
    await deleteFileIfExist(oldImage);
  }
  if (!cultivoType || !cultivoName || !cultivoID || !size || !location || !state) {
    if (req.file) await deleteFileIfExist(newImage);
    return res.status(400).json({ error: 'Campos obligatorios faltantes.' });
  }
  const descVal = description?.trim() ? description : null;
  try {
    const sql = `
      UPDATE cultivo SET
      cultivoType=?, cultivoName=?, cultivoID=?, size=?, location=?,
      description=?, state=?, image=?
      WHERE id=?
    `;
    const vals = [cultivoType, cultivoName, cultivoID, size, location, descVal, state.toLowerCase(), newImage, id];
    const [result] = await pool.query(sql, vals);
    if (!result.affectedRows) {
      if (req.file) await deleteFileIfExist(newImage);
      return res.status(404).json({ error: 'Cultivo no encontrado' });
    }
    res.json({ message: '✅ Cultivo actualizado', image: newImage });
  } catch (err) {
    if (req.file) await deleteFileIfExist(newImage);
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar cultivo' });
  }
};

module.exports = {
  upload,
  insertarCultivo,
  obtenerCultivos,
  obtenerCultivoPorId,
  actualizarCultivo
};
