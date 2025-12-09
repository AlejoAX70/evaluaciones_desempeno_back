const { getConnection, sql } = require("../database/connection");

const getMfs = async (req, res) => {
  let conn;

  try {
    conn = await getConnection();

    const [mfs] = await conn.query(
      `SELECT DISTINCT mf FROM bf1noykqymg7gd1tuvpc.mf;`
    );

    return res.status(200).send({ mfs });
    
  } catch (error) {
    console.error("Error en registro:", error);
    return res.status(500).send({ error: "Error interno del servidor" });

  } finally {
    if (conn) conn.release();
  }
};


const getAllOfMfs = async (req, res) => {
  let conn;

  try {
    conn = await getConnection();

    const [mfs] = await conn.query(
      `SELECT * FROM bf1noykqymg7gd1tuvpc.mf;`
    );

    return res.status(201).send({ mfs });

  } catch (error) {
    console.error("Error en registro:", error);
    return res.status(500).send({ error: "Error interno del servidor" });

  } finally {
    if (conn) conn.release();
  }
};


const getOneMf = async (req, res) => {
  const { mf } = req.params;
  let conn;

  try {
    conn = await getConnection();

    // 1️⃣ Traer el MF
    const [rows] = await conn.query(
      `
      SELECT *
      FROM bf1noykqymg7gd1tuvpc.mf
      WHERE mf = ?
        AND mf <> '--'
        AND mf <> '';
      `,
      [mf]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No existen registros con ese MF" });
    }

    const data = rows[0];

    // IDs de competencias
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
    ].filter(id => id && id !== 0 && id !== null);

    // 2️⃣ Si no hay competencias, devolver solo el MF
    if (compIds.length === 0) {
      return res.status(200).json({
        results: {
          ...data,
          competencias: []
        }
      });
    }

    // 3️⃣ Consultar competencias
    const [competencias] = await conn.query(
      `
      SELECT *
      FROM bf1noykqymg7gd1tuvpc.competencias
      WHERE id IN (?);
      `,
      [compIds]
    );

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

    return res.status(200).json({ results });

  } catch (error) {
    console.error("Error en getOneMf:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    if (conn) conn.release(); // 🔥 siempre se libera
  }
};


const createMf = async (req, res) => {
  let conn;
  try {
    const { 
      mf, cargo, objetivo1, objetivo2, objetivo3, objetivo4, 
      comp01, comp02, comp03, comp04, comp05,
      comp_esp1, comp_esp2, comp_esp3, comp_esp4, comp_esp5 
    } = req.body; 
    
    conn = await getConnection();

    await conn.query(
      `INSERT INTO bf1noykqymg7gd1tuvpc.mf 
      (mf, cargo, objetivo1, objetivo2, objetivo3, objetivo4, 
       comp01, comp02, comp03, comp04, comp05, 
       comp_esp1, comp_esp2, comp_esp3, comp_esp4, comp_esp5) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        mf, cargo, objetivo1, objetivo2, objetivo3, objetivo4,
        comp01, comp02, comp03, comp04, comp05,
        comp_esp1, comp_esp2, comp_esp3, comp_esp4, comp_esp5
      ]
    );

    return res.status(201).send({ message: "MF creado exitosamente" });

  } catch (err) {
    console.error("Error en creación de MF:", err);
    return res.status(500).send({ error: "Error interno del servidor" });

  } finally {
    if (conn) conn.release();
  }
};


const editMf = async (req, res) => {
  let conn;

  try {
    const {
      id,
      mf,
      cargo,
      objetivo1,
      objetivo2,
      objetivo3,
      objetivo4,
      comp01,
      comp02,
      comp03,
      comp04,
      comp05,
      comp_esp1,
      comp_esp2,
      comp_esp3,
      comp_esp4,
      comp_esp5
    } = req.body;

    conn = await getConnection();

    await conn.query(
      `UPDATE bf1noykqymg7gd1tuvpc.mf 
       SET 
        mf = ?, 
        cargo = ?, 
        objetivo1 = ?, 
        objetivo2 = ?, 
        objetivo3 = ?, 
        objetivo4 = ?, 
        comp01 = ?, 
        comp02 = ?, 
        comp03 = ?, 
        comp04 = ?, 
        comp05 = ?, 
        comp_esp1 = ?, 
        comp_esp2 = ?, 
        comp_esp3 = ?, 
        comp_esp4 = ?, 
        comp_esp5 = ?
       WHERE id = ?`,
      [
        mf,
        cargo,
        objetivo1,
        objetivo2,
        objetivo3,
        objetivo4,
        comp01,
        comp02,
        comp03,
        comp04,
        comp05,
        comp_esp1,
        comp_esp2,
        comp_esp3,
        comp_esp4,
        comp_esp5,
        id
      ]
    );

    return res.status(201).send({ message: "MF editado exitosamente" });

  } catch (error) {
    console.error("Error en edición de MF:", error);
    return res.status(500).send({ error: "Error interno del servidor" });

  } finally {
    if (conn) conn.release(); // ⬅️ cierre garantizado SIEMPRE
  }
};



module.exports = {
  getMfs,
  getOneMf,
  getAllOfMfs,
  createMf,
  editMf
};
