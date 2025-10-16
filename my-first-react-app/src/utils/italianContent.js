export const isItalianTranslationAvailable = (movie) => {
  return (
    movie.title !== movie.original_title ||
    (movie.overview && movie.overview.length > 0)
  );
};

export const getMovieTitle = (movie) => {
  return isItalianTranslationAvailable(movie)
    ? movie.title
    : movie.original_title;
};

export const getMovieOverview = (movie) => {
  if (movie.overview && movie.overview.length > 0) {
    return movie.overview;
  }

  return "Trama non disponibile";
};

export const getItalianContentAvailability = (movie) => {
  const hasItalianTitle = movie.title !== movie.original_title;
  const hasItalianOverview = movie.overview && movie.overview.length > 0;

  return {
    title: hasItalianTitle,
    overview: hasItalianOverview,
    any: hasItalianTitle || hasItalianOverview,
  };
};
