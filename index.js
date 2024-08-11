import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
const port = 4000;
dotenv.config();

// const db = new pg.Client({
//     host: "localhost",
//     user: "postgres",
//     port: 5432,
//     password: "Sujan@2004",
//     database: "trial"
// })

//Creating the link btw frontend and the database
// const db = new pg.Client({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// Creating the link between frontend and the database
const db = new pg.Client({
    connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
  });

db.connect();

let quiz = [];

db.query("SELECT * FROM countries", (err, res) => {
  if(err){
    console.log("Error executing query", err.stack);
  }
  else{
    quiz = res.rows;
  }
  db.end();
})

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET home page
app.get("/", async (req, res) => {
  res.render("index.ejs", {rows: quiz});
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
