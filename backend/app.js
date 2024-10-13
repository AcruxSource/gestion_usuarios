import sqlite3 from "sqlite3";
import express from "express";
import cors from "cors";

const app = express();
const SQLite = sqlite3.verbose();

app.use(express.json());
app.use(cors());

const database = new SQLite.Database("./database/usuarios.db", (error) => {
  if (error) {
    console.error("Error en la conexión a la base de datos");
  } else {
    console.log("conexión a la base de datos exitosa");
  }
});

database.serialize(() => {
  database.run(`CREATE TABLE IF NOT EXISTS usuarios(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    edad INTEGER NOT NULL,
    pais VARCHAR(50) NOT NULL,
    ciudad VARCHAR(50) NOT NULL,
    email TEXT NOT NULL UNIQUE,
    imagen TEXT
    )`);
});

app.get("/", (req, res) => {
  res.status(200).send("Bienvenidos");
});

app.get("/users", (req, res) => {
  database.serialize(() => {
    database.all("SELECT * FROM usuarios", [], (error, rows) => {
      if (error) {
        res
          .status(500)
          .json({ error: "Error al intentar cargar la lista de usuarios" });
      } else {
        res.status(200).json({
          rows: rows,
          message: "La lista de usuarios se cargó con éxito",
        });
      }
    });
  });
});

app.post("/users", (req, res) => {
  const { nombre, apellido, edad, pais, ciudad, email, imagen } = req.body;

  database.run(
    `INSERT INTO usuarios(nombre, apellido, edad, pais, ciudad, email, imagen) 
    VALUES (?,?,?,?,?,?,?)`,
    [nombre, apellido, edad, pais, ciudad, email, imagen],
    function (error) {
      if (error) {
        return res.status(500).json({ error: "Intento fallido" });
      } else if (this.changes) {
        res.status(200).json({ message: "Usuario agregado exitosamente" });
      }
    }
  );
});

app.delete("/users", (req, res) => {
  const { email } = req.body;

  database.run(
    `DELETE FROM usuarios WHERE email = ?`,
    [email],
    function (error) {
      if (error) {
        return res.status(500).json({ error: error.message });
      } else if (this.changes === 0) {
        res.status(400).json({ message: "usuario no existe" });
      } else {
        res
          .status(200)
          .json({ message: `usuario con email '${email}' eliminado` });
      }
    }
  );
});

app.listen({ port: 3000 }, () => {
  console.log("Escuchado por el puerto 3000");
});
