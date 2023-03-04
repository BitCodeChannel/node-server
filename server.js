const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require("knex");
const fileUpload = require("express-fileupload");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "123654",
    database: "srs",
  },
});

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());

app.post("/upload", async (req, res) => {
  const { name, data } = req.files.image;
  db("images")
    .insert({
      name: name,
      data: data,
    })
    .then((image) => res.status(200).json("Uploaded Successfully"))
    .catch((err) => res.status(400).json(err));
});

const { Pool } = require("pg");
const pool = new Pool({
  host: "127.0.0.1",
  port: 5432,
  user: "postgres",
  password: "123654",
  database: "srs",
});

app.get("/images/:id", async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("SELECT data FROM images WHERE id =$1", [id]);
  if (result.rows.length > 0) {
    const data = result.rows[0].data;
    res.writeHead(200, {
      "Content-Type": "image/jpeg",
      "Content-Length": data.length,
    });
    res.end(data);
  } else {
    res.json("no image");
  }
});

db.select("*")
  .from("images")
  .then((data) => console.log(data));

app.listen(3001, () => {
  console.log("this server is running on port 3001");
});
