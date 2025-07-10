import { MenuIcon, SearchIcon, XIcon, TicketIcon } from "lucide-react";
import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useUser();
    const { openSignIn } = useClerk();

    const navigate = useNavigate()
    const {favoriteMovies}=useAppContext()

    return (
        <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5 bg-transparent text-white">
            <Link to="/" className="max-md:flex-1">
                <img src={assets.logo} alt="Logo" className="w-36 h-auto" />
            </Link>
            
            {/* Mobile Menu */}
            <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`} >
                <XIcon className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer' onClick={() => setIsOpen(false)} />
                <Link onClick={() => { window.scrollTo(0, 0); setIsOpen(false) }} to="/">Home</Link>
                <Link onClick={() => { window.scrollTo(0, 0); setIsOpen(false) }} to="/movies">Movies</Link>
                <Link onClick={() => { window.scrollTo(0, 0); setIsOpen(false) }} to="/">Theaters</Link>
                <Link onClick={() => { window.scrollTo(0, 0); setIsOpen(false) }} to="/">Releases</Link>
                {favoriteMovies.length > 0 && <Link onClick={() => { window.scrollTo(0, 0); setIsOpen(false) }} to="/Favorite">Favorites</Link>}
                
                {/* My Bookings in Mobile Menu */}
                {user && (
                    <Link 
                        onClick={() => { 
                            window.scrollTo(0, 0); 
                            setIsOpen(false);
                        }} 
                        to="/my-bookings"
                        className="md:hidden flex items-center gap-2"
                    >
                        <TicketIcon className="w-5 h-5" />
                        <span>My Bookings</span>
                    </Link>
                )}
            </div>

            <div className="flex items-center gap-8">
                <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer" />
                {
                    !user ? (
                        <button onClick={openSignIn} className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary/80 transition rounded-full font-medium cursor-pointer">
                            Login
                        </button>
                    ) : (
                        <div className="flex items-center gap-4">
                            {/* Desktop My Bookings - Always visible */}
                            <Link 
                                to="/my-bookings"
                                className="hidden md:flex items-center gap-1 hover:text-primary transition"
                            >
                                <TicketIcon className="w-5 h-5" />
                                <span>My Bookings</span>
                            </Link>
                            
                            {/* Simple User Button */}
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    )
                }
            </div>

            <MenuIcon className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer" onClick={() => setIsOpen(true)} />
        </div>
    );
};

export default Navbar;