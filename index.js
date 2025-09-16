const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Base de datos en memoria
const db = new sqlite3.Database(':memory:');

// Crear tabla y añadir datos
db.serialize(() => {
  db.run("CREATE TABLE users (id INT, name TEXT)");

  const stmt = db.prepare("INSERT INTO users VALUES (?, ?)");
  stmt.run(1, "Juan Carlos");
  stmt.run(2, "Equipo Grupo Oro");
  stmt.finalize();
});

// Endpoint raíz
app.get('/', (req, res) => {
  res.send('Bienvenido a la API 🚀');
});

// Endpoint para listar usuarios
app.get('/users', (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ users: rows });
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

