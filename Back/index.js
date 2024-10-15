const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./src/models/Db.model'); // Conexión a la base de datos
const authRoutes = require('./src/routes/auth.routes'); // Rutas de autenticación

// Crear la aplicación Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Usar las rutas de autenticación
app.use('/api', authRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor corriendo...');
});

// Iniciar el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
