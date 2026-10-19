const MovieCard = ({ movie, onClick }) => {
  const { title, vote_average, poster_path, original_language, release_date } =
    movie;

  return (
    <div
      className="movie-card movie-card-selectable"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      aria-label={`View details for ${title}`}
    >
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500${poster_path}`
            : "/No-Poster.png"
        }
        alt={title}
      />
      <div className="mt-4">
          <h3 className="text-white">{title}</h3>
        <div className="content">
          <div className="rating">
            <img src="/star.svg" alt="Star" />
            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
            <span>✧</span>
            <p className="lang">{original_language}</p>
          </div>
          <span>✧</span>
          <p className="year">
            {release_date ? release_date.split("-")[0] : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
