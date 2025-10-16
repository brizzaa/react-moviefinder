import React, { useState, useEffect } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import Filter from "./components/Filter";
import MovieDetailsModal from "./components/MovieDetailsModal";
import { useDebounce } from "react-use";
import { updateSearchCount, getTrendingMovies } from "./appwrite.js";
import { getMovieTitle } from "./utils/italianContent.js";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMBD_API_KEY;

if (!API_KEY || API_KEY === "undefined") {
}

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    genres: [],
    year: "",
    minRating: "",
    language: "",
    sortBy: "popularity.desc",
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    },
    500,
    [searchTerm]
  );

  const buildApiUrl = (query = "", filters = {}, page = 1) => {
    const params = new URLSearchParams();

    params.append("language", "it-IT");

    const hasFilters =
      filters.genres?.length > 0 ||
      filters.year ||
      filters.minRating ||
      filters.language ||
      filters.sortBy !== "popularity.desc";

    if (query && !hasFilters) {
      const baseUrl = `${API_BASE_URL}/search/movie`;
      params.append("query", query);
      params.append("sort_by", "popularity.desc");
      params.append("page", page);
      return `${baseUrl}?${params.toString()}`;
    } else {
      const baseUrl = `${API_BASE_URL}/discover/movie`;

      if (filters.genres && filters.genres.length > 0) {
        params.append("with_genres", filters.genres.join(","));
      }

      if (filters.year) {
        params.append("primary_release_year", filters.year);
      }

      if (filters.minRating) {
        params.append("vote_average.gte", filters.minRating);
      }

      if (filters.language) {
        params.append("with_original_language", filters.language);
      }

      params.append("sort_by", filters.sortBy || "popularity.desc");
      params.append("page", page);

      return `${baseUrl}?${params.toString()}`;
    }
  };

  const fetchMovies = async (query = "", filters = {}, page = 1) => {
    if (!API_KEY || API_KEY === "undefined") {
      setErrorMessage(
        "API key non configurata. Configura VITE_TMBD_API_KEY nelle variabili d'ambiente."
      );
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const hasFilters =
      filters.genres?.length > 0 ||
      filters.year ||
      filters.minRating ||
      filters.language ||
      filters.sortBy !== "popularity.desc";

    if (query && hasFilters) {
      console.warn("NON ANCORA IMPLEMENTATO");
    }
    try {
      const endpoint = buildApiUrl(query, filters, page);

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "API key non valida. Controlla la configurazione di VITE_TMBD_API_KEY."
          );
        }
        throw new Error(`Errore nel recupero dei film (${response.status})`);
      }

      const data = await response.json();

      if (data.Response === "False") {
        setErrorMessage(data.Error || "Errore nel recupero dei film");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
      setTotalPages(Math.min(data.total_pages || 1, 500));
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error("Error loading trending movies:", error);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setActiveFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSidebarToggle = (isOpen) => {
    setSidebarOpen(isOpen);
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setModalOpen(true);

    updateSearchCount(getMovieTitle(movie), movie);
    console.log(movie);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMovie(null);
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm, activeFilters, currentPage);
  }, [debouncedSearchTerm, activeFilters, currentPage]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="bg-hero-pattern w-full h-screen bg-center bg-cover absolute z-0" />
      <div className="flex min-h-screen">
        {!sidebarOpen && (
          <button
            aria-label="Apri filtri"
            className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex items-center gap-2 rounded-r-lg bg-dark-100/80 border border-l-0 border-light-100/20 text-white px-3 py-2 hover:bg-dark-100 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <span>🎬</span>
            <span className="hidden sm:inline">Filtri</span>
          </button>
        )}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Filter
          onFiltersChange={handleFiltersChange}
          isLoading={isLoading}
          onSidebarToggle={handleSidebarToggle}
          sidebarOpen={sidebarOpen}
        />

        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "md:ml-80 ml-0" : "ml-0"
          }`}
        >
          <div className="px-5 py-12 xs:p-10 max-w-7xl mx-auto flex flex-col relative z-10">
            <img src="./hero.png" alt="images of the movies" />
            <header>
              <h1>
                Trova <span className="text-gradient">Film</span> che ti
                piacciono senza impegno!
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 items-center mt-6">
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              </div>
            </header>

            {trendingMovies.length > 0 && (
              <section className="mt-20">
                <h2>Trending Movies</h2>
                <ul
                  className="flex flex-row overflow-y-auto gap-5 -mt-10 w-full [scrollbar-width:none] [-ms-overflow-style:none]
                [&::-webkit-scrollbar]:hidden"
                >
                  {trendingMovies.map((movie, index) => (
                    <li
                      key={movie.$id}
                      className="min-w-[230px] flex flex-row items-center"
                    >
                      <p className="[font-family:Bebas_Neue,sans-serif] text-[190px] [-webkit-text-stroke:5px_rgba(206,206,251,0.5)] mt-[22px] text-nowrap">
                        {index + 1}
                      </p>
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-[127px] h-[163px] rounded-lg object-cover -ml-3.5"
                      />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="space-y-9">
              <h2>Tutti i film</h2>
              {searchTerm &&
                (activeFilters.genres?.length > 0 ||
                  activeFilters.year ||
                  activeFilters.minRating ||
                  activeFilters.language ||
                  activeFilters.sortBy !== "popularity.desc") && (
                  <div>
                    <p className="text-center text-gray-200 text-sm mb-4">
                      ℹ️ La ricerca con filtri non è supportata. Mostrando film
                      filtrati invece dei risultati di ricerca per "{searchTerm}
                      ".
                    </p>
                  </div>
                )}
              {isLoading ? (
                <Spinner />
              ) : errorMessage ? (
                <p className="text-center text-white">{errorMessage}</p>
              ) : (
                <>
                  <ul className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {movieList.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        onClick={() => handleMovieClick(movie)}
                      />
                    ))}
                  </ul>

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1 || isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-dark-100/50 border border-light-100/20 rounded-lg text-white hover:bg-dark-100/70 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>←</span>
                        Precedente
                      </button>

                      <div className="flex items-center gap-2">
                        <span className="text-gray-200 text-sm">
                          Pagina {currentPage} di {totalPages}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages || isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-dark-100/50 border border-light-100/20 rounded-lg text-white hover:bg-dark-100/70 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Successiva
                        <span>→</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </div>
      </div>

      <MovieDetailsModal
        movie={selectedMovie}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </main>
  );
};

export default App;
