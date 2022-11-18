const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const strftime = require("strftime");
const app = express();
const port = 3000;

app.use(cors());

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

  if (message_text == "" || message_text == null) {
    return response
      .status(400)
      .json({ error: "Message field cannot be null or empty" });
  }

  if (send_date == "" || send_date == null) {
    return response
      .status(400)
      .json({ error: "sendDate field cannot be null or empty" });
  }

  const currtendDate = strftime("%Y-%m-%d");
  const currentDateString = Date.parse(currtendDate);
  const sendDateString = Date.parse(send_date);

  if (isNaN(sendDateString)) {
    return response.status(400).json({
      error: "The value informed in the sendDate field is invalid",
    });
  }

  if (sendDateString < currentDateString) {
    return response.status(400).json({
      error: "The sendDate must be greater than or equal to the current date",
    });
  }

  const created_on = new Date();
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

  if (message_text == "" || message_text == null) {
    return response
      .status(400)
      .json({ error: "Message field cannot be null or empty" });
  }

  if (send_date == "" || send_date == null) {
    return response
      .status(400)
      .json({ error: "sendDate field cannot be null or empty" });
  }

  const currtendDate = strftime("%Y-%m-%d");
  const currentDateString = Date.parse(currtendDate);
  const sendDateString = Date.parse(send_date);

  if (isNaN(sendDateString)) {
    return response.status(400).json({
      error: "The value informed in the sendDate field is invalid",
    });
  }

  if (sendDateString < currentDateString) {
    return response.status(400).json({
      error: "The sendDate must be greater than or equal to the current date",
    });
  }

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
