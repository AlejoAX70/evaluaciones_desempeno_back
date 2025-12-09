const { getConnection, sql } = require("../database/connection");

const getCompetencias = async (req, res) => {
  let conn;

  try {
    conn = await getConnection();

    const [competencias] = await conn.query(
      `SELECT * FROM bf1noykqymg7gd1tuvpc.competencias;`
    );

    res.status(200).send({ competencias });

  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).send({ error: "Error interno del servidor" });

  } finally {
    if (conn) conn.release(); // 🔥 siempre se ejecuta
  }
};


const createComp = async (req, res) => {
  console.log("CrearCompetencia: ", req.body);

  let conn; // importante declararla afuera

  try {
    const { competencia, descripcion } = req.body;

    conn = await getConnection();

    await conn.query(
      `INSERT INTO bf1noykqymg7gd1tuvpc.competencias (competencia, descripcion) 
       VALUES (?, ?);`,
      [competencia, descripcion]
    );

    res.status(201).send({ message: "Competencia creada exitosamente" });

  } catch (error) {
    console.error("Error en creación de competencia:", error);
    res.status(500).send({ error: "Error interno del servidor" });
    
  } finally {
    if (conn) conn.release(); // 🔥 siempre se libera
  }
};


const editComp = async (req, res) => {
  let conn;

  try {
    const { competencia, descripcion, id } = req.body;
    conn = await getConnection();

    await conn.query(
      `UPDATE bf1noykqymg7gd1tuvpc.competencias 
       SET competencia = ?, descripcion = ? 
       WHERE id = ?;`,
      [competencia, descripcion, id]
    );

    res.status(201).send({ message: "Competencia editada exitosamente" });

  } catch (error) {
    console.error("Error en edición de competencia:", error);
    res.status(500).send({ error: "Error interno del servidor" });

  } finally {
    if (conn) conn.release(); // 🔥 siempre liberamos
  }
};


module.exports = {
  getCompetencias,
  createComp,
  editComp
};