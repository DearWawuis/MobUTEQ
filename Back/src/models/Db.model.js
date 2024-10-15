const mysql = require('mysql2');

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

module.exports = db;
