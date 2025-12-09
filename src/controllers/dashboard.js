const { getConnection } = require("../database/connection");

async function InitialData(req, res) {
  console.log("Initial Data: ", req.body);

  const { cedula, uen } = req.body;
  let conn;

  try {
    conn = await getConnection();

    // 1️⃣ OBTENER EL ÚLTIMO AÑO DISPONIBLE
    const [rows] = await conn.query(
      `SELECT MAX(año) AS ultimo_anio
       FROM bf1noykqymg7gd1tuvpc.resultados`
    );

    const ultimoAnio = rows[0]?.ultimo_anio;

    // OBTENER DATOS DEL EMPLEADO SIEMPRE
    const [empleadoData] = await conn.query(
      `SELECT cedula, nombres, cargo, sede, empresa, uen 
       FROM bf1noykqymg7gd1tuvpc.empleados
       WHERE cedula = ?`,
      [cedula]
    );

    // Cantidad de veces que LO han evaluado (Par / Líder)
    const [countEvaluado] = await conn.query(
      `SELECT COUNT(*) AS total_evaluado
       FROM bf1noykqymg7gd1tuvpc.resultados
       WHERE evaluado = ?
       AND evaluacion != 'Auto'
       AND año = ?`,
      [cedula, ultimoAnio]
    );

    const totalEvaluado = countEvaluado[0].total_evaluado;

    // Cantidad de evaluaciones que ÉL ha realizado
    const [countCedula] = await conn.query(
      `SELECT COUNT(*) AS total_realizadas
       FROM bf1noykqymg7gd1tuvpc.resultados
       WHERE cedula = ?
       AND año = ?`,
      [cedula, ultimoAnio]
    );

    const totalRealizadas = countCedula[0].total_realizadas;

    console.log("totalRealizadas: ", totalRealizadas);
    console.log("totalEvaluado: ", totalEvaluado);

    // SI NO TIENE NINGUNA EVALUACIÓN AÚN
    if (!ultimoAnio) {
      return res.json({
        success: true,
        calificacion: [
          {
            ...empleadoData[0],
            evaluado: cedula,
            primer_resultado: 0,
            segundo_resultado: 0,
            resultado_final: 0,
          },
        ],
        totalEvaluado,
        totalRealizadas,
        año: ultimoAnio,
      });
    }

    // CONSULTA PRINCIPAL FILTRANDO POR UEN Y CÉDULA
    const [data] = await conn.query(
      `
      SELECT 
        emp.cedula,
        emp.nombres,
        emp.cargo,
        emp.sede,
        emp.empresa,
        emp.uen,
        p.evaluado,
        (((p.primer_resultado / 10) * 3) / 100) AS primer_resultado,
        l.segundo_resultado,
        ((((p.primer_resultado / 10) * 3) / 100) + l.segundo_resultado) AS resultado_final
      FROM
        (
          SELECT
            e.evaluado,
            (
              (SUM(e.comp01) / 3) * 20 +
              (SUM(e.comp02) / 3) * 20 +
              (SUM(e.comp03) / 3) * 20 +
              (SUM(e.comp04) / 3) * 20 +
              (SUM(e.comp05) / 3) * 20 +
              (SUM(e.comp_e1) / 3) * 20 +
              (SUM(e.comp_e2) / 3) * 20 +
              (SUM(e.comp_e3) / 3) * 20 +
              (SUM(e.comp_e4) / 3) * 20 +
              (SUM(e.comp_e5) / 3) * 20
            ) AS primer_resultado
          FROM bf1noykqymg7gd1tuvpc.resultados e
          WHERE e.evaluacion IN ('Auto', 'Par', 'Lider')
          AND e.año = ?
          GROUP BY e.evaluado
        ) p
      JOIN
        (
          SELECT
            e.evaluado,
            (((e.cal1 + e.cal2 + e.cal3 + e.cal4) / 4.0) * 7) / 100 AS segundo_resultado
          FROM bf1noykqymg7gd1tuvpc.resultados e
          WHERE e.evaluacion = 'Lider'
          AND e.año = ?
        ) l ON p.evaluado = l.evaluado
      JOIN bf1noykqymg7gd1tuvpc.empleados emp 
        ON emp.cedula = p.evaluado
      WHERE emp.uen = ?
      AND emp.cedula = ?
      `,
      [ultimoAnio, ultimoAnio, uen, cedula]
    );

    // SI NO HAY REGISTROS, DEVOLVER DATOS BÁSICOS
    if (data.length === 0) {
      return res.json({
        success: true,
        calificacion: [
          {
            ...empleadoData[0],
            evaluado: cedula,
            primer_resultado: 0,
            segundo_resultado: 0,
            resultado_final: 0,
          },
        ],
        totalEvaluado,
        totalRealizadas,
        año: ultimoAnio,
      });
    }

    // RESPUESTA NORMAL
    res.status(200).json({
      success: true,
      calificacion: data,
      totalEvaluado,
      totalRealizadas,
      año: ultimoAnio,
    });

  } catch (error) {
    console.error("Error en InitialData:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los datos iniciales.",
    });
  } finally {
    if (conn) conn.release();
  }
}


module.exports = {
  InitialData,
};
