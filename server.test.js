const createServer = require("./server");
const Genre = require("./models/Genre");
const Movie = require("./models/Movie");
const mongoose = require("mongoose");
const supertest = require("supertest");
require("dotenv/config");

beforeEach((done) => {
  mongoose.connect(
    "mongodb://localhost:27017/backend-test",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done()
  );
});

afterEach((done) => {
  // mongoose.connection.db.dropDatabase(() => {
  //   mongoose.connection.close(() => done());
  // });
  done();
});

const app = createServer();

test("GET /genre", async () => {
  const genre = await Genre.create({
    name: "Genre By Test",
    description: "Lorem ipsum Genre by test",
  });

  await supertest(app)
    .get("/genre")
    .expect(200)
    .then((response) => {
      expect(response.body[0].name).toBe(genre.name);
      expect(response.body[0].description).toBe(genre.description);
    });
});

test("POST /genre", async () => {
  const data = {
    name: "Post Genre Name",
    description: "Post Genre Description",
  };

  await supertest(app)
    .post("/genre")
    .send(data)
    .expect(201)
    .then(async (response) => {
      // Check the response
      expect(response.body._id).toBeTruthy();
      expect(response.body.name).toBe(data.name);
      expect(response.body.description).toBe(data.description);

      // Check the data in the database
      const genre = await Genre.findOne({ _id: response.body._id });
      expect(genre).toBeTruthy();
      expect(genre.name).toBe(data.name);
      expect(genre.description).toBe(data.description);
    });
});

test("GET /genre/:id", async () => {
  const genre = await Genre.create({
    name: "This is the genre name",
    description: "This is the genre description",
  });

  await supertest(app)
    .get("/genre/" + genre.id)
    .expect(200)
    .then((response) => {
      expect(response.body._id).toBe(genre.id);
      expect(response.body.name).toBe(genre.name);
      expect(response.body.description).toBe(genre.description);
    });
});

test("DELETE /genre/:id", async () => {
  const genre = await Genre.create({
    name: "Delete",
    description: "This is to be deleted, generated  by test",
  });

  await supertest(app)
    .delete("/genre/" + genre.id)
    .then(async () => {
      expect(await Genre.findOne({ _id: genre.id })).toBeFalsy();
    });
});

test("POST /movie", async () => {
  const genreID = await Genre.distinct("_id", {});
  const data = {
    name: "SuperMan",
    description: "This is the SuperMan Movie Description",
    releaseDate: "2020-08-30T10:25:48.173Z",
    rating: 4,
    duration: "2.5 Hours",
    genres: genreID,
  };

  await supertest(app)
    .post("/movie")
    .send(data)
    .expect(201)
    .then(async (response) => {
      // Check the response
      expect(response.body._id).toBeTruthy();
      expect(response.body.name).toBe(data.name);
      expect(response.body.description).toBe(data.description);
      expect(response.body.releaseDate).toBe(data.releaseDate);
      expect(response.body.rating).toBe(data.rating);
      expect(response.body.duration).toBe(data.duration);
      expect(Array.isArray(response.body.genres)).toBeTruthy();

      // Check the data in the database
      const movie = await Movie.findOne({ _id: response.body._id });
      expect(movie).toBeTruthy();
      expect(movie.name).toBe(data.name);
      expect(movie.description).toBe(data.description);
      expect(response.body.releaseDate).toBe(data.releaseDate);
      expect(response.body.rating).toBe(data.rating);
      expect(response.body.duration).toBe(data.duration);
      expect(Array.isArray(response.body.genres)).toBeTruthy();
    });
});

test("DELETE /movie/:id", async () => {
  const genreID = await Genre.distinct("_id", {});
  const movie = await Movie.create({
    name: "SuperMan",
    description: "This is the SuperMan Movie Description",
    releaseDate: "2020-08-30T10:25:48.173Z",
    rating: 4,
    duration: "2.5 Hours",
    genres: genreID,
  });

  await supertest(app)
    .delete("/movie/" + movie.id)
    .then(async () => {
      expect(await Movie.findOne({ _id: movie.id })).toBeFalsy();
    });
});

test("GET /movie/:id", async () => {
  const genreID = await Genre.distinct("_id", {});
  const movie = await Movie.create({
    name: "SuperMan",
    description: "This is the SuperMan Movie Description",
    releaseDate: "2020-08-30T10:25:48.173Z",
    rating: 4,
    duration: "2.5 Hours",
    genres: genreID,
  });

  await supertest(app)
    .get("/movie/" + movie.id)
    .expect(200)
    .then((response) => {
      expect(response.body._id).toBe(movie.id);
      expect(response.body.name).toBe(movie.name);
      expect(response.body.description).toBe(movie.description);
      expect(response.body.rating).toBe(movie.rating);
      expect(response.body.duration).toBe(movie.duration);
      expect(Array.isArray(response.body.genres)).toBeTruthy();
    });
});

test("GET /movie", async () => {
  const genreID = await Genre.distinct("_id", {});
  const movie = await Movie.create({
    name: "SuperMan",
    description: "This is the SuperMan Movie Description",
    releaseDate: "2020-08-30T10:25:48.173Z",
    rating: 4,
    duration: "2.5 Hours",
    genres: genreID,
  });

  await supertest(app)
    .get("/movie")
    .expect(200)
    .then((response) => {
      expect(response.body[0].name).toBe(movie.name);
      expect(response.body[0].description).toBe(movie.description);
      expect(response.body[0].rating).toBe(movie.rating);
      expect(response.body[0].duration).toBe(movie.duration);
      expect(Array.isArray(response.body[0].genres)).toBeTruthy();
    });
});
