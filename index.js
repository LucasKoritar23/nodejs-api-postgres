const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "events",
  password: "postgres",
  port: 5432,
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Healh Check
app.get("/", (request, response) => {
  response.json({ info: "API Events QA UP - Bots QA-4all" });
});

// Get Events
app.get("/events/:id", (request, response) => {
  const id = parseInt(request.params.id);
  pool.query(
    "SELECT * FROM message_events WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
});

app.get("/events", (request, response) => {
  pool.query(
    "SELECT * FROM message_events ORDER BY id ASC",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
});

// POST Events
app.post("/events", (request, response) => {
  const { message_text, send_date } = request.body;
  const created_on = new Date();
  //remove after
  const update_at = null;
  pool.query(
    "INSERT INTO message_events (message_text, send_date, created_on, update_at) VALUES ($1, $2, $3, $4) RETURNING *",
    [message_text, send_date, created_on, update_at],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(results.rows[0]);
    }
  );
});

// PUT Events
app.put("/events/:id", (request, response) => {
  const id = parseInt(request.params.id);
  const { message_text, send_date } = request.body;

  const update_at = new Date();
  pool.query(
    "UPDATE message_events SET message_text = $1, send_date = $2, update_at = $4 WHERE id = $3 RETURNING *",
    [message_text, send_date, id, update_at],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(results.rows[0]);
    }
  );
});

// DELETE Events
app.delete("/events/:id", (request, response) => {
  const id = parseInt(request.params.id);
  pool.query(
    "DELETE FROM message_events WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(results.rows[0]);
    }
  );
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});