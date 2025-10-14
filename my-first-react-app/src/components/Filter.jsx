import React, { useState, useEffect, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";

const Filter = ({
  onFiltersChange,
  isLoading,
  onSidebarToggle,
  sidebarOpen,
}) => {
  const [filters, setFilters] = useState({
    genres: [],
    year: "",
    minRating: "",
    language: "",
    sortBy: "popularity.desc",
  });
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const API_KEY = import.meta.env.VITE_TMBD_API_KEY;

        if (!API_KEY || API_KEY === "undefined") {
          console.warn("TMDB API key not configured. Using default genres.");
          return;
        }

        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setGenres(data.genres || []);
        } else {
          console.warn(
            "Failed to fetch genres from TMDB API. Using default genres."
          );
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
        console.warn("Using default genres due to API error.");
      }
    };

    fetchGenres();
  }, []);

  const commonGenres = [
    { id: 28, name: "Azione" },
    { id: 12, name: "Avventura" },
    { id: 16, name: "Animazione" },
    { id: 35, name: "Commedia" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentario" },
    { id: 18, name: "Dramma" },
    { id: 10751, name: "Famiglia" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "Storia" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Musica" },
    { id: 9648, name: "Mistero" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Fantascienza" },
    { id: 10770, name: "Film TV" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "Guerra" },
    { id: 37, name: "Western" },
  ];

  const handleGenreChange = (genreId, isChecked) => {
    setFilters((prev) => ({
      ...prev,
      genres: isChecked
        ? [...prev.genres, genreId]
        : prev.genres.filter((id) => id !== genreId),
    }));
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      genres: [],
      year: "",
      minRating: "",
      language: "",
      sortBy: "popularity.desc",
    });
  };

  const applyFilters = () => {
    onFiltersChange(filters);
    if (onSidebarToggle) onSidebarToggle(false);
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 21 }, (_, i) => currentYear - i);

  const sortOptions = [
    { value: "popularity.desc", label: "Popolarità (Decrescente)" },
    { value: "popularity.asc", label: "Popolarità (Crescente)" },
    { value: "release_date.desc", label: "Data Uscita (Più Recente)" },
    { value: "release_date.asc", label: "Data Uscita (Più Vecchio)" },
    { value: "vote_average.desc", label: "Valutazione (Più Alta)" },
    { value: "vote_average.asc", label: "Valutazione (Più Bassa)" },
    { value: "revenue.desc", label: "Incassi (Più Alto)" },
  ];

  const languageOptions = [
    { code: "", name: "Tutte le lingue" },
    { code: "it", name: "Italiano" },
    { code: "en", name: "Inglese" },
    { code: "es", name: "Spagnolo" },
    { code: "fr", name: "Francese" },
    { code: "de", name: "Tedesco" },
    { code: "ja", name: "Giapponese" },
    { code: "ko", name: "Coreano" },
    { code: "zh", name: "Cinese" },
    { code: "pt", name: "Portoghese" },
  ];

  const hasActiveFilters =
    filters.genres.length > 0 ||
    filters.year ||
    filters.minRating ||
    filters.language ||
    filters.sortBy !== "popularity.desc";

  return (
    <div
      className={`w-full md:w-80 bg-dark-100/90 backdrop-blur-sm border-r border-light-100/20 fixed left-0 top-0 h-full z-50 overflow-y-auto transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4 border-b border-light-100/20 relative">
        <button
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-light-100/10 rounded-full text-white hover:bg-light-100/20 transition-all duration-200"
          onClick={() => {
            onSidebarToggle && onSidebarToggle(false);
          }}
          disabled={isLoading}
        >
          <span>✕</span>
        </button>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <h3 className="text-white font-semibold text-lg mb-3">Generi</h3>
          <div className="grid grid-cols-1 gap-2">
            {commonGenres.map((genre) => (
              <label
                key={genre.id}
                className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-all duration-200 ${
                  filters.genres.includes(genre.id)
                    ? "bg-[#AB8BFF]/20 border border-[#AB8BFF]/50"
                    : "bg-light-100/5 hover:bg-light-100/10"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={filters.genres.includes(genre.id)}
                  onChange={(e) =>
                    handleGenreChange(genre.id, e.target.checked)
                  }
                />
                <span
                  className={`text-sm transition-colors duration-200 ${
                    filters.genres.includes(genre.id)
                      ? "text-[#AB8BFF] font-semibold"
                      : "text-gray-200"
                  }`}
                >
                  {genre.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="flex flex-col">
            <label className="text-white font-medium text-sm mb-2">
              Anno di Uscita
            </label>
            <Listbox
              value={filters.year}
              onChange={(val) => handleFilterChange("year", val)}
            >
              <div className="relative">
                <Listbox.Button className="w-full bg-light-100/10 border border-light-100/20 rounded-lg px-3 py-2 text-left text-gray-200 text-sm focus:outline-none focus:border-[#AB8BFF]/50 focus:ring-1 focus:ring-[#AB8BFF]/30 transition-all duration-200">
                  {filters.year || "Tutti gli anni"}
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-75"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Listbox.Options className="absolute z-50 mt-1 w-full max-h-60 overflow-auto bg-dark-100 border border-light-100/20 rounded-lg p-1 shadow-lg">
                    <Listbox.Option
                      key="all"
                      value=""
                      className="cursor-pointer px-3 py-2 rounded text-gray-200 hover:bg-light-100/10 text-sm"
                    >
                      Tutti gli anni
                    </Listbox.Option>
                    {yearOptions.map((year) => (
                      <Listbox.Option
                        key={year}
                        value={String(year)}
                        className="cursor-pointer px-3 py-2 rounded text-gray-200 hover:bg-light-100/10 text-sm"
                      >
                        {year}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          <div className="flex flex-col">
            <label className="text-white font-medium text-sm mb-2">
              Valutazione Minima
            </label>
            <Listbox
              value={filters.minRating}
              onChange={(val) => handleFilterChange("minRating", val)}
            >
              <div className="relative">
                <Listbox.Button className="w-full bg-light-100/10 border border-light-100/20 rounded-lg px-3 py-2 text-left text-gray-200 text-sm focus:outline-none focus:border-[#AB8BFF]/50 focus:ring-1 focus:ring-[#AB8BFF]/30 transition-all duration-200">
                  {filters.minRating
                    ? `${filters.minRating}+ Stelle`
                    : "Tutte le valutazioni"}
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-75"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Listbox.Options className="absolute z-50 mt-1 w-full bg-dark-100 border border-light-100/20 rounded-lg p-1 shadow-lg">
                    {[
                      { value: "", label: "Tutte le valutazioni" },
                      { value: "8", label: "8+ Stelle" },
                      { value: "7", label: "7+ Stelle" },
                      { value: "6", label: "6+ Stelle" },
                      { value: "5", label: "5+ Stelle" },
                      { value: "4", label: "4+ Stelle" },
                      { value: "3", label: "3+ Stelle" },
                    ].map((opt) => (
                      <Listbox.Option
                        key={opt.value || "all"}
                        value={opt.value}
                        className="cursor-pointer px-3 py-2 rounded text-gray-200 hover:bg-light-100/10 text-sm"
                      >
                        {opt.label}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          <div className="flex flex-col">
            <label className="text-white font-medium text-sm mb-2">
              Lingua Originale
            </label>
            <Listbox
              value={filters.language}
              onChange={(val) => handleFilterChange("language", val)}
            >
              <div className="relative">
                <Listbox.Button className="w-full bg-light-100/10 border border-light-100/20 rounded-lg px-3 py-2 text-left text-gray-200 text-sm focus:outline-none focus:border-[#AB8BFF]/50 focus:ring-1 focus:ring-[#AB8BFF]/30 transition-all duration-200">
                  {languageOptions.find(
                    (lang) => lang.code === filters.language
                  )?.name || "Tutte le lingue"}
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-75"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Listbox.Options className="absolute z-50 mt-1 w-full max-h-60 overflow-auto bg-dark-100 border border-light-100/20 rounded-lg p-1 shadow-lg">
                    {languageOptions.map((lang) => (
                      <Listbox.Option
                        key={lang.code || "all"}
                        value={lang.code}
                        className="cursor-pointer px-3 py-2 rounded text-gray-200 hover:bg-light-100/10 text-sm"
                      >
                        {lang.name}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          <div className="flex flex-col">
            <label className="text-white font-medium text-sm mb-2">
              Ordina Per
            </label>
            <Listbox
              value={filters.sortBy}
              onChange={(val) => handleFilterChange("sortBy", val)}
            >
              <div className="relative">
                <Listbox.Button className="w-full bg-light-100/10 border border-light-100/20 rounded-lg px-3 py-2 text-left text-gray-200 text-sm focus:outline-none focus:border-[#AB8BFF]/50 focus:ring-1 focus:ring-[#AB8BFF]/30 transition-all duration-200">
                  {sortOptions.find((opt) => opt.value === filters.sortBy)
                    ?.label || "Popolarità (Decrescente)"}
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-75"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Listbox.Options className="absolute z-50 mt-1 w-full max-h-60 overflow-auto bg-dark-100 border border-light-100/20 rounded-lg p-1 shadow-lg">
                    {sortOptions.map((option) => (
                      <Listbox.Option
                        key={option.value}
                        value={option.value}
                        className="cursor-pointer px-3 py-2 rounded text-gray-200 hover:bg-light-100/10 text-sm"
                      >
                        {option.label}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-light-100/20">
          <button
            className="px-4 py-2 bg-transparent border border-gray-100/30 text-gray-200 rounded-lg hover:bg-gray-100/10 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={clearFilters}
            disabled={isLoading}
          >
            Cancella Filtri
          </button>
          <button
            className="px-6 py-2 bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] text-primary font-semibold rounded-lg hover:from-[#AB8BFF] hover:to-[#D6C7FF] transition-all duration-300 text-sm shadow-lg hover:shadow-[#AB8BFF]/25 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={applyFilters}
            disabled={isLoading}
          >
            Applica Filtri
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
