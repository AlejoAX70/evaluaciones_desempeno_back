const { getConnection, sql } = require("../database/connection");

const getEmpleados = async (req, res) => {
  try {
    const conn = await getConnection();
    const [emp] = await conn.query(
      `SELECT * FROM bf1noykqymg7gd1tuvpc.empleados;`
    );
    res.status(201).send({ emp });
    conn.release();
  } catch (error) {
    console.error("Error en registro:", err);
    res.status(500).send({ error: "Error interno del servidor" });
  }
};

const createEmpleado = async (req, res) => {
  console.log("CrearEmpleado: ", req.body);

  try {
    const {
      nombres,
      apellidos,
      cedula,
      cargo,
      sede,
      empresa,
      uen,
      mf,
      nombre_lider,
      cc_lider,
      nombre_par,
      cc_par,
    } = req.body;

    // 0️⃣ Validar campos obligatorios
    const requiredFields = {
      nombres,
      apellidos,
      cedula,
      cargo,
      sede,
      empresa,
      uen,
      mf,
      nombre_lider,
      cc_lider,
      nombre_par,
      cc_par,
    };

    const emptyFields = Object.entries(requiredFields)
      .filter(
        ([key, value]) => value === undefined || value === null || value === ""
      )
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      return res.status(400).send({
        error: "Campos obligatorios vacíos",
        fields: emptyFields,
      });
    }

    // Validar que cédula sea numérica
    if (isNaN(Number(cedula))) {
      return res
        .status(400)
        .send({ error: "La cédula debe ser un número válido" });
    }

    const conn = await getConnection();

    // 1️⃣ Validar si ya existe un empleado con esa cédula
    const [exists] = await conn.query(
      `SELECT id FROM bf1noykqymg7gd1tuvpc.empleados WHERE cedula = ? LIMIT 1`,
      [cedula]
    );

    if (exists.length > 0) {
      conn.release();
      return res
        .status(400)
        .send({ error: "Ya existe un empleado con esa cédula" });
    }

    // 2️⃣ Insertar empleado
    await conn.query(
      `INSERT INTO bf1noykqymg7gd1tuvpc.empleados 
        (nombres, apellidos, cedula, cargo, sede, empresa, uen, mf, nombre_lider, cc_lider, nombre_par, cc_par)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombres,
        apellidos,
        cedula,
        cargo,
        sede,
        empresa,
        uen,
        mf,
        nombre_lider,
        cc_lider,
        nombre_par,
        cc_par,
      ]
    );

    conn.release();
    return res.status(201).send({ message: "Empleado creado exitosamente" });
  } catch (err) {
    console.error("Error en creación de empleado:", err);
    return res.status(500).send({ error: "Error interno del servidor" });
  }
};

const editEmpleado = async (req, res) => {
  // Implementación de edición de empleado

  try {
    const {
      nombres,
      apellidos,
      cedula,
      cargo,
      sede,
      empresa,
      uen,
      mf,
      nombre_lider,
      cc_lider,
      nombre_par,
      cc_par,
      cedula_anterior,
      cedula_nueva
    } = req.body;

    // 0️⃣ Validar campos obligatorios
    const requiredFields = {
      nombres,
      apellidos,
      cedula,
      cargo,
      sede,
      empresa,
      uen,
      mf,
      nombre_lider,
      cc_lider,
      nombre_par,
      cc_par,
    };
    const emptyFields = Object.entries(requiredFields)
      .filter(
        ([key, value]) => value === undefined || value === null || value === ""
      )
      .map(([key]) => key);
    if (emptyFields.length > 0) {
      return res.status(400).send({
        error: "Campos obligatorios vacíos",
        fields: emptyFields,
      });
    }

    const conn = await getConnection();

    await conn.query(
      `UPDATE bf1noykqymg7gd1tuvpc.empleados
       SET nombres = ?, apellidos = ?, cargo = ?, sede = ?, empresa = ?, uen = ?, mf = ?, nombre_lider = ?, cc_lider = ?, nombre_par = ?, cc_par = ?, cedula = ?
       WHERE cedula = ?`,
      [
        nombres,
        apellidos,
        cargo,
        sede,
        empresa,
        uen,
        mf,
        nombre_lider,
        cc_lider,
        nombre_par,
        cc_par,
        cedula_nueva,
        cedula_anterior,
      ]
    );
    conn.release();
    return res
      .status(200)
      .send({ message: "Empleado actualizado exitosamente" });
  } catch (error) {
    console.error("Error en edición de empleado:", error);
    return res.status(500).send({ error: "Error interno del servidor" });
  }
};

module.exports = {
  getEmpleados,
  createEmpleado,
  editEmpleado
};
