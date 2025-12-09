const mysql = require('mysql2/promise');

const dbSettings = {
  host: 'localhost',
  user: 'evaluaciones',
  password: 'Cardinal0809*_',
  database: 'bf1noykqymg7gd1tuvpc',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbSettings);

async function getConnection() {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error('Error conectando a MySQL:', error.message);
  }
}

module.exports = { getConnection, pool };
