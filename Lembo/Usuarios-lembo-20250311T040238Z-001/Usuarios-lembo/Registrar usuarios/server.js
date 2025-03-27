const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'lembo'
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a la BD:', err);
        return;
    }
    console.log('Conectado a la BD - Full');
});
app.post('/register', (req, res) => {
    const { user, typeID, ID, name, email, phone, confirmarCorreo } = req.body;

    if (email !== confirmarCorreo) {
        return res.status(400).json({ error: 'Los correos no coinciden' });
    }

    console.log('Datos recibidos:', req.body);

    db.query(
        'INSERT INTO register (tipoUsuario, tipoDocumento, numeroDocumento, nombre, correo, telefono, confirmarCorreo) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [user, typeID, ID, name, email, phone, confirmarCorreo],
        (err, result) => {
            if (err) {
                console.error('Error insertando usuario:', err);
                return res.status(500).json({ error: 'Error al registrar usuario' });
            }
            res.status(201).json({ id: result.insertId, user, typeID, ID, name, email, phone });
        }
    );
});



app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
