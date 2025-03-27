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

app.post('/user', (req, res) => {
    const { name, email, address, phone } = req.body;
    
    console.log('Datos recibidos:', req.body);  // Verifica los datos que llegan al servidor

    db.query(
        'INSERT INTO user (name, email, address, phone) VALUES (?, ?, ?, ?)',
        [name, email, address, phone],
        (err, result) => {
            if (err) {
                console.error('Error insertando usuario:', err);
                return res.status(500).json({ error: 'Error al registrar usuario' });
            }
            res.status(201).json({ id: result.insertId, name, email, address, phone });
        }
    );
});


app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
