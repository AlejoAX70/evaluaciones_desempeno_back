const { getConnection, sql } = require("../database/connection");

const getUen = async (req, res) => {
  try {
    const conn = await getConnection();
    const [uen] = await conn.query(
      `SELECT DISTINCT empresa FROM bf1noykqymg7gd1tuvpc.empleados;`
    );
    res.status(201).send({ uen });
    conn.release();
  } catch (error) {
    console.error("Error en registro:", err);
    res.status(500).send({ error: "Error interno del servidor" });
  }
};

module.exports = {
  getUen,
};
