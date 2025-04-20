import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
const port = parseInt(process.env.BACKEND_PORT || 3000);
app.use(cors()); // for allowing cross-origin requests from frontend to backend server.It is a middleware function.
app.use(express.json()); // for parsing application/json

app.listen(port, () => {
  console.log(`Server listening on port :${port}`);
});

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST || "db",
  port: parseInt(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "password",
  database: process.env.MYSQL_DB || "usersdb",
});
const initializeDbQuery =
  "CREATE TABLE IF NOT EXISTS usersdb.users(id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(100),email VARCHAR(100) UNIQUE NOT NULL,password VARCHAR(100) NOT NULL)";

connection.query(initializeDbQuery, [], (err, result) => {
  if (err) {
    console.log("err", err);
    console.log("Error in initializing schema");
  } else {
    console.log("Successfully created users table");
  }
});

app.get("/", (req, res) => {
  const queery = "SELECT * FROM usersdb.users";
  connection.query(queery, (err, result) => {
    if (err) return res.json({ Message: err });
    return res.json(result);
  });
});

app.post("/userRegistration", (req, res) => {
  console.log("received request");
  const query = "INSERT INTO usersdb.users (name, email,password) VALUES (?)";
  const values = [req.body.name, req.body.email, req.body.password];
  connection.query(query, [values], (err, result) => {
    if (err) {
      console.log("err", err);
      return res.json({ Message: err });
    }
    return res.json(result);
  });
});

app.get("/read/:id", (req, res) => {
  const query = "SELECT * FROM usersdb.users WHERE id = ?";
  const id = [req.params.id];
  connection.query(query, [id], (err, result) => {
    if (err) return res.json({ Message: err });
    return res.json(result);
  });
});

app.put("/update/:id", (req, res) => {
  const query =
    "UPDATE usersdb.users SET name = ?, email = ?, password = ? WHERE id = ?";
  connection.query(
    query,
    [req.body.name, req.body.email, req.body.password, req.params.id],
    (err, result) => {
      if (err) return res.json({ Message: err });
      return res.json(result);
    }
  );
});

app.delete("/delete/:id", (req, res) => {
  const query = "DELETE FROM usersdb.users WHERE id = ?";
  connection.query(query, [req.params.id], (err, result) => {
    if (err) return res.json({ Message: err });
    return res.json(result);
  });
});
