const express = require("express");
const Genre = require("../models/Genre");
const router = express.Router();

//GETS BACK ALL THE GENRES
router.get("/", async (req, res) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//ADD THE GENRE AND RETURN THE RECENTLY ADDED GENRE
router.post("/", async (req, res) => {
  const { name, description } = req.body;
  const genre = new Genre({
    name,
    description,
  });
  try {
    const savedGenre = await genre.save();
    res.status(201).json(savedGenre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//GETS BACK THE SPECIFIC GENRE
router.get("/:id", getGenre, async (req, res) => {
  res.json(res.genre);
});

//DELETE THE SPECIFIC GENRE AND RETURN IT
router.delete("/:id", getGenre, async (req, res) => {
  try {
    const removedGenre = await res.genre.remove();
    res.json(removedGenre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//MIDDLEWARE FUNCTION TO GET THE GENRE BASED ON ID FOR GET AND DELETE METHODS.
async function getGenre(req, res, next) {
  let genre;
  const { id } = req.params;
  try {
    genre = await Genre.findById(id);
    if (genre === null) {
      return res.status(404).json({ message: "Cannot Find Genre" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.genre = genre;
  next();
}

module.exports = router;
