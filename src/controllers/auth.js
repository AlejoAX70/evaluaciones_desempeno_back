const {getConnection, sql} = require('../database/connection');
const jwt = require('jsonwebtoken')
const  bcrypt = require('bcrypt')


async function loginUser(req, res) {
  console.log("Login attempt with data:", req.body);
    
  const { email, password } = req.body;

  let conn;

  try {
    conn = await getConnection();

    // Obtener login + UEN del empleado
    const [rows] = await conn.query(`
      SELECT l.*, e.uen, e.mf, e.nombres, e.apellidos, e.cargo
      FROM login l
      LEFT JOIN empleados e ON e.cedula = l.cedula
      WHERE l.cedula = ?
    `, [email]);

    console.log("Query result:", rows);

    if (rows.length === 0) {
      return res.status(404).send({ error: 'usuario no encontrado' });
    }

    const user = rows[0];

    // Verificar contraseña
    const passwordCheck = await bcrypt.compare(password, user.password_hash);
    if (!passwordCheck) {
      return res.status(401).send({ error: 'usuario no encontrado' });
    }

    // Verificar estado
    if (user.estado !== 'activo') {
      return res.status(403).send({ error: 'usuario inactivo' });
    }

    // Generar token
    jwt.sign({ username: user.cedula }, 'secret_key', (err, token) => {
      if (err) {
        return res.status(400).send({ error: 'jwt error' });
      }

      res.send({
        token,
        user: {
          username: user.cedula,
          role: user.rol,
          uen: user.uen,
          mf: user.mf,
          nombres: user.nombres,
          apellidos: user.apellidos,
          cargo: user.cargo,
        }
      });
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send({ error: 'error interno del servidor' });
  } finally {
    if (conn) conn.release(); // Liberación garantizada
  }
}



async function registerUser(req, res) {
  console.log("Registering user:", req.body);
    
  const { name, username, password, role } = req.body;

  let conn; // importante declarar afuera

  try {
    conn = await getConnection();

    // Validar si el usuario ya existe
    const [existing] = await conn.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (existing.length > 0) {
      return res.status(409).send({ error: 'Usuario o correo ya existe' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Insertar usuario
    await conn.query(
      `INSERT INTO users (name, username, password_hash, role)
       VALUES (?, ?, ?, ?)`,
      [name, username, passwordHash, role || 'user']
    );

    res.status(201).send({ message: 'Usuario registrado exitosamente' });

  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).send({ error: 'Error interno del servidor' });
  } finally {
    if (conn) conn.release(); // 🔥 siempre se ejecuta
  }
}



module.exports= {
    loginUser,
    registerUser,
}
