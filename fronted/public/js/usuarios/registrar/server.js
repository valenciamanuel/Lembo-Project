const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lembo',
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a la BD:', err);
        return;
    }
    console.log('Conectado a la BD - Full');
});
app.post('/register', (req, res) => {
    const { usertype, IDtype, IDnum, name, email, phone, password } = req.body;


    console.log('Datos recibidos:', req.body);

    db.query(
        'INSERT INTO register (usertype, IDtype, IDnum, name, email, phone, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [usertype, IDtype, IDnum, name, email, phone, password],
        (err, result) => {
            if (err) {
                console.error('Error insertando usuario:', err);
                return res.status(500).json({ error: 'Error al registrar usuario' });
            }
            res.status(201).json({ id: result.insertId, usertype, IDtype, IDnum, name, email, phone, password });
        }
    );
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
