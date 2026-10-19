import { useEffect, useState } from "react";
import "../assets/MovieDetails.css";
import Spinner from "./Spinner";

const formatCurrency = (amount) =>
  amount
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(amount)
    : "Not available";

const MovieDetails = ({ movie, fetchMovieDetails, onClose }) => {
  const [result, setResult] = useState({
    movieId: movie.id,
    details: null,
    errorMessage: "",
  });

  useEffect(() => {
    const controller = new AbortController();
    let isCurrent = true;

    fetchMovieDetails(movie.id, controller.signal)
      .then((data) => {
        if (isCurrent) {
          setResult({ movieId: movie.id, details: data, errorMessage: "" });
        }
      })
      .catch((error) => {
        if (isCurrent && error.name !== "AbortError") {
          console.error("Error fetching movie details:", error);
          setResult({
            movieId: movie.id,
            details: null,
            errorMessage: "Could not load movie details. Please try again.",
          });
        }
      });

    return () => {
      isCurrent = false;
      controller.abort();
    };
  }, [fetchMovieDetails, movie.id]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const currentResult = result.movieId === movie.id ? result : null;
  const details = currentResult?.details;
  const errorMessage = currentResult?.errorMessage || "";
  const posterPath = details?.poster_path || movie.poster_path;

  return (
    <div
      className="movie-details-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="movie-details"
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-details-title"
      >
        <button
          className="movie-details-close"
          type="button"
          onClick={onClose}
          aria-label="Close movie details"
        >
          &times;
        </button>

        {posterPath && (
          <img
            className="movie-details-poster"
            src={`https://image.tmdb.org/t/p/w500${posterPath}`}
            alt={`${details?.title || movie.title} poster`}
          />
        )}

        <div className="movie-details-content">
          <h2 id="movie-details-title">{details?.title || movie.title}</h2>

          {errorMessage ? (
            <p role="alert">{errorMessage}</p>
          ) : !details ? (
            <Spinner />
          ) : (
            <>
              {details.tagline && (
                <p className="movie-details-tagline">{details.tagline}</p>
              )}
              <dl className="movie-details-facts">
                <div>
                  <dt>Release date</dt>
                  <dd>{details.release_date || "Not available"}</dd>
                </div>
                <div>
                  <dt>Rating</dt>
                  <dd>
                    {details.vote_average
                      ? `${details.vote_average.toFixed(1)} / 10`
                      : "Not rated"}
                  </dd>
                </div>
                <div>
                  <dt>Runtime</dt>
                  <dd>
                    {details.runtime ? `${details.runtime} minutes` : "Not available"}
                  </dd>
                </div>
                <div>
                  <dt>Language</dt>
                  <dd>
                    {details.original_language?.toUpperCase() || "Not available"}
                  </dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{details.status || "Not available"}</dd>
                </div>
                <div>
                  <dt>Budget</dt>
                  <dd>{formatCurrency(details.budget)}</dd>
                </div>
                <div>
                  <dt>Revenue</dt>
                  <dd>{formatCurrency(details.revenue)}</dd>
                </div>
              </dl>

              <div className="movie-details-section">
                <h3>Genres</h3>
                <p>
                  {details.genres?.map((genre) => genre.name).join(", ") ||
                    "Not available"}
                </p>
              </div>

              <div className="movie-details-section">
                <h3>Overview</h3>
                <p>{details.overview || "No overview available."}</p>
              </div>

              <div className="movie-details-section">
                <h3>Cast</h3>
                <p>
                  {details.credits?.cast
                    ?.slice(0, 8)
                    .map((person) => person.name)
                    .join(", ") || "Not available"}
                </p>
              </div>

              <div className="movie-details-section">
                <h3>Production companies</h3>
                <p>
                  {details.production_companies
                    ?.map((company) => company.name)
                    .join(", ") || "Not available"}
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default MovieDetails;
