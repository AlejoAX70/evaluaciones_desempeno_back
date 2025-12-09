const { getConnection, sql } = require("../database/connection");

const getDepartamentos = async (req, res) => {
  let conn;

  try {
    conn = await getConnection();

    const [dep] = await conn.query(
      `SELECT DISTINCT uen FROM bf1noykqymg7gd1tuvpc.empleados;`
    );

    res.status(200).send({ dep });

  } catch (error) {
    console.error("Error en getDepartamentos:", error);
    res.status(500).send({ error: "Error interno del servidor" });

  } finally {
    if (conn) conn.release();
  }
};


module.exports = {
  getDepartamentos,
};
