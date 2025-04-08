const mysql = require('mysql2');

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

module.exports = db;