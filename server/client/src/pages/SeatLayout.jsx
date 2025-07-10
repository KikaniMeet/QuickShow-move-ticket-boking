import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import Loading from '../components/Loading';
import { ClockIcon, ArrowRightIcon } from 'lucide-react';
import BlurCircle from '../components/BlurCircle';
import { useAppContext } from '../context/AppContext';

const SeatLayout = () => {
  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]];
  const { id, date: urlDate } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [validDate, setValidDate] = useState(null);

  const navigate = useNavigate();
  const { axios, getToken, user } = useAppContext();

  const toast = {
    success: (msg) => alert("✅ " + msg),
    error: (msg) => alert("❌ " + msg),
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const dateObj = new Date(dateString);
      if (isNaN(dateObj)) return dateString;
      return dateObj.toISOString().split('T')[0];
    } catch {
      return dateString;
    }
  };

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) {
        setShow(data);
      } else {
        toast.error(data.message || 'Failed to load show.');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error fetching show data.');
    }
  };

  const getOccupiedSeats = async () => {
    if (!selectedTime?.showId) return;

    try {
      const { data } = await axios.get(`/api/booking/seats/${selectedTime.showId}`);
      console.log("Getting seats for showId:", selectedTime?.showId);

      if (data.success) {
        setOccupiedSeats(data.occupiedSeats);
      } else {
        toast.error(data.message || 'Could not fetch booked seats.');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error fetching occupied seats.');
    }
  };

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      toast.error("Please select a time first");
      return;
    }
    if (occupiedSeats.includes(seatId)) {
      toast.error('This seat is already booked');
      return;
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      toast.error("You can only select up to 5 seats");
      return;
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const bookTickets = async () => {
    try {
      if (!user) return toast.error('Please login to proceed');

      if (!selectedTime?.showId || selectedSeats.length === 0) {
        return toast.error('Please select a time and seats');
      }

      const { data } = await axios.post(
        '/api/booking/create',
        { showId: selectedTime.showId, selectedSeats },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong during booking');
    }
  };

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          const isSelected = selectedSeats.includes(seatId);
          const isOccupied = occupiedSeats.includes(seatId);

          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              disabled={isOccupied}
              className={`h-8 w-8 rounded border border-red-500/60 cursor-pointer 
                ${isSelected ? "bg-red-500 text-white" : ""}
                ${isOccupied ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );

  // Load show data
  useEffect(() => {
    getShow();
  }, [id]);

  // Handle valid dates after show loads
  useEffect(() => {
    if (show?.dateTime) {
      const availableDates = Object.keys(show.dateTime);
      const formatted = formatDate(urlDate);
      if (availableDates.includes(formatted)) {
        setValidDate(formatted);
      } else {
        const firstValid = availableDates[0];
        setValidDate(firstValid);
        navigate(`/seats/${id}/${firstValid}`, { replace: true });
      }
    }
  }, [show, urlDate, id, navigate]);

  // Load booked seats when time selected
  useEffect(() => {
    if (selectedTime) {
      getOccupiedSeats();
    }
  }, [selectedTime]);

  if (!show || !validDate) return <Loading />;

  return (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-10 md:pt-20'>
      {/* Timings Section */}
      <div className='w-60 bg-red-500/10 border border-red-500/20 rounded-lg py-10 h-max md:sticky md:top-30'>
        <p className='text-lg font-semibold px-6'>Available Timings</p>
        <div className='mt-5 space-y-1'>
          {show.dateTime[validDate]?.length > 0 ? (
            show.dateTime[validDate].map((item) => (
              <div
                key={item.time}
                onClick={() => setSelectedTime(item)}
                className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${
                  selectedTime?.time === item.time
                    ? 'bg-red-500 text-white'
                    : 'hover:bg-red-500/20'
                }`}
              >
                <ClockIcon className="w-4 h-4" />
                <p className='text-sm'>{item.time}</p>
              </div>
            ))
          ) : (
            <p className='text-sm px-6 text-gray-500'>
              No timings for this date
            </p>
          )}
        </div>
      </div>

      {/* Seats Section */}
      <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0" right="0" />

        <h1 className='text-2xl font-semibold mb-4'>Select your seats</h1>
        <img src={assets.screenImage} alt="screen" className="mb-2 w-full max-w-md" />
        <p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p>

        <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
          <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
            {groupRows[0].map(row => renderSeats(row))}
          </div>
        </div>

        <div className='grid grid-cols-2 gap-11'>
          {groupRows.slice(1).map((group, idx) => (
            <div key={idx} className="flex flex-col gap-8">
              {group.map(row => renderSeats(row))}
            </div>
          ))}
        </div>

        {/* Proceed Button */}
        <div className="mt-10 w-full max-w-md">
          <button
            onClick={bookTickets}
            disabled={!selectedTime || selectedSeats.length === 0}
            className="w-full py-3 bg-red-500 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Checkout
            <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;
