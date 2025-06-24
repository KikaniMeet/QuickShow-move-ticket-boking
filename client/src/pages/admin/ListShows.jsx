import React, { useEffect, useState } from "react";
import { dummyShowsData } from "../../assets/assets";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title"; // ✅ Make sure this file exists

const ListShows = () => {
    const currency = import.meta.env.VITE_CURRENCY || "₹";

    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAllShows = async () => {
        try {
            // Simulate an API call
            setShows([{
                movie: dummyShowsData[0],
                showDateTime: "2025-06-30T02:30:00.000Z",
                showPrice: 59,
                occupiedSeats: {
                    A1: "user_1",
                    B1: "user_2",
                    C1: "user_3"
                }
            }]);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching shows:", error);
        }
    };

    useEffect(() => {
        getAllShows();
    }, []);

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
                        {shows.map((show, index) => (
                            <tr key={index} className="even:bg-gray-100 odd:bg-red-300/12">
                                <td className="p-2 pl-5 font-medium">{show.movie.title}</td>
                                <td className="p-2">{new Date(show.showDateTime).toLocaleString()}</td>
                                <td className="p-2">{Object.keys(show.occupiedSeats).length}</td>
                                <td className="p-2">
                                    {currency} {Object.keys(show.occupiedSeats).length * show.showPrice}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ListShows;
