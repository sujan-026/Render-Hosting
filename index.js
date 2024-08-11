import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
const port = 4000;
dotenv.config();

const { Pool } = pg; // Destructure Pool from the imported pg module


// Creating the link between frontend and the database
const pool = new Pool({
    // connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
    connectionString: process.env.DB_URL
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET home page
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM countries");
    res.render("index.ejs", { rows: result.rows });
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Close the pool on exit
process.on("exit", () => {
  pool.end(() => {
    console.log("Pool has ended");
  });
});
