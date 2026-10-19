import { useState, useEffect, useCallback } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import MovieGallery from "./components/MovieGallery";
import MovieDetails from "./components/MovieDetails";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./lib/appwriteConfig";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const getPageNumbers = (currentPage, totalPages) => {
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  const pages = [];

  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) pages.push("start-ellipsis");
  }

  for (let page = startPage; page <= endPage; page += 1) {
    pages.push(page);
  }

  if (endPage < totalPages) {
    pages.push("end-ellipsis");
  }

  return pages;
};

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [moviesList, setMoviesList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const fetchMovieDetails = useCallback(async (movieId, signal) => {
    const response = await fetch(
      `${API_BASE_URL}/movie/${movieId}?append_to_response=credits`,
      { ...API_OPTIONS, signal },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch movie details");
    }

    return response.json();
  }, []);

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    1000,
    [searchTerm],
  );

  useEffect(() => {
    const controller = new AbortController();

    const loadMovies = async () => {
      try {
        const endpoint = new URL(
          debouncedSearchTerm
            ? `${API_BASE_URL}/search/movie`
            : `${API_BASE_URL}/discover/movie`,
        );
        if (debouncedSearchTerm) {
          endpoint.searchParams.set("query", debouncedSearchTerm);
        } else {
          endpoint.searchParams.set("sort_by", "popularity.desc");
        }
        endpoint.searchParams.set("page", String(currentPage));

        const response = await fetch(endpoint, {
          ...API_OPTIONS,
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }
        const data = await response.json();

        if (data.Response === "False") {
          setErrorMessage(
            data.Error || "No movies found. Please try again later.",
          );
          setMoviesList([]);
          return;
        }

        setMoviesList(data.results || []);
        setTotalPages(Math.min(data.total_pages || 1, 500));

        if (
          debouncedSearchTerm &&
          currentPage === 1 &&
          data.results.length > 0
        ) {
          await updateSearchCount(debouncedSearchTerm, data.results[0]);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching movies:", error);
          setErrorMessage("Failed to fetch movies. Please try again later.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadMovies();
    return () => controller.abort();
  }, [debouncedSearchTerm, currentPage]);

  useEffect(() => {
    let isCurrent = true;

    const loadTrendingMovies = async () => {
      try {
        const movies = await getTrendingMovies();
        if (isCurrent) setTrendingMovies(movies);
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      }
    };

    loadTrendingMovies();
    return () => {
      isCurrent = false;
    };
  }, []);

  const changePage = (page) => {
    if (page === currentPage) return;

    setCurrentPage(page);
    setIsLoading(true);
    setErrorMessage("");
  };

  const trendingSection = trendingMovies.length > 0 && (
    <section className="trending" id="trending-movies">
      <h2 className="section-title mt-10 text-center font-bold text-white">
        Trending Movies
      </h2>
      <ul className="hide-scrollbar">
        {trendingMovies.map((movie, index) => (
          <li key={movie.$id}>
            <button
              type="button"
              className="trending-movie-button"
              onClick={() =>
                setSelectedMovie({
                  id: movie.movie_id,
                  title: movie.searchTerm,
                  poster_path: movie.poster_url?.replace(
                    "https://image.tmdb.org/t/p/w500",
                    "",
                  ),
                })
              }
              aria-label={`View details for ${movie.searchTerm}`}
            >
              <p>{index + 1}</p>
              <img src={movie.poster_url} alt={movie.searchTerm} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );

  return (
    <main id="page-top">
      <div className="pattern">
        <div className="wrapper">
          <div className="page-topbar">
            {!selectedMovie && (
              <a
                className="fixed-site-logo"
                href="#page-top"
                aria-label="Movie app home"
              >
                <img src="/logo.png" alt="" />
              </a>
            )}
            <Navbar />
          </div>
          <header>
            <MovieGallery
              movies={moviesList}
              onMovieSelect={setSelectedMovie}
            />

            <h1 className="hero-title">
              Explore Thousands of{" "}Movies.
              <span className="text-gradient">From Timeless
              Classics</span>  to <span className="text-gradient2">Today&apos;s Biggest Hits</span>.
            </h1>

            <div id="search-movies" className="page-section-anchor">
              <Search
                searchTerm={searchTerm}
                setSearchTerm={(term) => {
                  setSearchTerm(term);
                  setCurrentPage(1);
                  setIsLoading(true);
                  setErrorMessage("");
                }}
              />
            </div>
          </header>
          {!debouncedSearchTerm && trendingSection}
          <section className="all-movies page-section-anchor" id="all-movies">
            <h2 className="section-title mt-10 text-center font-bold text-white">
              {debouncedSearchTerm ? "Search Results" : "All Movies"}
            </h2>

            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul className="movies-grid">
                {moviesList.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={() => setSelectedMovie(movie)}
                  />
                ))}
              </ul>
            )}
            {!isLoading && !errorMessage && totalPages > 1 && (
              <nav
                className="flex flex-wrap items-center justify-center gap-2 pt-8"
                aria-label="Movie pages"
              >
                <button
                  type="button"
                  onClick={() => changePage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg bg-dark-100 px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                {getPageNumbers(currentPage, totalPages).map((page) =>
                  typeof page === "number" ? (
                    <button
                      type="button"
                      key={page}
                      onClick={() => changePage(page)}
                      aria-current={currentPage === page ? "page" : undefined}
                      className={`rounded-lg px-3 py-2 ${
                        currentPage === page
                          ? "bg-purple-500 text-white"
                          : "bg-dark-100 text-white hover:bg-dark-100/70"
                      }`}
                    >
                      {page}
                    </button>
                  ) : (
                    <span key={page} className="px-1 text-light-200" aria-hidden="true">
                      …
                    </span>
                  ),
                )}
                <button
                  type="button"
                  onClick={() =>
                    changePage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-lg bg-dark-100 px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </nav>
            )}
          </section>
          {debouncedSearchTerm && trendingSection}
          <Footer />
        </div>
      </div>
      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          fetchMovieDetails={fetchMovieDetails}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </main>
  );
};

export default App;
