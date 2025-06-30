import React from "react";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import SeatLayout from './pages/SeatLayout';
import MyBooking from './pages/MyBooking';
import Favorite from './pages/Favorite';
import { Toaster } from 'react-hot-toast';
import AdminLayout from "./pages/admin/Layout";
import AddShows from "./pages/admin/AddShows";
import Dashboard from "./pages/admin/Dashboard";
import ListBookings from "./pages/admin/ListBokings";
import ListShows from "./pages/admin/ListShows";
import { useAppContext } from "./context/AppContext";
import { SnailIcon } from "lucide-react";

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith('/admin');

  const { user } = useAppContext()

  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movies/:id' element={<MovieDetails />} />
        <Route path='/movies/:id/:date' element={<SeatLayout />} />
        <Route path='/my-bookings' element={<MyBooking />} />
        <Route path='/favorite' element={<Favorite />} />

        {/* Admin Routes */}
        <Route path='/admin/*' element={user? <Layout />:(
          <div className="min-h-screen flex justify-center items-center">
            <SignIn fallbackRedirectUrl={'/admin'}/>
          </div>
        )}>
          <Route index element={<Dashboard />} />
          <Route path="add-shows" element={<AddShows />} />
          <Route path="list-shows" element={<ListShows />} />
          <Route path="list-bookings" element={<ListBookings />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;
