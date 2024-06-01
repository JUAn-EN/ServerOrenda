// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'b82lapx4joa79l3axqkq-mysql.services.clever-cloud.com',
    user: 'uofaxuc4ytelr0fl',
    password: 'ATJXGX0x7NK2vsdag6Cv',
    database: 'b82lapx4joa79l3axqkq',
    port:'3306'
});

const connectDB = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error("Error al conectar a la base de datos:", err.message);
                reject(err);
                return;
            }

            connection.ping((err) => {
                connection.release();
                if (err) {
                    console.error("Error al realizar el ping a la base de datos:", err.message);
                    reject(err);
                    return;
                }

                console.log("Conexión exitosa a la base de datos.");
                resolve();
            });
        });
    });
};

module.exports = { pool, connectDB };
