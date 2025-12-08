const { getConnection, sql } = require("../database/connection");

const getCompetencias = async (req, res) => {
  try {
    const conn = await getConnection();
    const [competencias] = await conn.query(
      `SELECT * FROM bf1noykqymg7gd1tuvpc.competencias;`
    );
    res.status(201).send({ competencias });
    conn.release();
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).send({ error: "Error interno del servidor" });
  }
};

const createComp = async (req, res) => {
  console.log("CrearCompetencia: ", req.body);  
  //CrearCompetencia:  { competencia: 'Competencia nueva', descripcion: 'Desc' }
    try {
        const { competencia, descripcion } = req.body;
        const conn = await getConnection();
        await conn.query(
            `INSERT INTO bf1noykqymg7gd1tuvpc.competencias (competencia, descripcion) VALUES (?, ?);`,
            [competencia, descripcion]
        );
        res.status(201).send({ message: "Competencia creada exitosamente" });
        conn.release();
    }
    catch (error) {
        console.error("Error en creación de competencia:", error);
        res.status(500).send({ error: "Error interno del servidor" });
    }
}

const editComp = async (req, res) => {
  // Implementación de edición de competencia
  try {
     const { competencia, descripcion, id } = req.body;
        const conn = await getConnection();
        await conn.query(
            `UPDATE bf1noykqymg7gd1tuvpc.competencias SET competencia = ?, descripcion = ? WHERE id = ?;`,
            [competencia, descripcion, id]
        );
        res.status(201).send({ message: "Competencia editada exitosamente" });
        conn.release();

  } catch (error) {
    console.error("Error en edición de competencia:", error);
    res.status(500).send({ error: "Error interno del servidor" });
  }
}   

module.exports = {
  getCompetencias,
  createComp,
  editComp
};