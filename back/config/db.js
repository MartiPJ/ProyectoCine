const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    port: process.env.MYSQLPORT, 
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
pool.getConnection()
    .then(conn => {
        console.log("✅ Conexión a la base de datos exitosa");
        conn.release();
    })
    .catch(err => {
        console.error("❌ Error de conexión a la base de datos:", err);
    }); pool.getConnection()
        .then(conn => {
            console.log("✅ Conexión a la base de datos exitosa");
            conn.release();
        })
        .catch(err => {
            console.error("❌ Error de conexión a la base de datos:", err);
        });