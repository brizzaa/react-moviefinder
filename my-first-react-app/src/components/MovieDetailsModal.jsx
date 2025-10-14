import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

const MovieDetailsModal = ({ movie, isOpen, onClose }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_TMBD_API_KEY;

  useEffect(() => {
    if (isOpen && movie) {
      fetchMovieDetails();
    }
  }, [isOpen, movie]);

  const fetchMovieDetails = async () => {
    if (!movie?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}?append_to_response=credits,videos`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }

      const data = await response.json();
      setMovieDetails(data);
    } catch (err) {
      console.error("Error fetching movie details:", err);
      setError("Errore nel caricamento dei dettagli del film");
    } finally {
      setIsLoading(false);
    }
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (!movie) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-dark-100 text-left align-middle shadow-xl transition-all">
                {isLoading ? (
                  <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AB8BFF]"></div>
                  </div>
                ) : error ? (
                  <div className="p-8 text-center">
                    <p className="text-red-400">{error}</p>
                  </div>
                ) : (
                  <div className="relative">
                    <button
                      onClick={onClose}
                      className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                    >
                      ✕
                    </button>

                    <div className="relative h-96 overflow-hidden">
                      <img
                        src={
                          movieDetails?.backdrop_path
                            ? `https://image.tmdb.org/t/p/w1280${movieDetails.backdrop_path}`
                            : movie.poster_path
                            ? `https://image.tmdb.org/t/p/w1280${movie.poster_path}`
                            : "/no-movie.png"
                        }
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-dark-100/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h1 className="text-4xl font-bold text-white mb-2">
                          {movie.title}
                        </h1>
                        <div className="flex items-center gap-4 text-gray-300">
                          <span>{movie.release_date?.split("-")[0]}</span>
                          <span>•</span>
                          <span>{formatRuntime(movieDetails?.runtime)}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <img
                              src="./star.svg"
                              alt="star"
                              className="w-4 h-4"
                            />
                            <span>{movie.vote_average?.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                          <img
                            src={
                              movie.poster_path
                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                : "/no-movie.png"
                            }
                            alt={movie.title}
                            className="w-full rounded-lg shadow-lg"
                          />
                        </div>

                        {/* Details */}
                        <div className="lg:col-span-2 space-y-6">
                          {/* Overview */}
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-3">
                              Trama
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                              {movieDetails?.overview ||
                                movie.overview ||
                                "Trama non disponibile"}
                            </p>
                          </div>

                          {movieDetails?.genres?.length > 0 && (
                            <div>
                              <h3 className="text-xl font-semibold text-white mb-3">
                                Generi
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {movieDetails.genres.map((genre) => (
                                  <span
                                    key={genre.id}
                                    className="px-3 py-1 bg-[#AB8BFF]/20 text-[#AB8BFF] rounded-full text-sm"
                                  >
                                    {genre.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {movieDetails?.credits?.cast?.length > 0 && (
                            <div>
                              <h3 className="text-xl font-semibold text-white mb-3">
                                Cast Principale
                              </h3>
                              <div className="grid grid-cols-2 gap-2">
                                {movieDetails.credits.cast
                                  .slice(0, 6)
                                  .map((actor) => (
                                    <div
                                      key={actor.id}
                                      className="text-gray-300"
                                    >
                                      <span className="font-medium">
                                        {actor.name}
                                      </span>
                                      <span className="text-gray-400">
                                        {" "}
                                        as {actor.character}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {movieDetails?.budget > 0 && (
                              <div>
                                <h4 className="font-semibold text-white mb-1">
                                  Budget
                                </h4>
                                <p className="text-gray-300">
                                  {formatCurrency(movieDetails.budget)}
                                </p>
                              </div>
                            )}
                            {movieDetails?.revenue > 0 && (
                              <div>
                                <h4 className="font-semibold text-white mb-1">
                                  Incassi
                                </h4>
                                <p className="text-gray-300">
                                  {formatCurrency(movieDetails.revenue)}
                                </p>
                              </div>
                            )}
                            {movieDetails?.production_countries?.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-white mb-1">
                                  Paese
                                </h4>
                                <p className="text-gray-300">
                                  {movieDetails.production_countries[0].name}
                                </p>
                              </div>
                            )}
                            {movieDetails?.spoken_languages?.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-white mb-1">
                                  Lingua
                                </h4>
                                <p className="text-gray-300">
                                  {movieDetails.spoken_languages[0].name}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default MovieDetailsModal;
