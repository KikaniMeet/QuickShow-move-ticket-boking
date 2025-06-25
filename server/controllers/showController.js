import axios from "axios";

export const getNowPlayingMovie = async (req, res) => {
  try {
    const { data } = await axios.get("https://api.themoviedb.org/3/movie/now_playing", {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    });
    res.json({ success: true, movies: data.results });
  } catch (error) {
    console.error("TMDB Fetch Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
