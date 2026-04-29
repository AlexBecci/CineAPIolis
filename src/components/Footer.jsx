import React from 'react'
import styled from 'styled-components'

const FooterBar = styled.footer`
  background: rgba(11, 19, 38, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 16px 24px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-family: 'Inter', sans-serif;
`

const Copyright = styled.p`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #c4c7c8;
  text-transform: uppercase;
`

const SocialLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const SocialLink = styled.a`
  color: #adc9eb;
  transition: color 150ms ease, transform 150ms ease;
  display: flex;

  &:hover {
    color: #ffffff;
    transform: translateY(-2px);
  }
`

function Footer() {
  return (
    <FooterBar>
      <Copyright>© 2024 CineAPIolis</Copyright>
      <SocialLinks>
        <SocialLink
          href="https://twitter.com/besisikun"
          aria-label="Twitter"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg fill="currentColor" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
          </svg>
        </SocialLink>
        <SocialLink
          href="https://www.instagram.com/becci.ale/"
          aria-label="Instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
          </svg>
        </SocialLink>
        <SocialLink
          href="https://www.linkedin.com/in/alex-becci-gatica-82551a22b/"
          aria-label="LinkedIn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg fill="currentColor" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </SocialLink>
      </SocialLinks>
    </FooterBar>
  )
}

export default Footer
