const express = require("express");
const Movie = require("../models/Movie");
const router = express.Router();

//GETS BACK ALL THE MOVIES
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().populate("genres");
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//ADD THE MOVIE AND RETURN THE RECENTLY ADDED MOVIE
router.post("/", async (req, res) => {
  const { name, description, releaseDate, rating, duration, genres } = req.body;
  const movie = new Movie({
    name,
    description,
    releaseDate,
    rating,
    duration,
    genres,
  });
  try {
    const savedMovie = await movie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//GETS BACK THE SPECIFIC MOVIE
router.get("/:id", getMovie, async (req, res) => {
  res.json(res.movie);
});

//DELETE THE SPECIFIC MOVIE AND RETURN IT
router.delete("/:id", getMovie, async (req, res) => {
  try {
    const removedMovie = await res.movie.remove();
    res.json(removedMovie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//MIDDLEWARE FUNCTION TO GET THE GENRE BASED ON ID FOR GET AND DELETE METHODS.
async function getMovie(req, res, next) {
  let movie;
  const { id } = req.params;
  try {
    movie = await Movie.findById(id).populate("genres");
    if (movie === null) {
      return res.status(404).json({ message: "Cannot Find Movie" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.movie = movie;
  next();
}

module.exports = router;
