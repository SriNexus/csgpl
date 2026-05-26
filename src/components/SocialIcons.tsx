type IconProps = { className?: string };

export const FacebookIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M22 12a10 10 0 1 0-11.6 9.88v-6.99H7.9V12h2.5V9.8c0-2.46 1.46-3.82 3.7-3.82 1.07 0 2.2.19 2.2.19v2.42h-1.24c-1.22 0-1.6.76-1.6 1.54V12h2.72l-.43 2.89h-2.29v6.99A10 10 0 0 0 22 12z"/>
  </svg>
);
export const InstagramIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
export const LinkedinIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8.34 18.34H5.67V9.99h2.67v8.35zM7 8.81a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1zm11.34 9.53h-2.67v-4.06c0-.97-.02-2.22-1.35-2.22-1.35 0-1.56 1.05-1.56 2.15v4.13H10.1V9.99h2.56v1.14h.04c.36-.68 1.23-1.4 2.53-1.4 2.7 0 3.2 1.78 3.2 4.1v4.51z"/>
  </svg>
);
export const TwitterIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M18.244 2H21l-6.51 7.44L22 22h-6.85l-4.78-6.26L4.8 22H2l7.05-8.06L2 2h6.97l4.32 5.79L18.244 2zm-2.4 18h1.55L7.27 4H5.62l10.22 16z"/>
  </svg>
);
export const WhatsappIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden>
    <path d="M16.001 3C9.376 3 4 8.376 4 15.001c0 2.376.66 4.601 1.812 6.501L4 29l7.701-1.795A11.94 11.94 0 0 0 16.001 27C22.626 27 28 21.626 28 15.001 28 8.376 22.626 3 16.001 3zm5.6 13.457c-.307-.154-1.815-.896-2.097-.998-.281-.103-.486-.154-.692.154-.205.307-.794.998-.973 1.204-.18.205-.359.231-.666.077-.307-.154-1.296-.478-2.469-1.523-.913-.814-1.529-1.82-1.708-2.127-.18-.307-.019-.473.135-.626.139-.139.307-.36.461-.54.154-.18.205-.307.307-.512.103-.205.051-.385-.026-.54-.077-.154-.692-1.665-.948-2.282-.249-.598-.504-.517-.692-.527l-.59-.011a1.13 1.13 0 0 0-.819.385c-.281.307-1.075 1.05-1.075 2.562 0 1.512 1.101 2.974 1.255 3.179.154.205 2.169 3.31 5.252 4.642.734.317 1.307.506 1.754.648.737.234 1.408.201 1.938.122.591-.088 1.815-.741 2.071-1.456.256-.715.256-1.328.18-1.456-.077-.128-.281-.205-.589-.359z"/>
  </svg>
);
