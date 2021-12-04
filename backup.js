// const { request } = require("express");
// const express = require("express");
import dotenv from "dotenv";
import express from "express";
import { MongoClient } from "mongodb";
import {
  getMovie,
  getMovieById,
  deleteMovieById,
  insertMovie,
  updateMovieById,
} from "./getMovie.js";

dotenv.config();

const app = express();

const PORT = 9000;
//Process.env

// console.log(process.env);
// const MONGO_URL = process.env.MONGO_URL;

const MONGO_URL =
  "mongodb+srv://sangeetha:sangeetha19051997@cluster0.uspim.mongodb.net";

// // ============== mongo db ===========
// const MONGO_URL = "mongodb://localhost";

//one stop solution -to parse all the request as json()

app.use(express.json()); // this will parse body to JSON

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("MongoDB connected");
  //db.movies.find()//all
  //db.movies.findOne({id:103})//for only one

  return client;
}

//=========================================================
// app.get("/", (request, response) => {
//   response.send("Hello , !!!");
// });

// app.get("/movies", (request, response) => {
//   response.send(movies);
// });

// filtering by only languages
// app.get("/movies", (request, response) => {
//   console.log(request.query);
//   const { language } = request.query;
//   if (language) {
//     response.send(movies.filter((mv) => mv.language === language));
//   } else {
//     response.send(movies);
//   }
// });
// filtering by language and rating
// app.get("/movies", (request, response) => {
//   console.log(request.query);
//   const { language, rating } = request.query;
//   let filterMovies = movies;

//   if (language) {
//     filterMovies = filterMovies.filter((mv) => mv.language === language);
//   }
//   if (rating) {
//     filterMovies = filterMovies.filter((mv) => mv.rating === rating);
//   }
//   response.send(filterMovies);
// });
// =================================================

// filtering by language and rating
app.get("/movies", async (request, response) => {
  console.log("Query", request.query);
  const filter = request.query;
  const client = await createConnection();
  const filterMovies = await getMovie(client, filter);
  console.log(filter);
  response.send(filterMovies);
});

//=======================filter method===================
app.get("/movies/:id", async (request, response) => {
  console.log(request.params);
  const { id } = request.params;
  const client = await createConnection();
  const movie = await getMovieById(client, id);
  const notFound = { message: "No matching movies" };
  console.log(movie);
  movie ? response.send(movie) : response.status(404).send(notFound);
});
//==============================================================================================

//=======================Delete method===================
app.delete("/movies/:id", async (request, response) => {
  console.log(request.params);
  const { id } = request.params;
  const client = await createConnection();
  const movie = await deleteMovieById(client, id);
  const notFound = { message: "No matching movies" };
  console.log(movie);
  movie ? response.send(movie) : response.status(404).send(notFound);
});
//==============================================================================================

//=======================post method===================
app.post("/movies", async (request, response) => {
  const data = request.body;
  console.log("data", data);
  const client = await createConnection();
  const result = await insertMovie(client, data);
  response.send(result);
});

//=======================updated method =================== //similary to post
app.put("/movies/:id", async (request, response) => {
  const { id } = request.params;
  const data = request.body;
  console.log("data", data);

  const client = await createConnection();
  const result = await updateMovieById(client, id, data);
  response.send(result);
});
//=======================find method===================
// app.get("/movies/:id", (request, response) => {
//   console.log(request.params);
//   const { id } = request.params;
//   const movie = movies.find((mv) => mv.id === id);
//   console.log(movie);
//   response.send(movie);
// });

//=======================find method with error message not Found===================
// app.get("/movies/:id", (request, response) => {
//   console.log(request.params);
//   const { id } = request.params;
//   console.log("data", data);

//   const movie = movies.find((mv) => mv.id === id);
//   const notFound = { message: "No matching movies" };
//   console.log(movie);

//   movie ? response.send(movie) : response.status(404).send(notFound);
//   response.send(movie);
// });

app.listen(PORT, () => console.log("APP is started on", PORT));
// 00000000000000000000000000000000000000000

// =================================================
// import { client } from "./index.js";
import express from "express";
import {
  getMovie,
  getMovieById,
  deleteMovieById,
  insertMovie,
  updateMovieById,
} from "../helper.js";

const router = express.Router();

// router.route("/")
router.get("/", async (request, response) => {
  console.log("Query", request.query);
  const filter = request.query;
  const filterMovies = await getMovie(filter);
  console.log(filter);
  response.send(filterMovies);
});

//=======================filter method===================
router.get("/:id", async (request, response) => {
  console.log(request.params);
  const { id } = request.params;
  const movie = await getMovieById(id);
  const notFound = { message: "No matching movies" };
  console.log(movie);
  movie ? response.send(movie) : response.status(404).send(notFound);
});
//==============================================================================================

//=======================Delete method===================
router.delete("/:id", async (request, response) => {
  console.log(request.params);
  const { id } = request.params;
  const movie = await deleteMovieById(id);
  const notFound = { message: "No matching movies" };
  console.log(movie);
  movie ? response.send(movie) : response.status(404).send(notFound);
});
//==============================================================================================

//=======================post method===================
router.post("/", async (request, response) => {
  const data = request.body;
  console.log("data", data);
  const result = await insertMovie(data);
  response.send(result);
});

//=======================updated method =================== //similary to post
router.put("/:id", async (request, response) => {
  const { id } = request.params;
  const data = request.body;
  console.log("data", data);
  const result = await updateMovieById(id, data);
  response.send(result);
});

export const moviesRouter = router;

// helper backup

export async function getMovie(client, filter) {
  return await client.db("b252we").collection("movies").find(filter).toArray();
}
export async function updateMovieById(client, id, data) {
  return await client
    .db("b252we")
    .collection("movies")
    .updateOne({ id: id }, { $set: data });
}
export async function insertMovie(client, data) {
  return await client.db("b252we").collection("movies").insertMany(data);
}
export async function deleteMovieById(client, id) {
  return await client.db("b252we").collection("movies").deleteOne({ id: id });
}
export async function getMovieById(client, id) {
  return await client.db("b252we").collection("movies").findOne({ id: id });
}