
import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

// GET now-playing movies from TMDB
export const getNowPlayingMovie = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`
        }
      }
    );
    res.json({ success: true, movies: data.results || [] });
  } catch (error) {
    console.error("TMDB Fetch Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADD new show(s) to DB
export const addShow = async (req, res) => {
  try {
    const { movieId, showPrice, showsInput } = req.body;

    if (!movieId || typeof showPrice !== "number" || !Array.isArray(showsInput)) {
      return res.status(400).json({ success: false, message: "Invalid input format." });
    }

    // Check if movie already exists in DB
    let movie = await Movie.findOne({ tmdbId: movieId });

    if (!movie) {
      // Fetch movie and cast from TMDB
      const [movieRes, creditsRes] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
        }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
        })
      ]);

      const m = movieRes.data;
      const c = creditsRes.data;

      // Save movie to DB
      movie = await Movie.create({
        tmdbId: movieId,
        title: m.title,
        overview: m.overview,
        poster_path: m.poster_path,
        backdrop_path: m.backdrop_path,
        genres: m.genres,
        casts: c.cast,
        release_date: m.release_date,
        original_language: m.original_language,
        tagline: m.tagline || "",
        vote_average: m.vote_average,
        runtime: m.runtime
      });
    }

    // Validate and prepare show objects
    const showsToCreate = showsInput.map(({ date, time }) => {
      if (!date || !time) return null;
      const dt = new Date(`${date}T${time}`);
      if (isNaN(dt)) return null;
      return {
        movie: movie._id,
        showDateTime: dt,
        showPrice,
        occupiedSeats: {}
      };
    }).filter(Boolean); // Remove nulls

    if (!showsToCreate.length) {
      return res.status(400).json({ success: false, message: "No valid shows provided." });
    }

    await Show.insertMany(showsToCreate);

    res.status(201).json({ success: true, message: "Shows added successfully." });
  } catch (error) {
    console.error("Add Show Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET all upcoming shows (unique movies only)
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });

    // Filter only shows with valid movie ref
    const validShows = shows.filter(s => s.movie && s.movie._id);

    // Map unique movie._id => movie
    const uniqueMovies = Array.from(
      new Map(validShows.map(s => [s.movie._id.toString(), s.movie])).values()
    );

    res.json({ success: true, shows: uniqueMovies });
  } catch (error) {
    console.error("Get Shows Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET showtimes for specific movie
export const getShow = async (req, res) => {
  try {
    const movieId = req.params.movieId;

    const movieDoc = await Movie.findOne({ tmdbId: movieId });
    if (!movieDoc) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    const shows = await Show.find({
      movie: movieDoc._id,
      showDateTime: { $gte: new Date() }
    }).populate("movie");

    const dateTime = {};
    shows.forEach(s => {
      const date = s.showDateTime.toISOString().split("T")[0];
      const time = s.showDateTime.toISOString().split("T")[1].substring(0, 5);
      if (!dateTime[date]) dateTime[date] = [];
      dateTime[date].push({ time, showId: s._id });
    });

    res.json({ success: true, movie: movieDoc, dateTime });
  } catch (error) {
    console.error("Get Show Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
