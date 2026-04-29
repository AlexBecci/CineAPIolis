import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { GlassContainer, PrimaryButton, GhostButton } from "./components/ui";
import Footer from "./components/Footer";

// ─── Tokens locales (evita re-importar todo el theme en este archivo) ────────
const T = {
  gradient: "linear-gradient(135deg, #1E3A8A 0%, #7E22CE 55%, #DB2777 100%)",
  glass10: "rgba(255,255,255,0.1)",
  glass20: "rgba(255,255,255,0.2)",
  border: "1px solid rgba(255,255,255,0.2)",
  text: "#ffffff",
  textMuted: "#c4c7c8",
};

// ─── Global reset del body (gradiente canvas) ────────────────────────────────
const GlobalCanvas = createGlobalStyle`
  body { background: #0b1326; }
`;

// ─── Styled layout ───────────────────────────────────────────────────────────
const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${T.gradient};
  font-family: 'Inter', sans-serif;
`;

// --- Header ---
const HeaderBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(11, 19, 38, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: ${T.border};
  padding: 10px 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;

  @media (min-width: 540px) {
    padding: 12px 24px;
    flex-wrap: nowrap;
    gap: 16px;
  }
`;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1 0 auto;

  @media (min-width: 540px) {
    flex: 0 0 auto;
  }
`;

const Logo = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${T.text};
  letter-spacing: -0.02em;
  white-space: nowrap;
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  /* mobile: ocupa toda la segunda fila */
  width: 100%;
  background: ${T.glass10};
  border: ${T.border};
  border-radius: 1.5rem;
  padding: 4px 4px 4px 14px;

  @media (min-width: 540px) {
    width: auto;
    margin-left: auto;
    padding: 4px 4px 4px 16px;
  }
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  color: ${T.text};
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  /* mobile: crece para llenar el espacio disponible */
  flex: 1;
  min-width: 0;

  @media (min-width: 540px) {
    flex: none;
    width: 200px;
  }

  &::placeholder {
    color: ${T.textMuted};
  }
`;

// --- Hero banner ---
const HeroSection = styled.section`
  position: relative;
  min-height: 520px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding: 40px 40px;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(11, 19, 38, 0.1) 0%,
      rgba(11, 19, 38, 0.75) 100%
    );
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 640px;
`;

const MovieTitle = styled.h1`
  font-size: 36px;
  font-weight: 800;
  line-height: 1.1;
  color: ${T.text};
  text-shadow: 0 2px 12px rgba(0,0,0,0.4);
  margin-bottom: 12px;
`;

const Overview = styled.p`
  font-size: 15px;
  font-weight: 500;
  line-height: 1.6;
  color: #e2e8f0;
  text-shadow: 0 1px 4px rgba(0,0,0,0.3);
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 12px;
`;

// --- YouTube player overlay ---
const PlayerOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(6, 14, 32, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
`;

const PlayerWrapper = styled.div`
  width: min(900px, 100%);
  position: relative;
  aspect-ratio: 16 / 9;

  /* react-youtube renders a div wrapper around the iframe */
  & > div {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
  }

  iframe {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    border-radius: 1rem;
    border: ${T.border};
  }
`;

const TrailerModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.01em;
  text-align: center;
  max-width: min(900px, 100%);
  padding: 0 16px;
`;

const TrailerNoResult = styled.p`
  font-size: 15px;
  font-weight: 500;
  color: ${T.textMuted};
  text-align: center;
`;

// --- Movie Detail Modal (bottom-sheet mobile / centered modal desktop) ---
const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 150;
  background: rgba(6, 14, 32, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: ${fadeIn} 200ms ease;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  @media (min-width: 640px) {
    align-items: center;
    padding: 24px;
  }
`;

const ModalSheet = styled.div`
  width: 100%;
  max-width: 540px;
  background: rgba(23, 31, 51, 0.95);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem 1.5rem 0 0;
  animation: ${slideUp} 280ms cubic-bezier(0.32, 0.72, 0, 1);
  overflow: hidden;
  max-height: 92dvh;
  overflow-y: auto;

  /* Shine top edge */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(255,255,255,0.4) 40%,
      rgba(255,255,255,0.4) 60%,
      transparent 100%
    );
  }

  @media (min-width: 640px) {
    border-radius: 1.5rem;
    max-height: 85vh;
  }
`;

const ModalDragHandle = styled.div`
  width: 36px;
  height: 4px;
  background: rgba(255,255,255,0.3);
  border-radius: 9999px;
  margin: 12px auto 0;

  @media (min-width: 640px) {
    display: none;
  }
`;

const ModalPoster = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  object-position: center top;
  display: block;

  @media (min-width: 640px) {
    max-height: 340px;
  }
`;

const ModalBody = styled.div`
  padding: 20px 20px 32px;
`;

const ModalTitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
`;

const ModalTitle = styled.h2`
  font-size: 22px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.2;
  letter-spacing: -0.02em;
`;

const CloseBtn = styled.button`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.08);
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 150ms ease;

  &:hover { background: rgba(255,255,255,0.15); }
`;

const ModalMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  flex-wrap: wrap;
`;

const MetaBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.2);
  color: #c4c7c8;
`;

const StarBadge = styled(MetaBadge)`
  background: rgba(234, 179, 8, 0.15);
  border-color: rgba(234, 179, 8, 0.4);
  color: #fde68a;
`;

const ModalOverview = styled.p`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.65;
  color: #c4c7c8;
  margin-bottom: 24px;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
`;

const LoadingPulse = styled.div`
  height: 14px;
  border-radius: 9999px;
  background: rgba(255,255,255,0.1);
  animation: ${keyframes`
    0%, 100% { opacity: 0.4; }
    50%       { opacity: 1; }
  `} 1.2s ease infinite;
`;

// --- Catálogo ---
const CatalogSection = styled.section`
  padding: 48px 24px;
`;

const CatalogHeader = styled.div`
  margin-bottom: 32px;
`;

const CatalogTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${T.text};
  margin-bottom: 8px;
  letter-spacing: -0.02em;
`;

const Accent = styled.div`
  height: 3px;
  width: 40px;
  background: linear-gradient(90deg, #7E22CE, #DB2777);
  border-radius: 9999px;
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
`;

const MovieCard = styled(GlassContainer)`
  cursor: pointer;
  transition: transform 150ms ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const PosterImage = styled.img`
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  border-radius: 0.75rem;
  display: block;
  border: ${T.border};
`;

const CardTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: ${T.text};
  line-height: 1.3;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

// ─── Componente ───────────────────────────────────────────────────────────────
function App() {
  const API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "fdd4a7944706e23b60ad0605cae91b5a";
  const IMAGE_PATH = "https://image.tmdb.org/t/p/original";

  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Cargando películas…" });
  const [playing, setPlaying] = useState(false);
  const [cardTrailer, setCardTrailer] = useState(null); // { key, title, loading }

  const fetchMovies = useCallback(async (key) => {
    const type = key ? "search" : "discover";
    const { data: { results } } = await axios.get(`${API_URL}/${type}/movie`, {
      params: { api_key: API_KEY, query: key },
    });
    setMovies(results);
    setMovie(results[0]);
    if (results.length) await fetchMovie(results[0].id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMovie = useCallback(async (id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: { api_key: API_KEY, append_to_response: "videos" },
    });
    if (data.videos?.results?.length) {
      const t = data.videos.results.find((v) => v.name === "Official Trailer");
      setTrailer(t ?? data.videos.results[0]);
    }
    setMovie(data);
  }, []);

  const selectMovie = useCallback(async (m) => {
    await fetchMovie(m.id);
    setMovie(m);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [fetchMovie]);

  const searchMovies = useCallback((e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  }, [fetchMovies, searchKey]);

  const closePlayer = useCallback(() => setPlaying(false), []);
  const openPlayer = useCallback(() => setPlaying(true), []);

  const openCardTrailer = useCallback(async (m) => {
    setCardTrailer({ key: null, title: m.title, loading: true });
    document.body.style.overflow = "hidden";
    try {
      const { data } = await axios.get(`${API_URL}/movie/${m.id}`, {
        params: { api_key: API_KEY, append_to_response: "videos" },
      });
      const vids = data.videos?.results ?? [];
      const t =
        vids.find((v) => v.type === "Trailer" && v.site === "YouTube") ??
        vids.find((v) => v.site === "YouTube");
      setCardTrailer({ key: t?.key ?? null, title: m.title, loading: false });
    } catch {
      setCardTrailer({ key: null, title: m.title, loading: false });
    }
  }, []);

  const closeCardTrailer = useCallback(() => {
    setCardTrailer(null);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closeCardTrailer(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeCardTrailer]);

  useEffect(() => { fetchMovies(); }, [fetchMovies]);

  return (
    <>
      <GlobalCanvas />
      <PageWrapper>

        {/* ── Header ── */}
        <HeaderBar>
          <LogoRow>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M19.129 18.164l-4.518-4.52A7.9 7.9 0 001.567 8.567a7.896 7.896 0 1014.064 4.945l4.52 4.519a.682.682 0 00.965-.965zM8.567 15.028a6.461 6.461 0 110-12.922 6.461 6.461 0 010 12.922z"
                fill="#ffffff"
              />
            </svg>
            <Logo>CineAPIolis</Logo>
          </LogoRow>
          <SearchForm onSubmit={searchMovies} role="search" aria-label="Buscar películas">
            <SearchInput
              placeholder="Buscar película…"
              type="search"
              aria-label="Texto de búsqueda"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <PrimaryButton type="submit" style={{ height: "36px", fontSize: "13px" }}>
              Buscar
            </PrimaryButton>
          </SearchForm>
        </HeaderBar>

        {/* ── Hero Banner ── */}
        {movie && (
          <HeroSection
            style={{ backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")` }}
            aria-label={`Película destacada: ${movie.title}`}
          >
            <HeroContent>
              <MovieTitle>{movie.title}</MovieTitle>
              {movie.overview && <Overview>{movie.overview}</Overview>}
              <HeroButtons>
                {trailer && (
                  <PrimaryButton onClick={openPlayer} aria-label="Reproducir trailer">
                    ▶ Ver Trailer
                  </PrimaryButton>
                )}
                <GhostButton aria-label="Más información">Más info</GhostButton>
              </HeroButtons>
            </HeroContent>
          </HeroSection>
        )}

        {/* ── Player Overlay ── */}
        {playing && trailer && (
          <PlayerOverlay role="dialog" aria-modal="true" aria-label="Reproductor de trailer">
            <PlayerWrapper>
              <YouTube
                videoId={trailer.key}
                opts={{
                  width: "100%",
                  height: "100%",
                  playerVars: { autoplay: 1, rel: 0, modestbranding: 1 },
                }}
              />
            </PlayerWrapper>
            <GhostButton onClick={closePlayer} aria-label="Cerrar reproductor">
              ✕ Cerrar
            </GhostButton>
          </PlayerOverlay>
        )}

        {/* ── Card Trailer Modal ── */}
        {cardTrailer && (
          <PlayerOverlay
            role="dialog"
            aria-modal="true"
            aria-label={`Trailer de ${cardTrailer.title}`}
            onClick={(e) => { if (e.target === e.currentTarget) closeCardTrailer(); }}
          >
            <TrailerModalTitle>{cardTrailer.title}</TrailerModalTitle>
            {cardTrailer.loading ? (
              <TrailerNoResult>Cargando trailer…</TrailerNoResult>
            ) : cardTrailer.key ? (
              <PlayerWrapper>
                <YouTube
                  videoId={cardTrailer.key}
                  opts={{
                    width: "100%",
                    height: "100%",
                    playerVars: { autoplay: 1, rel: 0, modestbranding: 1 },
                  }}
                />
              </PlayerWrapper>
            ) : (
              <TrailerNoResult>No hay trailer disponible para esta película.</TrailerNoResult>
            )}
            <GhostButton onClick={closeCardTrailer} aria-label="Cerrar trailer">
              ✕ Cerrar
            </GhostButton>
          </PlayerOverlay>
        )}

        {/* ── Catálogo ── */}
        <CatalogSection aria-label="Catálogo de películas">
          <CatalogHeader>
            <CatalogTitle>Catálogo</CatalogTitle>
            <Accent aria-hidden="true" />
          </CatalogHeader>
          <MovieGrid>
            {movies.map((m) => (
              <MovieCard
                key={m.id}
                elevation="standard"
                aria-label={m.title}
                onClick={() => openCardTrailer(m)}
              >
                <GlassContainer.Body>
                  <PosterImage
                    src={`${IMAGE_PATH}${m.poster_path}`}
                    alt={`Póster de ${m.title}`}
                    loading="lazy"
                  />
                </GlassContainer.Body>
                <GlassContainer.Footer>
                  <CardTitle>{m.title}</CardTitle>
                </GlassContainer.Footer>
              </MovieCard>
            ))}
          </MovieGrid>
        </CatalogSection>

        <Footer />
      </PageWrapper>
    </>
  );
}

export default App;
