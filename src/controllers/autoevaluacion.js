const { getConnection } = require("../database/connection");

const createAutoevaluacion = async (req, res) => {
  let conn;

  try {
    console.log("Crear Autoevaluacion con datos:", JSON.stringify(req.body, null, 2));

    const { result } = req.body;
    conn = await getConnection();

    const añoActual = new Date().getFullYear();

    const [exists] = await conn.query(
      `SELECT id FROM resultados 
       WHERE cedula = ? 
       AND evaluacion = ? 
       AND año = ? 
       AND evaluado = ?
       LIMIT 1`,
      [
        result.cedula,
        result.evaluacion,
        añoActual,
        result.evaluacion == "Auto" ? result.cedula : result.evaluatedId
      ]
    );

    if (exists.length > 0) {
      return res.status(409).json({
        error: `El usuario ya tiene una evaluación registrada para el año ${añoActual}`
      });
    }

    const [empRows] = await conn.query(
      `SELECT nombres, apellidos, cargo, sede, empresa 
       FROM empleados
       WHERE cedula = ?`,
      [result.cedula]
    );

    if (empRows.length === 0) {
      return res.status(404).json({ error: "Empleado no encontrado" });
    }

    const empleado = empRows[0];

    const getRating = (id) =>
      result.starResponses.find((r) => r.questionId === id)?.rating || 0;

    const comp01 = getRating("comp01");
    const comp02 = getRating("comp02");
    const comp03 = getRating("comp03");
    const comp04 = getRating("comp04");
    const comp05 = getRating("comp05");

    const comp_e1 = getRating("comp_esp1");
    const comp_e2 = getRating("comp_esp2");
    const comp_e3 = getRating("comp_esp3");
    const comp_e4 = getRating("comp_esp4");
    const comp_e5 = getRating("comp_esp5");

    const objetivo1 = result.freeResponses[0]?.text || "";
    const objetivo2 = result.freeResponses[1]?.text || "";
    const objetivo3 = result.freeResponses[2]?.text || "";
    const objetivo4 = result.freeResponses[3]?.text || "";

    const cal1 = result.freeResponses[0]?.score || 0;
    const cal2 = result.freeResponses[1]?.score || 0;
    const cal3 = result.freeResponses[2]?.score || 0;
    const cal4 = result.freeResponses[3]?.score || 0;

    await conn.query(
      `INSERT INTO resultados
        (nombre, cargo, sede, empresa, evaluacion, evaluado,
        objetivo1, cal1, objetivo2, cal2, objetivo3, cal3, objetivo4, cal4,
        comp01, comp02, comp03, comp04, comp05, obs_comp_org,
        comp_e1, comp_e2, comp_e3, comp_e4, comp_e5, obs_comp_esp, estado, cedula, año)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
      [
        `${empleado.nombres} ${empleado.apellidos}`,
        empleado.cargo,
        empleado.sede,
        empleado.empresa,
        result.evaluacion,
        result.evaluacion == "Auto" ? result.cedula : result.evaluatedId,
        objetivo1,
        cal1,
        objetivo2,
        cal2,
        objetivo3,
        cal3,
        objetivo4,
        cal4,
        comp01,
        comp02,
        comp03,
        comp04,
        comp05,
        result.obsOrganizacionales || "",
        comp_e1,
        comp_e2,
        comp_e3,
        comp_e4,
        comp_e5,
        result.obsEspecificas || "",
        "Terminar",
        result.cedula,
        añoActual,
      ]
    );

    res.status(201).json({ message: "Autoevaluación creada exitosamente" });

  } catch (error) {
    console.error("Error createAutoevaluacion:", error);
    res.status(500).json({ error: "Error al crear la autoevaluación" });
  } finally {
    if (conn) conn.release(); // 🔥 SIEMPRE
  }
};


module.exports = {
  createAutoevaluacion
};
