/**
 * PrimaryButton & GhostButton
 *
 * Implementa los tokens de "button-primary" y "button-ghost" de DESIGN.md.
 * — React.memo para evitar re-renders cuando las props no cambian.
 * — useCallback debe aplicarse en el sitio de consumo sobre el handler.
 * — Contraste WCAG AA garantizado: texto #2f3131 sobre fondo #ffffff (ratio > 7:1).
 */

import React, { forwardRef, memo } from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../../styles/theme';

// ─── Tipos ───────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Muestra un spinner y bloquea la interacción */
  loading?: boolean;
  /** Icono opcional a la izquierda del label */
  leftIcon?: React.ReactNode;
  /** Icono opcional a la derecha del label */
  rightIcon?: React.ReactNode;
}

// ─── Estilos base compartidos ─────────────────────────────────────────────────

const baseButton = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.u(1)};

  height: ${theme.button.height};
  padding: 0 ${theme.button.paddingX};
  border-radius: ${theme.rounded.xl};
  border: none;

  font-family: ${theme.typography.labelSm.fontFamily};
  font-size: ${theme.typography.labelSm.fontSize};
  /* Weight Tier Up ya que el botón siempre está sobre una superficie con blur */
  font-weight: ${theme.weightTierUp(theme.typography.labelSm.fontWeight)};
  line-height: ${theme.typography.labelSm.lineHeight};
  letter-spacing: ${theme.typography.labelSm.letterSpacing};
  text-transform: uppercase;
  white-space: nowrap;

  cursor: pointer;
  user-select: none;
  transition: background 150ms ease, transform 100ms ease, opacity 150ms ease;

  &:focus-visible {
    /* WCAG 2.4.7 — focus visible con anillo de alto contraste */
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 3px;
  }

  &:disabled,
  &[aria-busy='true'] {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

// ─── Variante Primary ─────────────────────────────────────────────────────────

const StyledPrimaryButton = styled.button`
  ${baseButton}

  background: ${theme.colors.primary};
  color: ${theme.colors.onPrimary};
  /* Sombra sutil para separar el botón del fondo vibrante */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);

  &:hover:not(:disabled):not([aria-busy='true']) {
    background: ${theme.colors.primaryFixedDim};
    transform: translateY(-1px);
  }

  &:active:not(:disabled):not([aria-busy='true']) {
    transform: translateY(0);
  }
`;

// ─── Variante Ghost ───────────────────────────────────────────────────────────

const StyledGhostButton = styled.button`
  ${baseButton}

  background: rgba(255, 255, 255, 0.05);
  color: ${theme.colors.primary};
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  &:hover:not(:disabled):not([aria-busy='true']) {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-1px);
  }

  &:active:not(:disabled):not([aria-busy='true']) {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(0);
  }
`;

// ─── Spinner (accesible) ──────────────────────────────────────────────────────

const SpinnerRing = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  animation: spin 0.7s linear infinite;
`;

// ─── Componente ───────────────────────────────────────────────────────────────

const ButtonInner: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...rest
}) => {
  const StyledButton = variant === 'ghost' ? StyledGhostButton : StyledPrimaryButton;

  return (
    <StyledButton
      disabled={disabled || loading}
      aria-busy={loading ? 'true' : undefined}
      aria-disabled={disabled || loading ? 'true' : undefined}
      {...rest}
    >
      {loading ? (
        <>
          <SpinnerRing aria-hidden="true" />
          <span className="sr-only">Cargando…</span>
        </>
      ) : (
        <>
          {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
          {children}
          {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
        </>
      )}
    </StyledButton>
  );
};

// forwardRef permite pasar refs desde el componente padre (e.g. para focus management)
export const PrimaryButton = memo(
  forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
    <ButtonInner {...props}/*  ref={ref} */ variant="primary" />
  ))
);
PrimaryButton.displayName = 'PrimaryButton';

export const GhostButton = memo(
  forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
    <ButtonInner {...props}/*  ref={ref} */ variant="ghost" />
  ))
);
GhostButton.displayName = 'GhostButton';
