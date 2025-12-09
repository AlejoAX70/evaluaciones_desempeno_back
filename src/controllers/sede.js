const { getConnection, sql } = require("../database/connection");

const getSedes = async (req, res) => {
  let conn;

  try {
    conn = await getConnection();

    const [sedes] = await conn.query(
      `SELECT DISTINCT sede FROM bf1noykqymg7gd1tuvpc.empleados;`
    );

    return res.status(200).send({ sedes });

  } catch (error) {
    console.error("Error en registro:", error);
    return res.status(500).send({ error: "Error interno del servidor" });

  } finally {
    if (conn) conn.release(); // ⬅️ cierre garantizado siempre
  }
};


module.exports = {
  getSedes,
};
