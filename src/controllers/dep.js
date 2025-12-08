const { getConnection, sql } = require("../database/connection");

const getDepartamentos = async (req, res) => {
  try {
    const conn = await getConnection();
    const [dep] = await conn.query(
      `SELECT DISTINCT uen FROM bf1noykqymg7gd1tuvpc.empleados;`
    );
    res.status(201).send({ dep });
    conn.release();
  } catch (error) {
    console.error("Error en registro:", err);
    res.status(500).send({ error: "Error interno del servidor" });
  }
};

module.exports = {
  getDepartamentos,
};
