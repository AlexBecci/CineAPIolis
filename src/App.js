import React, { useEffect, useState } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import "./App.css";
import Footer from "./components/Footer";

function App() {
  const API_URL = `https://api.themoviedb.org/3`;
  const API_KEY = `fdd4a7944706e23b60ad0605cae91b5a`;
  const IMAGE_PATH = `https://image.tmdb.org/t/p/original`;
  const URL_IMAGE = `https://image.tmdb.org/t/p/original`;

  //Variables de estado
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Loading Movies" });
  const [playing, setPlaying] = useState(false);

  //funcion de peticion GET a la API
  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    const {
      data: { results },
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
      },
    });

    setMovies(results);
    setMovie(results[0]);

    if (results.length) {
      await fetchMovie(results[0].id);
    }
  };
  //Funcion para la peticion de reproductor de video
  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos",
      },
    });
    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }
    setMovie(data);
  };

  const selectMovie = async (movie) => {
    fetchMovie(movie.id);
    setMovie(movie);
    window.scrollTo(0, 0);
  };

  //Funcion buscador de peliculas
  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  };

  useEffect(() => {
    fetchMovies();
  }, []);
  return (
    <div className="bg-slate-900">
      <header className="text-gray-600 body-font bg-gradient-to-b from-black to-neutral-900 shadow-lg shadow-black ">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <svg class="svg-icon" viewBox="0 0 20 20">
            <path
              fill="none"
              d="M19.129,18.164l-4.518-4.52c1.152-1.373,1.852-3.143,1.852-5.077c0-4.361-3.535-7.896-7.896-7.896
								c-4.361,0-7.896,3.535-7.896,7.896s3.535,7.896,7.896,7.896c1.934,0,3.705-0.698,5.078-1.853l4.52,4.519
								c0.266,0.268,0.699,0.268,0.965,0C19.396,18.863,19.396,18.431,19.129,18.164z M8.567,15.028c-3.568,0-6.461-2.893-6.461-6.461
								s2.893-6.461,6.461-6.461c3.568,0,6.46,2.893,6.46,6.461S12.135,15.028,8.567,15.028z"
            ></path>
          </svg>
          <span className="ml-3 text-xl">CineAPIolis</span>
          <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center"></nav>
            <form className="bg-cyan-900 py-2 px-5 rounded-xl" onSubmit={searchMovies}>
              <input className="rounded-full px-2 bg-amber-100 text-black font-bold"
                placeholder="Search"
                type="text"
                onChange={(e) => setSearchKey(e.target.value)}
              ></input>
              <button className="inline-flex items-center bg-black border-2 py-0 px-2 ml-3 focus:outline-none hover:bg-slate-900 rounded-full text-base mt-4 md:mt-0 text-white">
                Search
              </button>
            </form>
          </div>
      </header>
      {/* Banner y reproductor de video */}
      <div className="pt-24 bg-gradient-to-b from-neutral-900 to-slate-900">
        <main >
          {movie ? (
            <div
              className="mx-20 border-4 border-black"
              style={{
                backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
              }}
            >
              <section className="text-gray-600 body-font">
                <div className="container mx-auto flex px-5 py-12 items-center justify-center flex-col">
                  <img
                    className="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded"
                    alt="hero"
                    src={`${URL_IMAGE + movie.poster_path}`}
                  />
                  <div className="text-center lg:w-2/3 w-full">
                    {playing ? (
                      <>
                        <YouTube
                          videoId={trailer.key}
                          className="reproductor container"
                          opts={{
                            width: "100%",
                            height: "100%",
                            playerVars: {
                              autoplay: 1,
                              controls: 0,
                              cc_load_policy: 0,
                              fs: 0,
                              iv_load_policy: 0,
                              modestbranding: 0,
                              rel: 0,
                              showinfo: 0,
                            },
                          }}
                        />
                        <button
                          onClick={() => setPlaying(false)}
                          className="inline-flex text-white bg-black border-2 py-2 px-6 focus:outline-none hover:scale-105 rounded text-lg mb-5 my-5 font-semibold"
                        >
                          Close
                        </button>
                      </>
                    ) : (
                      <div className="container">
                        <div className=" bg-black bg-opacity-50 rounded-md pt-4 pb-2 px-4">
                          {trailer ? (
                            <button
                              className="inline-flex text-white bg-black border-2 py-2 px-6 focus:outline-none hover:scale-105 rounded text-lg mb-5 font-semibold"
                              onClick={() => setPlaying(true)}
                              type="button"
                            >
                              Play Trailer
                            </button>
                          ) : (
                            "Sorry, no trailer available"
                          )}
                          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-bold text-amber-50">
                            {movie.title}
                          </h1>
                          <p className="mb-8 leading-relaxed font-bold text-amber-50">
                            {movie.overview}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          ) : null}
        </main>
      </div>

      {/* Contenedor que va mostrar posters de las peliculas actuales */}
      <section className="body-font bg-gradient-to-b from-slate-900 to-black">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap w-full mb-20">
            <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-amber-50">
                Catalogo
              </h1>
              <div className="h-1 w-32 bg-orange-500 rounded"></div>
            </div>
          </div>
          <div className="flex flex-wrap -m-4 text-amber-50">
            {movies.map((movie) => (
              <div key={movie.id} className="xl:w-1/4 md:w-1/2 p-4">
                <div className="bg-zinc-900 p-6 rounded-lg shadow-md shadow-black">
                  <img
                    className="h-72 rounded w-full object-cover object-center mb-6 border-2 border-slate-700"
                    src={`${URL_IMAGE + movie.poster_path}`}
                    alt="imageMovie"
                  />
                  <h2 className="text-lg font-medium title-font mb-4 border-b-2 border-orange-600">
                    {movie.title}
                  </h2>
                  <button
                    onClick={() => selectMovie(movie)}
                    smooth
                    duration={500}
                    className="text-base  mx-2 group text-amber-50 w-fit px-4 py-1 flex items-center rounded-md bg-gradient-to-r from-zinc-800 to-cyan-500 hover:cursor-pointer hover:scale-105 hover:to-cyan-600"
                  >
                    Trailer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer/>
    </div>

  );
}

export default App;
