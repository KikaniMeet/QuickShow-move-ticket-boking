import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { StarIcon, CheckIcon, Trash2Icon } from 'lucide-react';
import { kConverter } from '../../lib/kConverter';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddShows = () => {
    const { axios, getToken, image_base_url } = useAppContext();

    const currency = import.meta.env.VITE_CURRENCY || '₹';
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [dateTimeSelection, setDateTimeSelection] = useState({});
    const [dateTimeInput, setDateTimeInput] = useState('');
    const [showPrice, setShowPrice] = useState('');
    const [addingShow, setAddingShow] = useState(false);
    const [loadingMovies, setLoadingMovies] = useState(true);

    const fetchNowPlayingMovies = async () => {
        try {
            const { data } = await axios.get('/api/show/now-playing', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (data.success) {
                setNowPlayingMovies(data.movies);
            }
        } catch (error) {
            console.error('Error fetching movies:', error.response?.data || error.message);
            toast.error('Failed to load movies');
        } finally {
            setLoadingMovies(false);
        }
    };

    const handleDateTimeAdd = () => {
        if (!dateTimeInput) return;
        
        const [date, time] = dateTimeInput.split('T');
        if (!date || !time) return;

        setDateTimeSelection(prev => {
            const times = prev[date] || [];
            if (!times.includes(time)) {
                return { ...prev, [date]: [...times, time] };
            }
            return prev;
        });

        setDateTimeInput('');
    };

    const handleRemoveTime = (date, time) => {
        setDateTimeSelection(prev => {
            const filteredTimes = prev[date].filter(t => t !== time);
            if (filteredTimes.length === 0) {
                const { [date]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [date]: filteredTimes };
        });
    };

    const handleSubmit = async () => {
        if (!selectedMovie || Object.keys(dateTimeSelection).length === 0 || !showPrice) {
            toast.error('Please select a movie, add show times, and set a price');
            return;
        }

        try {
            setAddingShow(true);
            
            // Flatten the date-time selection into array of show objects
            const showsInput = Object.entries(dateTimeSelection).flatMap(
                ([date, times]) => times.map(time => ({ date, time }))
            );

            const payload = {
                movieId: selectedMovie,
                showsInput,
                showPrice: Number(showPrice)
            };

            const { data } = await axios.post('/api/show/add', payload, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (data.success) {
                toast.success(data.message);
                setSelectedMovie(null);
                setDateTimeSelection({});
                setShowPrice('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(error.response?.data?.message || "An error occurred. Please try again.");
        } finally {
            setAddingShow(false);
        }
    };

    useEffect(() => {
        fetchNowPlayingMovies();
    }, []);

    if (loadingMovies) return <Loading />;

    return (
        <>
            <Title text1="Add" text2="Shows" />
            
            <p className="mt-10 text-lg font-medium">Now Playing Movies</p>
            <div className="overflow-x-auto pb-4">
                {nowPlayingMovies.length === 0 ? (
                    <div className="mt-6 text-center py-10 bg-gray-800/50 rounded-lg">
                        <p className="text-gray-400">No movies currently playing</p>
                    </div>
                ) : (
                    <div className="group flex flex-wrap gap-4 mt-4 w-max">
                        {nowPlayingMovies.map(movie => (
                            <div
                                key={movie.id}
                                onClick={() => setSelectedMovie(movie.id)}
                                className={`relative max-w-40 cursor-pointer transition-all duration-300 ${
                                    selectedMovie === movie.id 
                                        ? "ring-2 ring-red-500 scale-[1.02]" 
                                        : "opacity-90 hover:opacity-100 group-hover:opacity-70"
                                } group-hover:hover:opacity-100 group-hover:hover:scale-[1.02]`}
                            >
                                <div className="relative rounded-lg overflow-hidden">
                                    <img
                                        src={image_base_url + movie.poster_path}
                                        alt={movie.title}
                                        className="w-full h-60 object-cover brightness-90"
                                    />
                                    <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                                        <p className="flex items-center gap-1 text-gray-400">
                                            <StarIcon className="w-4 h-4 text-red-500 fill-red-500" />
                                            {movie.vote_average.toFixed(1)}
                                        </p>
                                        <p className="text-gray-300">{kConverter(movie.vote_count)} Votes</p>
                                    </div>
                                </div>
                                {selectedMovie === movie.id && (
                                    <div className="absolute top-2 right-2 flex items-center justify-center bg-red-500 h-6 w-6 rounded">
                                        <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                                    </div>
                                )}
                                <p className="font-medium truncate mt-1">{movie.title}</p>
                                <p className="text-gray-400 text-sm">{movie.release_date}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Show Price Input */}
            <div className="mt-8">
                <label className="block text-sm font-medium mb-2">Show Price</label>
                <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
                    <p className="text-gray-400 text-sm">{currency}</p>
                    <input
                        min={0}
                        type="number"
                        value={showPrice}
                        onChange={e => setShowPrice(e.target.value)}
                        placeholder="Enter show price"
                        className="outline-none bg-transparent text-white w-32"
                    />
                </div>
            </div>

            {/* DateTime Picker */}
            <div className="mt-6">
                <label className="block text-sm font-medium mb-2">Select Date and Time</label>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="datetime-local"
                        value={dateTimeInput}
                        onChange={e => setDateTimeInput(e.target.value)}
                        className="outline-none bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-md flex-1"
                    />
                    <button
                        onClick={handleDateTimeAdd}
                        className="bg-red-500 text-white px-4 py-2 text-sm rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Add Time
                    </button>
                </div>
            </div>

            {/* Display Selected Date-Times */}
            {Object.keys(dateTimeSelection).length > 0 && (
                <div className="mt-6">
                    <h2 className="mb-2 font-medium text-lg">Selected Show Times</h2>
                    <ul className="space-y-3">
                        {Object.entries(dateTimeSelection).map(([date, times]) => (
                            <li key={date}>
                                <div className="font-medium text-gray-200">{new Date(date).toLocaleDateString()}</div>
                                <div className="flex flex-wrap gap-2 mt-1 text-sm">
                                    {times.map(time => (
                                        <div
                                            key={`${date}-${time}`}
                                            className="border border-red-500/50 bg-red-500/10 px-3 py-1.5 flex items-center rounded"
                                        >
                                            <span>{time}</span>
                                            <Trash2Icon
                                                onClick={() => handleRemoveTime(date, time)}
                                                className="ml-2 w-4 h-4 text-red-400 hover:text-red-300 cursor-pointer transition-colors"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button 
                onClick={handleSubmit}
                disabled={addingShow || !selectedMovie || Object.keys(dateTimeSelection).length === 0 || !showPrice}
                className={`mt-6 px-8 py-2.5 rounded transition-all ${
                    addingShow 
                        ? "bg-gray-600 cursor-not-allowed" 
                        : "bg-red-500 hover:bg-red-600 cursor-pointer"
                }`}
            >
                {addingShow ? "Adding..." : "Add Show"}
            </button>
        </>
    );
};

export default AddShows;