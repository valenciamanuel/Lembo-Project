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
    const { tipoUsuario, tipoDocumento, numeroDocumento, nombre, correo, telefono} = req.body;

       // Validación para asegurarse de que los correos coincidan
    if (correo !== confirmarCorreo) {
        return res.status(400).json({ error: 'Los correos no coinciden' });
    }

    
    console.log('Datos recibidos:', req.body);  // Verifica los datos que llegan al servidor

    db.query(
        'INSERT INTO register (tipoUsuario, tipoDocumento, numeroDocumento,  nombre, correo, telefono) VALUES (?, ?, ?, ?)',
        [tipoUsuario, tipoDocumento, numeroDocumento, nombre, correo, telefono ],
        (err, result) => {
            if (err) {
                console.error('Error insertando usuario:', err);
                return res.status(500).json({ error: 'Error al registrar usuario' });
            }
            res.status(201).json({ id: result.insertId, tipoUsuario, tipoDocumento, numeroDocumento, nombre, correo, telefono});
        }
    );
});


app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
