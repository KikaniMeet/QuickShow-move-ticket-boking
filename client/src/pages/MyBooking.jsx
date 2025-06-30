import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const { axios, getToken, user, image_base_url } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyBookings = async () => {
    try {
      const { data } = await axios.get("/api/user/bookings", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getMyBookings();
    }
  }, [user]);

  if (isLoading) return <Loading />;

  return (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />
      <BlurCircle bottom="0px" left="600px" />

      <h1 className="text-lg font-semibold mb-4">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-400">No bookings found.</p>
      ) : (
        bookings.map((item, index) => {
          const time = new Date(item.show.showDateTime);
          const formattedTime = time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          const formattedDate = time.toLocaleDateString();

          return (
            <div
              key={index}
              className="flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl"
            >
              <div className="flex flex-col md:flex-row">
                <img
                  src={image_base_url + item.show.movie.poster_path}
                  alt={item.show.movie.title}
                  className="md:max-w-45 aspect-video h-auto object-cover object-bottom rounded"
                />
                <div className="flex flex-col p-4">
                  <p className="text-lg font-semibold">{item.show.movie.title}</p>
                  <p className="text-gray-400 text-sm">
                    {formattedDate} at {formattedTime}
                  </p>
                  <p className="text-gray-400 text-sm mt-auto">
                    Booked Seats: {item.bookingSeats?.join(", ") || "None"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Amount: {currency} {item.amount?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:items-end md:text-right justify-between p-4">
                <div className="flex items-center gap-4">
                  <p className="text-2xl font-semibold md-3">
                    {currency}{item.amount?.toFixed(2)}
                  </p>
                  {!item.isPaid && (
                    <button className="bg-red-500 px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer">
                      Pay Now
                    </button>
                  )}
                </div>
                <div className="text-sm">
                  <p>
                    <span className="text-gray-400">Total Tickets: </span>
                    {item.bookingSeats?.length || 0}
                  </p>
                  <p>
                    <span className="text-gray-400">Seat Number: </span>
                    {item.bookingSeats?.join(", ") || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyBookings;