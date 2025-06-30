import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { useAppContext } from "../../context/AppContext";

const ListShows = () => {
    const currency = import.meta.env.VITE_CURRENCY || "₹";
    const { axios, getToken, user } = useAppContext();

    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAllShows = async () => {
        try {
            const { data } = await axios.get('/api/admin/all-shows', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (data.success && Array.isArray(data.shows)) {
                setShows(data.shows); // ✅ fix: use correct key
            } else {
                setShows([]);
                console.warn("Unexpected response format:", data);
            }

        } catch (error) {
            console.error("Error fetching shows:", error);
            setShows([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            getAllShows();
        }
    }, [user]);

    if (loading) return <Loading />;

    return (
        <>
            <Title text1="List" text2="Shows" />
            <div className="max-w-4xl mt-6 overflow-x-auto">
                <table className="w-full border-collapse rounded-md overflow-hidden whitespace-nowrap">
                    <thead>
                        <tr className="bg-red-500/20 text-left text-white">
                            <th className="p-2 font-medium pl-5">Movie Name</th>
                            <th className="p-2 font-medium">Show Time</th>
                            <th className="p-2 font-medium">Total Bookings</th>
                            <th className="p-2 font-medium">Earnings</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(shows) && shows.length > 0 ? (
                            shows.map((show, index) => (
                                <tr key={index} className="even:bg-red-400/10 odd:bg-red-300/12">
                                    <td className="p-2 pl-5 font-medium">{show.movie?.title || 'N/A'}</td>
                                    <td className="p-2">{new Date(show.showDateTime).toLocaleString()}</td>
                                    <td className="p-2">{Object.keys(show.occupiedSeats || {}).length}</td>
                                    <td className="p-2">
                                        {currency} {(Object.keys(show.occupiedSeats || {}).length) * (show.showPrice || 0)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-2 text-center">No shows found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ListShows;
