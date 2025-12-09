const { getConnection, sql } = require("../database/connection");
const bcrypt = require("bcrypt");

const getAllLogins = async (req, res) => {
  let conn;

  try {
    conn = await getConnection();

    const [logins] = await conn.query(
      `SELECT cedula, rol, estado, creado_en, actualizado_en 
       FROM bf1noykqymg7gd1tuvpc.login;`
    );

    return res.status(200).send({ logins });

  } catch (error) {
    console.error("Error en registro:", error);
    return res.status(500).send({ error: "Error interno del servidor" });

  } finally {
    if (conn) conn.release(); // ⬅️ cierre garantizado siempre
  }
};


const createUser = async (req, res) => {
  console.log("CrearUsuario: ", req.body);

  let conn;

  try {
    const {
      cedula,
      rol,
      estado,
      password_hash,
    } = req.body;

    // 0️⃣ Validar campos obligatorios
    const requiredFields = { cedula, rol, estado, password_hash };
    const emptyFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      return res.status(400).send({
        error: "Campos obligatorios vacíos",
        fields: emptyFields,
      });
    }

    conn = await getConnection();

    // 1️⃣ Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password_hash, 12);

    // 2️⃣ Insertar usuario
    await conn.query(
      `INSERT INTO bf1noykqymg7gd1tuvpc.login (cedula, rol, estado, password_hash) 
       VALUES (?, ?, ?, ?)`,
      [cedula, rol, estado, hashedPassword]
    );

    return res.status(201).send({ message: "Usuario creado exitosamente" });

  } catch (error) {
    console.error("Error en creación de usuario:", error);
    return res.status(500).send({ error: "Error interno del servidor" });

  } finally {
    if (conn) conn.release(); // ⬅️ cierre garantizado SIEMPRE
  }
};



const editUser = async (req, res) => {
  console.log("EditarUsuario: ", req.body);

  let conn;

  try { 
    const {
      cedula,
      rol,
      estado,
      password_hash,
    } = req.body;

    // 0️⃣ Validar campos obligatorios (menos contraseña)
    const requiredFields = { cedula, rol, estado };
    const emptyFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      return res.status(400).send({
        error: "Campos obligatorios vacíos",
        fields: emptyFields,
      });
    }

    conn = await getConnection();

    // 1️⃣ Construir UPDATE dinámico
    let query = `UPDATE bf1noykqymg7gd1tuvpc.login SET rol = ?, estado = ?`;
    let params = [rol, estado];

    // 2️⃣ Si mandan contraseña, encriptar y agregar al UPDATE
    if (password_hash && password_hash.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password_hash, 12);
      query += `, password_hash = ?`;
      params.push(hashedPassword);
    }

    query += ` WHERE cedula = ?`;
    params.push(cedula);

    // 3️⃣ Ejecutar UPDATE
    await conn.query(query, params);

    return res.status(200).send({ message: "Usuario actualizado exitosamente" });

  } catch (error) {
    console.error("Error en edición de usuario:", error);
    return res.status(500).send({ error: "Error interno del servidor" });

  } finally {
    if (conn) conn.release(); // ⬅️ cierre garantizado SIEMPRE
  }
};


module.exports = {
  getAllLogins,
  createUser,
  editUser
};