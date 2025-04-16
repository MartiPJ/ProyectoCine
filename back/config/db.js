const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',  
    user:'root',
    port: 3307, 
    password: '',
    database: 'cine',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;