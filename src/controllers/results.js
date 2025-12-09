const { getConnection } = require("../database/connection");

const getAllresults = async (req, res) => { 
  let conn;

  try {
    conn = await getConnection();

    const [resultados] = await conn.query(
      `SELECT * FROM bf1noykqymg7gd1tuvpc.resultados;`
    );

    return res.status(200).send({ resultados });

  } catch (error) {
    console.error("Error en registro:", error);
    return res.status(500).send({ error: "Error interno del servidor" });

  } finally {
    if (conn) conn.release(); // ⬅️ cierre seguro siempre
  }
};


const deleteResult = async (req, res) => {
  let conn;

  try {
    const { id } = req.params;

    // Validar que venga el ID
    if (!id) {
      return res.status(400).send({ error: "El ID es obligatorio" });
    }

    conn = await getConnection();

    // Ejecutar DELETE
    const [resultado] = await conn.query(
      `DELETE FROM bf1noykqymg7gd1tuvpc.resultados WHERE id = ?`,
      [id]
    );

    // Revisar si realmente se eliminó algo
    if (resultado.affectedRows === 0) {
      return res.status(404).send({ error: "Resultado no encontrado" });
    }

    return res.status(200).send({ message: "Resultado eliminado exitosamente" });

  } catch (error) {
    console.error("Error al eliminar:", error);
    return res.status(500).send({ error: "Error interno del servidor" });

  } finally {
    if (conn) conn.release(); // ⬅️ cierre garantizado SIEMPRE
  }
};



module.exports = {
    getAllresults,
    deleteResult
}