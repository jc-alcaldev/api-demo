const express = require('express');               //express: framework para montar el servidor web
const sqlite3 = require('sqlite3').verbose();     // para manejar las db sqlite3   .verbose() da mensajes claros si hay errores

const app = express();
const port = 3000;

// Base de datos en memoria, no en un archivo, por lo que se borra cuando cierra el servidor
const db = new sqlite3.Database(':memory:');

// Crear tabla y añadir datos
db.serialize(() => {
  db.run("CREATE TABLE users (id INT, name TEXT)");  // tabala con dos columnas |id|name|

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

// Vamos a agregar un nuevo end point en un nueva rama y y que devuelva el mensaje

app.get('/greeting', (req, res) => {
  res.json({ message: "Hola desde el endpoint /greeting"});
});

// Vamos a contar los usuarios en la db
app.get('/users/count', (req, res) => {
  db.get("SELECT COUNT(*) as total FROM users", [], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ totalUsers: row.total });
  });
});


app.listen(port, () => {                          //Aqui arrancamos el servidor
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

