const { getConnection, sql } = require("../database/connection");

const getMfs = async (req, res) => {
  try {
    const conn = await getConnection();
    const [mfs] = await conn.query(
      `SELECT DISTINCT mf FROM bf1noykqymg7gd1tuvpc.mf;`
    );
    res.status(201).send({ mfs });
    conn.release();
  } catch (error) {
    console.error("Error en registro:", err);
    res.status(500).send({ error: "Error interno del servidor" });
  }
};

const getAllOfMfs = async (req, res) => {
  try {
    const conn = await getConnection();
    const [mfs] = await conn.query(
      `SELECT * FROM bf1noykqymg7gd1tuvpc.mf;`
    );
    res.status(201).send({ mfs });
    conn.release();
  } catch (error) {
    console.error("Error en registro:", err);
    res.status(500).send({ error: "Error interno del servidor" });
  }
};

const getOneMf = async (req, res) => {


  const { mf } = req.params;


    const conn = await getConnection();

    // 1️⃣ Traer el MF
    const [rows] = await conn.query(
      `
      SELECT *
      FROM mf
      WHERE mf = ?
        AND mf <> '--'
        AND mf <> '';
      `,
      [mf]
    );

    if (rows.length === 0) {
      conn.release();
      return res.status(404).json({ error: "No existen registros con ese MF" });
    }

    const data = rows[0]; // tu registro

    // Extraer los IDs de competencias
    const compIds = [
      data.comp01,
      data.comp02,
      data.comp03,
      data.comp04,
      data.comp05,
      data.comp_esp1,
      data.comp_esp2,
      data.comp_esp3,
      data.comp_esp4,
      data.comp_esp5,
    ].filter(id => id && id !== 0 && id !== null); // limpia valores vacíos

    // 2️⃣ Si no hay competencias, devolver el MF tal cual
    if (compIds.length === 0) {
      conn.release();
      return res.status(200).json({
        results: {
          ...data,
          competencias: []
        }
      });
    }

    // 3️⃣ Traer todas las competencias relacionadas
    const [competencias] = await conn.query(
      `
      SELECT *
      FROM competencias
      WHERE id IN (?);
      `,
      [compIds]
    );

    conn.release();

    // 4️⃣ Armar respuesta final
    const results = {
      ...data,
      competencias: {
        comp01: competencias.find(c => c.id === data.comp01) || null,
        comp02: competencias.find(c => c.id === data.comp02) || null,
        comp03: competencias.find(c => c.id === data.comp03) || null,
        comp04: competencias.find(c => c.id === data.comp04) || null,
        comp05: competencias.find(c => c.id === data.comp05) || null,
        comp_esp1: competencias.find(c => c.id === data.comp_esp1) || null,
        comp_esp2: competencias.find(c => c.id === data.comp_esp2) || null,
        comp_esp3: competencias.find(c => c.id === data.comp_esp3) || null,
        comp_esp4: competencias.find(c => c.id === data.comp_esp4) || null,
        comp_esp5: competencias.find(c => c.id === data.comp_esp5) || null,
      }
    };

    res.status(200).json({ results });

  
};


const createMf = async (req, res) => {
  try {
    const { mf, cargo, objetivo1, objetivo2, objetivo3, objetivo4, comp01, comp02, comp03, comp04, comp05, comp_esp1, comp_esp2, comp_esp3, comp_esp4, comp_esp5 } = req.body; 
    const conn = await getConnection();
    await conn.query(
      `INSERT INTO bf1noykqymg7gd1tuvpc.mf (mf, cargo, objetivo1, objetivo2, objetivo3, objetivo4, comp01, comp02, comp03, comp04, comp05, comp_esp1, comp_esp2, comp_esp3, comp_esp4, comp_esp5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [mf, cargo, objetivo1, objetivo2, objetivo3, objetivo4, comp01, comp02, comp03, comp04, comp05, comp_esp1, comp_esp2, comp_esp3, comp_esp4, comp_esp5]
    );
    res.status(201).send({ message: "MF creado exitosamente" });
    conn.release();
  } catch (err) {
    console.error("Error en creación de MF:", err);
    res.status(500).send({ error: "Error interno del servidor" });
  }
};

const editMf = async (req, res) => {
  // Implementación de edición de MF
  try {
    const {id, mf, cargo, objetivo1, objetivo2, objetivo3, objetivo4, comp01, comp02, comp03, comp04, comp05, comp_esp1, comp_esp2, comp_esp3, comp_esp4, comp_esp5 } = req.body; 
    const conn = await getConnection();
    await conn.query(
      `UPDATE bf1noykqymg7gd1tuvpc.mf SET mf = ?, cargo = ?, objetivo1 = ?, objetivo2 = ?, objetivo3 = ?, objetivo4 = ?, comp01 = ?, comp02 = ?, comp03 = ?, comp04 = ?, comp05 = ?, comp_esp1 = ?, comp_esp2 = ?, comp_esp3 = ?, comp_esp4 = ?, comp_esp5 = ? WHERE id = ?`,
      [mf, cargo, objetivo1, objetivo2, objetivo3, objetivo4, comp01, comp02, comp03, comp04, comp05, comp_esp1, comp_esp2, comp_esp3, comp_esp4, comp_esp5, id]
    );
    res.status(201).send({ message: "MF editado exitosamente" });
    conn.release();
  } catch (error) {
    console.error("Error en edición de MF:", err);
    res.status(500).send({ error: "Error interno del servidor" });
  }
}

module.exports = {
  getMfs,
  getOneMf,
  getAllOfMfs,
  createMf,
  editMf
};
