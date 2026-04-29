/**
 * GlassContainer — Compound Component
 *
 * Implementa el patrón Compound Components para evitar prop drilling.
 * Los sub-componentes (Header, Body, Footer) se acceden como propiedades
 * estáticas: <GlassContainer.Header />, <GlassContainer.Body />, etc.
 *
 * Niveles de elevación (DESIGN.md):
 *   elevation="standard"  → backdrop-filter: blur(20px), bg: rgba(255,255,255,0.1)
 *   elevation="elevated"  → backdrop-filter: blur(40px), bg: rgba(255,255,255,0.2)
 */

import React, { createContext, memo, useContext } from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../../styles/theme';

// ─── Context ────────────────────────────────────────────────────────────────

type Elevation = 'standard' | 'elevated';

interface GlassContextValue {
  elevation: Elevation;
}

const GlassContext = createContext<GlassContextValue>({ elevation: 'standard' });

const useGlassContext = () => useContext(GlassContext);

// ─── Shared glass CSS (reutilizado por ambos niveles) ────────────────────────

const glassBase = css`
  border-radius: ${theme.rounded.lg};
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: ${theme.glass.standard.boxShadow};
  color: ${theme.colors.primary};
  font-family: ${theme.typography.fontFamily};
  position: relative;
  overflow: hidden;

  /* Shine line: borde superior e izquierdo que simula fuente de luz */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    border-top: 1px solid rgba(255, 255, 255, 0.35);
    border-left: 1px solid rgba(255, 255, 255, 0.35);
    pointer-events: none;
  }
`;

// ─── Styled Root ────────────────────────────────────────────────────────────

interface RootProps {
  $elevation: Elevation;
}

const Root = styled.div<RootProps>`
  ${glassBase}

  ${({ $elevation }) =>
    $elevation === 'standard'
      ? css`
          background: ${theme.glass.standard.background};
          backdrop-filter: ${theme.glass.standard.backdropFilter};
          -webkit-backdrop-filter: ${theme.glass.standard.WebkitBackdropFilter};
          border-radius: ${theme.rounded.lg};
        `
      : css`
          background: ${theme.glass.elevated.background};
          backdrop-filter: ${theme.glass.elevated.backdropFilter};
          -webkit-backdrop-filter: ${theme.glass.elevated.WebkitBackdropFilter};
          border-radius: ${theme.rounded.xl};
        `}
`;

// ─── Sub-componentes ─────────────────────────────────────────────────────────

const Header = styled.div`
  padding: ${theme.spacing.u(2)} ${theme.spacing.u(3)};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: ${theme.typography.headlineMd.fontSize};
  font-weight: ${theme.typography.headlineMd.fontWeight};
  line-height: ${theme.typography.headlineMd.lineHeight};
  /* Weight Tier Up sobre vidrio */
  font-weight: ${theme.weightTierUp(theme.typography.headlineMd.fontWeight)};
  color: ${theme.colors.primary};
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
`;

const Body = styled.div`
  padding: ${theme.spacing.glassPadding}px;
  font-size: ${theme.typography.bodyMd.fontSize};
  font-weight: ${theme.weightTierUp(theme.typography.bodyMd.fontWeight)};
  line-height: ${theme.typography.bodyMd.lineHeight};
  color: ${theme.colors.onSurface};
`;

const FooterSection = styled.div`
  padding: ${theme.spacing.u(1.5)} ${theme.spacing.u(3)};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: ${theme.spacing.cardGap}px;
`;

const MetricLabel = styled.span`
  font-size: ${theme.typography.labelSm.fontSize};
  font-weight: ${theme.typography.labelSm.fontWeight};
  line-height: ${theme.typography.labelSm.lineHeight};
  letter-spacing: ${theme.typography.labelSm.letterSpacing};
  color: ${theme.colors.onSurfaceVariant};
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
  text-transform: uppercase;
`;

// ─── Props del Root ──────────────────────────────────────────────────────────

interface GlassContainerProps {
  elevation?: Elevation;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  /** aria-label para accesibilidad */
  'aria-label'?: string;
}

// ─── Componente raíz (con memo para evitar re-renders innecesarios) ──────────

const GlassContainerRoot = memo<GlassContainerProps>(
  ({ elevation = 'standard', children, className, style, onClick, 'aria-label': ariaLabel }) => {
    return (
      <GlassContext.Provider value={{ elevation }}>
        <Root
          $elevation={elevation}
          className={className}
          style={style}
          onClick={onClick}
          aria-label={ariaLabel}
          role={ariaLabel ? 'region' : undefined}
        >
          {children}
        </Root>
      </GlassContext.Provider>
    );
  }
);

GlassContainerRoot.displayName = 'GlassContainer';

// ─── Compound Component Assembly ─────────────────────────────────────────────

export const GlassContainer = Object.assign(GlassContainerRoot, {
  Header: memo(Header),
  Body: memo(Body),
  Footer: memo(FooterSection),
  MetricLabel: memo(MetricLabel),
});

// Re-export del hook por si algún componente hijo necesita saber el nivel
export { useGlassContext };
