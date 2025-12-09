const { getConnection, sql } = require("../database/connection");

const getUen = async (req, res) => {
  let conn;

  try {
    conn = await getConnection();

    const [uen] = await conn.query(
      `SELECT DISTINCT empresa FROM bf1noykqymg7gd1tuvpc.empleados;`
    );

    return res.status(200).send({ uen });

  } catch (error) {
    console.error("Error en registro:", error);
    return res.status(500).send({ error: "Error interno del servidor" });

  } finally {
    if (conn) conn.release(); // ⬅️ Se cierra SIEMPRE
  }
};


module.exports = {
  getUen,
};
