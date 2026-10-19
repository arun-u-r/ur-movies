import { useEffect, useState } from "react";
import "../assets/MovieGallery.css";

const getRandomMovies = (movies, count, previousMovies) => {
  const shuffledMovies = [...movies];

  for (let index = 0; index < count; index += 1) {
    const randomIndex =
      index + Math.floor(Math.random() * (shuffledMovies.length - index));
    [shuffledMovies[index], shuffledMovies[randomIndex]] = [
      shuffledMovies[randomIndex],
      shuffledMovies[index],
    ];
  }

  const nextMovies = shuffledMovies.slice(0, count);
  const previousIds = new Set(previousMovies.map((movie) => movie.id));

  const sameMovies = nextMovies.every((movie) => previousIds.has(movie.id));
  if (movies.length > count && sameMovies) {
    nextMovies[count - 1] = movies.find((movie) => !previousIds.has(movie.id));
  } else if (
    nextMovies.length > 1 &&
    nextMovies.every((movie, index) => movie.id === previousMovies[index]?.id)
  ) {
    [nextMovies[0], nextMovies[1]] = [nextMovies[1], nextMovies[0]];
  }

  return nextMovies;
};

const MovieGallery = ({ movies, onMovieSelect }) => {
  const [displayedMovies, setDisplayedMovies] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (movies.length === 0 || isHovered) {
      return undefined;
    }

    const updateMovies = () => {
      setDisplayedMovies((currentMovies) =>
        getRandomMovies(movies, Math.min(3, movies.length), currentMovies),
      );
    };

    const initialUpdateId = window.setTimeout(updateMovies, 0);
    const intervalId = window.setInterval(updateMovies, 2000);

    return () => {
      window.clearTimeout(initialUpdateId);
      window.clearInterval(intervalId);
    };
  }, [isHovered, movies]);

  if (movies.length === 0 || displayedMovies.length === 0) return null;

  return (
    <div
      className="creationsBlocUl"
      aria-label="Featured movies"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {displayedMovies.map((movie) => {
        const year = movie.release_date
          ? movie.release_date.split("-")[0]
          : "Year unknown";

        return (
          <figure
            className="creaBlock creaBlockPrez"
            key={movie.id}
            tabIndex={0}
            role="button"
            onClick={() => onMovieSelect(movie)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onMovieSelect(movie);
              }
            }}
            aria-label={`View details for ${movie.title}`}
          >
            <div className="blocImg">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "/No-Poster.png"
                }
                alt={`${movie.title} poster`}
              />
              <div className="movie-gallery-rating">
                <img src="/star.svg" alt="" aria-hidden="true" />
                <span>
                  {typeof movie.vote_average === "number"
                    ? movie.vote_average.toFixed(1)
                    : "Not rated"}
                </span>
              </div>
            </div>
            <figcaption>
              <span className="movie-gallery-title">{movie.title}</span>
              <span className="movie-gallery-year">{year}</span>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
};

export default MovieGallery;
