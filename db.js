const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'leoapp',
  password: 'Leo@5155',
  database: 'clinica'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado ao MySQL!');
});

module.exports = connection;
