/**
 * GlassDemo — Demostración de uso de GlassContainer + PrimaryButton
 *
 * Muestra cómo consumir el Compound Component pattern:
 *   <GlassContainer> → Root
 *   <GlassContainer.Header> → Título
 *   <GlassContainer.Body> → Contenido
 *   <GlassContainer.Footer> → Acciones / Métricas
 *   <GlassContainer.MetricLabel> → Etiqueta secundaria (on-surface-variant)
 */

import React, { memo, useCallback, useState } from 'react';
import styled from 'styled-components';
import { GlassContainer, GhostButton, PrimaryButton } from './index';
import { theme } from '../../styles/theme';

// Fondo de demostración con el gradiente canvas del design system
const DemoBackground = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing.u(6)};
  background: ${theme.colors.gradientCanvas};
  font-family: ${theme.typography.fontFamily};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sectionMargin}px;
  align-items: center;
  justify-content: center;
`;

const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.cardGap}px;
  justify-content: center;
  width: 100%;
  max-width: 900px;
`;

const StyledCard = styled(GlassContainer)`
  width: 280px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${theme.spacing.u(2)};
  flex-wrap: wrap;
`;

// ─── Componente de demo de una película ──────────────────────────────────────

interface MovieCardProps {
  title: string;
  genre: string;
  rating: string;
  elevation?: 'standard' | 'elevated';
}

const MovieCard = memo<MovieCardProps>(({ title, genre, rating, elevation }) => {
  // useCallback para el manejador — evita que el botón hijo se re-renderice
  const handleWatch = useCallback(() => {
    console.log(`Ver trailer de: ${title}`);
  }, [title]);

  return (
    <StyledCard elevation={elevation} aria-label={`Película: ${title}`}>
      <GlassContainer.Header>{title}</GlassContainer.Header>
      <GlassContainer.Body>
        <GlassContainer.MetricLabel>Género</GlassContainer.MetricLabel>
        <p style={{ marginTop: theme.spacing.u(1) }}>{genre}</p>
      </GlassContainer.Body>
      <GlassContainer.Footer>
        <GlassContainer.MetricLabel>⭐ {rating}</GlassContainer.MetricLabel>
        <GhostButton onClick={handleWatch} style={{ marginLeft: 'auto' }}>
          Trailer
        </GhostButton>
      </GlassContainer.Footer>
    </StyledCard>
  );
});

MovieCard.displayName = 'MovieCard';

// ─── Demo ─────────────────────────────────────────────────────────────────────

const GlassDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return (
    <DemoBackground>
      <CardGrid>
        <MovieCard
          title="Dune: Part Two"
          genre="Sci-Fi / Adventure"
          rating="8.7 / 10"
          elevation="standard"
        />
        <MovieCard
          title="Oppenheimer"
          genre="Biography / Drama"
          rating="8.9 / 10"
          elevation="elevated"
        />
        <MovieCard
          title="Poor Things"
          genre="Fantasy / Comedy"
          rating="8.0 / 10"
        />
      </CardGrid>

      <ButtonRow>
        <PrimaryButton onClick={handleSearch} loading={loading}>
          {loading ? 'Buscando…' : 'Buscar Películas'}
        </PrimaryButton>
        <GhostButton onClick={() => console.log('favoritos')}>
          Mis Favoritos
        </GhostButton>
        <PrimaryButton disabled>
          Sin Resultados
        </PrimaryButton>
      </ButtonRow>
    </DemoBackground>
  );
};

export default GlassDemo;
