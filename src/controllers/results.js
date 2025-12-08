const { getConnection } = require("../database/connection");

const getAllresults = async (req, res) =>{ 
   try {
    const conn = await getConnection();
    const [resultados] = await conn.query(
      `SELECT * FROM bf1noykqymg7gd1tuvpc.resultados;`
    );
    res.status(201).send({ resultados });
    conn.release();
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).send({ error: "Error interno del servidor" });
  }
}

const deleteResult = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que venga el ID
    if (!id) {
      return res.status(400).send({ error: "El ID es obligatorio" });
    }

    const conn = await getConnection();

    // Ejecutar DELETE
    const [resultado] = await conn.query(
      `DELETE FROM bf1noykqymg7gd1tuvpc.resultados WHERE id = ?`,
      [id]
    );

    conn.release();

    // Revisar si realmente se eliminó algo
    if (resultado.affectedRows === 0) {
      return res.status(404).send({ error: "Resultado no encontrado" });
    }

    res.status(200).send({ message: "Resultado eliminado exitosamente" });

  } catch (error) {
    console.error("Error al eliminar:", error);
    res.status(500).send({ error: "Error interno del servidor" });
  }
};


module.exports = {
    getAllresults,
    deleteResult
}