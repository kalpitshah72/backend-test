const express = require("express");
const cors = require("cors");
//Routes
const genreRoute = require("./routes/genre");
const movieRoute = require("./routes/movie");

function createServer() {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use("/genre", genreRoute);
  app.use("/movie", movieRoute);
  return app;
}

module.exports = createServer;
