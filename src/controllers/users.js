const { getConnection, sql } = require("../database/connection");
const bcrypt = require("bcrypt");

const getAllLogins = async (req, res) => {
  try {
    const conn = await getConnection();
    const [logins] = await conn.query(
        `SELECT cedula, rol, estado, creado_en, actualizado_en FROM bf1noykqymg7gd1tuvpc.login;`
    );
    res.status(201).send({ logins });
    conn.release();
  } catch (error) {
    console.error("Error en registro:", err);
    res.status(500).send({ error: "Error interno del servidor" });
  }
};

const createUser = async (req, res) => {
  console.log("CrearUsuario: ", req.body);  

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

    const conn = await getConnection();

    // 1️⃣ Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password_hash, 12);

    // 2️⃣ Insertar usuario
    await conn.query(
      `INSERT INTO bf1noykqymg7gd1tuvpc.login (cedula, rol, estado, password_hash) VALUES (?, ?, ?, ?)`,
      [cedula, rol, estado, hashedPassword]
    );

    res.status(201).send({ message: "Usuario creado exitosamente" });
    conn.release();

  } catch (error) {
    console.error("Error en creación de usuario:", error);
    res.status(500).send({ error: "Error interno del servidor" });
  }
};


const editUser = async (req, res) => {
  console.log("EditarUsuario: ", req.body);  

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

    const conn = await getConnection();

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

    res.status(201).send({ message: "Usuario actualizado exitosamente" });
    conn.release();
    
  } catch (error) {
    console.error("Error en edición de usuario:", error);
    res.status(500).send({ error: "Error interno del servidor" });
  }
};

module.exports = {
  getAllLogins,
  createUser,
  editUser
};