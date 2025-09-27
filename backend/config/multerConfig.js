const multer = require('multer');
const path = require('path');

// 1. Configuración de Almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // La ruta donde se guardarán las imágenes subidas por el usuario
        // Asegúrate de que esta carpeta ya exista: fronted/public/uploads/
        cb(null, path.join(__dirname, '..', '..', 'fronted', 'public', 'uploads'));
    },
    filename: (req, file, cb) => {
        // Crear un nombre único: timestamp + extensión original
        const extension = path.extname(file.originalname);
        cb(null, Date.now() + extension); 
    }
});

// 2. Filtro de Archivos (Opcional pero recomendado para solo aceptar imágenes)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// 3. Inicializar Multer
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    // Límite de tamaño (ej: 5MB). Quítalo o ajústalo si es necesario.
    limits: { fileSize: 1024 * 1024 * 5 } 
});

module.exports = upload;