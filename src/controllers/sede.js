const { getConnection, sql } = require("../database/connection");

const getSedes = async (req, res) => {
  try {
    const conn = await getConnection();
    const [sedes] = await conn.query(
      `SELECT DISTINCT sede FROM bf1noykqymg7gd1tuvpc.empleados;`
    );
    res.status(201).send({ sedes });
    conn.release();
  } catch (error) {
    console.error("Error en registro:", err);
    res.status(500).send({ error: "Error interno del servidor" });
  }
};

module.exports = {
  getSedes,
};
