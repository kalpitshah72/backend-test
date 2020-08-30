const mongoose = require("mongoose");

const MovieSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  genres: [
    {
      type: mongoose.Schema.Types.ObjectID,
      ref: "Genre",
      required: true,
    },
  ],
});

module.exports = mongoose.model("Movie", MovieSchema);
