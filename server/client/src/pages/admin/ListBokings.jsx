import React, { useEffect, useState } from 'react';
import Title from '../../components/admin/Title';
import Loading from '../../components/Loading';
import { useAppContext } from '../../context/AppContext';

const ListBookings = () => {
    const currency = import.meta.env.VITE_CURRENCY || "₹";
    const { axios, getToken, user } = useAppContext();

    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getAllBookings = async () => {
        try {
            const { data } = await axios.get('/api/admin/all-bookings', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (data.success && Array.isArray(data.bookings)) {
                setBookings(data.bookings);
            } else {
                console.warn("Invalid bookings data:", data);
                setBookings([]);
            }
        } catch (error) {
            console.error("Booking fetch error:", error);
            setBookings([]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (user) {
            getAllBookings();
        }
    }, [user]);

    if (isLoading) return <Loading />;

    return (
        <>
            <Title text1="List" text2="Bookings" />
            <div className="max-w-4xl mt-6 overflow-x-auto">
                <table className="w-full border-collapse rounded-md overflow-hidden whitespace-nowrap">
                    <thead>
                        <tr className="bg-red-500/20 text-left text-white">
                            <th className="p-2 font-medium pl-5">User Name</th>
                            <th className="p-2 font-medium">Movie Name</th>
                            <th className="p-2 font-medium">Show Time</th>
                            <th className="p-2 font-medium">Seats</th>
                            <th className="p-2 font-medium">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(bookings) && bookings.length > 0 ? (
                            bookings.map((booking, index) => (
                                <tr key={index} className="even:bg-red-400/20 odd:bg-red-400/20">
                                    <td className="p-2 pl-5">{booking.user?.name || 'N/A'}</td>
                                    <td className="p-2">{booking.show?.movie?.title || 'N/A'}</td>
                                    <td className="p-2">
                                        {booking.show?.showDateTime
                                            ? new Date(booking.show.showDateTime).toLocaleString()
                                            : 'N/A'}
                                    </td>
                                    <td className="p-2">
                                        {Array.isArray(booking.bookedSeats)
                                            ? booking.bookedSeats.join(', ')
                                            : 'N/A'}
                                    </td>
                                    <td className="p-2">
                                        {currency} {booking.amount || 0}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="p-2" colSpan="5">No bookings found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ListBookings;
