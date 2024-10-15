const db = require('./Db.model');

// Buscar usuario por correo
exports.findByEmail = (email, callback) => {
  const sql = 'SELECT * FROM usuarios WHERE correo = ?';
  db.query(sql, [email], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

// Crear un nuevo usuario
exports.create = (name, email, hashedPassword, callback) => {
    const sql = 'INSERT INTO usuarios (nombre, correo, contrasena, verificado, token_verificacion) VALUES (?, ?, ?, ?, ?)';
    const confirmationCode = require('crypto').randomBytes(32).toString('hex'); // Código de confirmación
    db.query(sql, [name, email, hashedPassword, false, confirmationCode], (err, result) => {
      if (err) return callback(err);
      callback(null, result, confirmationCode); // Devolvemos el confirmationCode para el correo de verificación
    });
  };
  

// Activar usuario
exports.activateUser = (confirmationCode, callback) => {
    const sql = 'UPDATE usuarios SET verificado = TRUE, token_verificacion = NULL, fecha_verificacion = NOW() WHERE token_verificacion = ?';
    db.query(sql, [confirmationCode], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  };  
