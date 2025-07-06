import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import BlurCircle from "../components/BlurCircle";
import DateSelect from "../components/DateSelect";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import { StarIcon, Heart, PlayCircleIcon } from "lucide-react";
import timeFormat from "../lib/timeFormat";

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    shows,
    axios,
    getToken,
    user,
    fetchFavoriteMovies,
    favoriteMovies,
    image_base_url,
  } = useAppContext();

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) {
        setShow(data);
      } else {
        toast.error("Show not found");
        navigate("/movies");
      }
    } catch (error) {
      console.error("Error fetching show:", error);
      toast.error("Something went wrong. Show not found.");
      navigate("/movies");
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {

    try {
      if (!user) return toast.error("Please login to proceed");

      const { data } = await axios.post(
        "/api/user/update-favorite",
        { movieId: id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        await fetchFavoriteMovies();
        toast.success(data.message);
      }
    } catch (error) {
      console.log("Favorite error:", error);
      toast.error("Error adding to favorites");
    }
  };

  useEffect(() => {
    getShow();
  }, [id]);

  if (loading) return <Loading />;

  return show ? (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto relative">
        <img
          src={image_base_url + show.movie.poster_path}
          alt="Poster"
          className="mx-auto md:mx-0 rounded-xl h-[400px] w-[260px] object-cover"
        />
        <div className="relative flex flex-col gap-3 z-10">
          <BlurCircle top="-100px" left="-100px" className="pointer-events-none" />
          <p className="text-primary uppercase text-sm">{show.movie.original_language}</p>
          <h1 className="text-4xl font-semibold max-w-96">{show.movie.title}</h1>
          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {show.movie.vote_average.toFixed(1)} User Rating
          </div>
          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
            {show.movie.overview}
          </p>
          <p className="text-sm text-gray-300">
            {timeFormat(show.movie.runtime)} • {show.movie.genres.map((g) => g.name).join(", ")} •{" "}
            {show.movie.release_date.split("-")[0]}
          </p>
          <div className="flex items-center flex-wrap gap-4 mt-4">
            <button className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95">
              <PlayCircleIcon className="w-5 h-5" />
              Watch Trailer
            </button>
            <a
              href="#dateSelect"
              className="px-10 py-3 text-sm bg-red-500 hover:bg-red-400 transition rounded-md font-medium cursor-pointer active:scale-95"
            >
              Buy Tickets
            </a>
            <button
              onClick={handleFavorite}
              className="z-10 bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95"
            >
              <Heart
                className={`w-5 h-5 ${
                  favoriteMovies.find((m) => String(m.tmdbId) === String(id))
                    ? "fill-red-500 text-red-500"
                    : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <p className="mt-20 text-lg font-semibold">Your Favorite Cast</p>
      <div className="overflow-x-auto no-scrollbar mt-10 p-4">
        <div className="flex items-center gap-4 w-max">
          {show.movie.casts.slice(0, 12).map((cast, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <img
                src={
                  cast.profile_path
                    ? `https://image.tmdb.org/t/p/w200${cast.profile_path}`
                    : "/fallback-avatar.png"
                }
                alt={cast.name}
                className="rounded-full h-20 w-20 object-cover"
              />
              <p className="font-medium text-xs mt-3">{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      <DateSelect dateTime={show.dateTime} id={id} />

      <p className="text-lg font-medium mt-20 mb-8">You May Also Like</p>
      <div>
        <div className="flex flex-wrap max-sm:justify-center gap-8">
          {shows.slice(0, 4).map((movie, index) => (
            <MovieCard key={index} movie={movie} />
          ))}
        </div>
        <div className="flex justify-center mt-20">
          <button
            onClick={() => {
              navigate("/movies");
              scrollTo(0, 0);
            }}
            className="px-10 py-3 text-sm bg-red-500 hover:bg-red-600 transition rounded-md font-medium cursor-pointer"
          >
            Show more
          </button>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MovieDetails;