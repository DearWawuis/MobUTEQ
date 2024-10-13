const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Importar bcrypt

// Crear la aplicación Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configurar la conexión a MySQL (con los datos de AWS)
const db = mysql.createConnection({
  host: 'mobuteq.cxk8g0o2e0ju.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'B4ckintha2024NEW',
  database: 'mobuteq'
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos: ', err);
    return;
  }
  console.log('Conexión exitosa a MySQL.');
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor corriendo...');
});

// Registrar un usuario
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Validación
  if (!name || !email || !password) {
    return res.status(400).send({ message: 'Todos los campos son obligatorios.' });
  }

  // Verificar si el correo ya está registrado
  const checkEmailSql = 'SELECT * FROM usuarios WHERE correo = ?';
  db.query(checkEmailSql, [email], async (err, results) => {
    if (err) {
      console.error('Error al verificar el correo: ', err);
      return res.status(500).send({ message: 'Error al verificar el correo.' });
    }

    if (results.length > 0) {
      return res.status(409).send({ message: 'El correo ya está registrado.' }); // Conflicto si el correo ya existe
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el usuario en la base de datos
    const sql = 'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)';
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error al registrar el usuario: ', err);
        return res.status(500).send({ message: 'Error al registrar el usuario.' });
      }
      res.send({ message: 'Usuario registrado exitosamente.' });
    });
  });
});

// Iniciar sesión
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Validar credenciales
  const sql = 'SELECT * FROM usuarios WHERE correo = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Error al iniciar sesión: ', err);
      return res.status(500).send({ message: 'Error al iniciar sesión.' });
    }

    if (results.length === 0) {
      return res.status(404).send({ message: 'No se encontró el correo.' }); // Correo no existe
    }

    const user = results[0];

    // Verificar la contraseña
    bcrypt.compare(password, user.contrasena, (err, match) => {
      if (err) {
        console.error('Error al comparar la contraseña: ', err);
        return res.status(500).send({ message: 'Error al verificar la contraseña.' });
      }

      if (!match) {
        return res.status(401).send({ message: 'Contraseña incorrecta.' }); // Contraseña incorrecta
      }

      res.send({ message: 'Login exitoso.', user });
    });
  });
});

// Iniciar el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
