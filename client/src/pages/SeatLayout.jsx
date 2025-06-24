import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dummyShowsData, dummyDateTimeData, assets } from '../assets/assets';
import Loading from '../components/Loading';
import { ClockIcon, ArrowRightIcon } from 'lucide-react';
import BlurCircle from '../components/BlurCircle';

const SeatLayout = () => {
  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]];
  const { id, date: urlDate } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const navigate = useNavigate();

  // Format date to match dummy data keys (YYYY-MM-DD)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const dateObj = new Date(dateString);
      if (isNaN(dateObj)) return dateString; // Return original if invalid
      return dateObj.toISOString().split('T')[0];
    } catch (e) {
      return dateString;
    }
  };

  const formattedDate = formatDate(urlDate);

  const toast = (message) => {
    alert(message);
  };

  const getShow = async () => {
    const foundShow = dummyShowsData.find(show => show._id === id);
    if (foundShow) {
      setShow({
        movie: foundShow,
        dateTime: dummyDateTimeData
      });
    }
  };

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      toast("Please select a time first");
      return;
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      toast("You can only select up to 5 seats");
      return;
    }

    setSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(seat => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const handleProceed = () => {
    if (!selectedTime) {
      toast("Please select a time");
      return;
    }
    if (selectedSeats.length === 0) {
      toast("Please select at least one seat");
      return;
    }

    navigate(`/checkout/${id}`, {
      state: {
        date: formattedDate,
        time: selectedTime,
        seats: selectedSeats
      }
    });
  };

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`
                h-8 w-8 rounded border border-red-500/60 cursor-pointer 
                ${selectedSeats.includes(seatId) ? "bg-red-500 text-white" : ""}
              `}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );

  useEffect(() => {
    getShow();
  }, [id]);

  if (!show) {
    return <Loading />;
  }

  return (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-10 md:pt-20'>
      {/* Available Timings Section */}
      <div className='w-60 bg-red-500/10 border border-red-500/20 rounded-lg py-10 h-max md:sticky md:top-30'>
        <p className='text-lg font-semibold px-6'>Available Timings</p>
        <div className='mt-5 space-y-1'>
          {formattedDate && show.dateTime[formattedDate] && show.dateTime[formattedDate].length > 0 ? (
            show.dateTime[formattedDate].map((item) => (
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
                <p className='text-sm'>
                  {new Date(item.time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))
          ) : (
            <p className='text-sm px-6 text-gray-500'>
              {formattedDate ? 'No timings for this date' : 'Select a date to see available times'}
            </p>
          )}
        </div>
      </div>

      {/* Seat Selection Section */}
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
            onClick={handleProceed}
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