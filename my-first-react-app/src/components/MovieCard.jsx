import React from "react";
import { getMovieTitle } from "../utils/italianContent.js";

const MovieCard = ({
  movie: {
    title,
    original_title,
    vote_average,
    poster_path,
    release_date,
    original_language,
  },
  onClick,
}) => {
  return (
    <div
      className="bg-dark-100 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl shadow-inner shadow-light-100/10 cursor-pointer hover:bg-dark-100/80 transition-all duration-200 hover:scale-105"
      onClick={onClick}
    >
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "/no-movie.png"
        }
        alt={getMovieTitle({ title, original_title })}
        className="rounded-lg h-auto w-full"
      />
      <div className="mt-2 sm:mt-3 lg:mt-4">
        <h3 className="text-white font-bold text-xs sm:text-sm lg:text-base line-clamp-1">
          {getMovieTitle({ title, original_title })}
        </h3>

        <div className="mt-1 sm:mt-2 flex flex-row items-center flex-wrap gap-1 sm:gap-2">
          <div className="flex flex-row items-center gap-1">
            <img
              src="./star.svg"
              alt="star"
              className="size-3 sm:size-4 object-contain"
            />
            <p className="font-bold text-xs sm:text-sm lg:text-base text-white">
              {vote_average ? vote_average.toFixed(1) : "N/A"}
            </p>
          </div>
          <span className="text-xs sm:text-sm">•</span>
          <p className="capitalize text-gray-100 font-medium text-xs sm:text-sm lg:text-base">
            {original_language}
          </p>
          <span className="text-xs sm:text-sm">•</span>
          <p className="text-gray-100 font-medium text-xs sm:text-sm lg:text-base">
            {release_date ? release_date.split("-")[0] : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
