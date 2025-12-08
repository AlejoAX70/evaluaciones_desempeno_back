const {getConnection, sql} = require('../database/connection');

async function getLider(req, res) {

  console.log("getPar attempt with data:", req.params);
    
  try {
    const { lider } = req.params;
    const conn = await getConnection();

    // Obtener login + UEN del empleado
    const [rows] = await conn.query(`
      SELECT e.*, m.*
        FROM bf1noykqymg7gd1tuvpc.empleados e
        LEFT JOIN bf1noykqymg7gd1tuvpc.mf m 
            ON e.mf = m.mf
        WHERE e.cc_lider = ?;
    `, [lider]);

    console.log("Query result:", rows);

    if (rows.length === 0) {
      return res.status(404).send({ error: 'usuario no encontrado' });
    }

    
    res.status(200).send({ par: rows });
    conn.release();
   
    // Generar token

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send({ error: 'error interno del servidor' });
  }
}

module.exports = {
  getLider,
};