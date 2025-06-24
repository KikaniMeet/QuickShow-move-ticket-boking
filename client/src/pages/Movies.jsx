import React from "react";
import { dummyShowsData } from '../assets/assets';
import MovieCard from "../components/MovieCard";
import BlurCircl from "../components/BlurCircle";

const Movies = () => {
    return dummyShowsData.length > 0 ? (
        <div className='relative my-40 mb-60 px-6 md:px-16 1g:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
            <BlurCircl top="150px" left="0px" />
            <BlurCircl bottom="50px" right="50px" />
            <h1 className='text-1g fønt-medium my-4'>Now Showing</h1>
            <div className='flex flex-wrap max-sm:justify-center gap-8'>
                {dummyShowsData.map((movie) => (
                    <MovieCard movie={movie} key={movie._id} />
                ))}
            </div>
        </div >
    ) : (
        <div>
            <div className='flex flex-col items-center justify-center h-screen'>
                <h1 className='text-3x1 font-bold text-center'>No movies available</h1>
            </div>
        </div>
    )
}
export default Movies;