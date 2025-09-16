// db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'lembo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: 3306
});

// ✅ Añade esto
pool.getConnection()
    .then(connection => {
        console.log("✅ Conexión exitosa al pool de la base de datos.");
        connection.release(); // Libera la conexión inmediatamente
    })
    .catch(err => {
        console.error("❌ Error al conectar a la base de datos:", err.stack);
    });

module.exports = pool;