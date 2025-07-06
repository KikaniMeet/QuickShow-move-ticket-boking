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

    // Check if movie exists
    let movie = await Movie.findOne({ tmdbId: movieId });

    // Fetch movie details and cast if not in DB
    if (!movie) {
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

    // Prepare and validate show entries
    const showsToCreate = showsInput
      .map(({ date, time }) => {
        if (!date || !time) return null;
        const dt = new Date(`${date}T${time}`);
        if (isNaN(dt)) return null;

        return {
          movie: movie._id,
          showDateTime: dt,
          showPrice,
          occupiedSeats: {}
        };
      })
      .filter(Boolean);

    if (!showsToCreate.length) {
      return res.status(400).json({ success: false, message: "No valid shows provided." });
    }

    const insertedShows = await Show.insertMany(showsToCreate);

    res.status(201).json({
      success: true,
      message: "Shows added successfully.",
      shows: insertedShows
    });
  } catch (error) {
    console.error("Add Show Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET all upcoming shows (grouped by unique movies)
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });

    const validShows = shows.filter(s => s.movie && s.movie._id);

    // Unique movies using Map
    const uniqueMovies = Array.from(
      new Map(validShows.map(s => [s.movie._id.toString(), s.movie])).values()
    );

    res.json({ success: true, shows: uniqueMovies });
  } catch (error) {
    console.error("Get Shows Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET all showtimes for a specific movie
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
    shows.forEach(show => {
      const isoDate = show.showDateTime.toISOString();
      const date = isoDate.split("T")[0];
      const time = isoDate.split("T")[1].substring(0, 5); // HH:MM

      if (!dateTime[date]) dateTime[date] = [];
      dateTime[date].push({ time, showId: show._id });
    });

    // Optional: sort times per date
    Object.keys(dateTime).forEach(date => {
      dateTime[date].sort((a, b) => a.time.localeCompare(b.time));
    });

    res.json({ success: true, movie: movieDoc, dateTime });
  } catch (error) {
    console.error("Get Show Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
