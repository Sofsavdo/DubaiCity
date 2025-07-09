import React from 'react';
import { motion } from 'framer-motion';

// Eski ikonalar (optimizatsiya qilingan)
export const CityIcon = (props) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    {...props}
  >
    <path d="M19.5 6h-3V4.5a3 3 0 00-3-3h-3a3 3 0 00-3 3V6H4.5a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V9a3 3 0 00-3-3zM12 4.5a1.5 1.5 0 011.5 1.5V6h-3V6A1.5 1.5 0 0112 4.5z" />
  </motion.svg>
);

export const MarketIcon = (props) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    {...props}
  >
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.106a.75.75 0 11-1.06-1.06l-1.591 1.59a.75.75 0 11-1.06-1.061l1.59-1.591a.75.75 0 011.06 1.06l1.59 1.591a.75.75 0 01-1.06 1.06l-1.59-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75z" />
  </motion.svg>
);

export const ProjectsIcon = (props) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    {...props}
  >
    <path fillRule="evenodd" d="M11.99 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 11.99 2.25zm1.28 5.72a.75.75 0 00-1.06 0l-3 3a.75.75 0 000 1.06l3 3a.75.75 0 101.06-1.06L10.81 12l2.47-2.47a.75.75 0 000-1.06z" clipRule="evenodd" />
  </motion.svg>
);

export const TeamIcon = (props) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    {...props}
  >
    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM4.5 16.875a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM15 15.75a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75z" />
  </motion.svg>
);

export const AssetsIcon = (props) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    {...props}
  >
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005z" clipRule="evenodd" />
  </motion.svg>
);

export const CloseIcon = (props) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </motion.svg>
);

export const ProfileIcon = (props) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    {...props}
  >
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
  </motion.svg>
);

export const WalletIcon = (props) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 mr-2"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    {...props}
  >
    <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.5a3 3 0 013-3h15a3 3 0 013 3v.75a.75.75 0 01-1.5 0v-.75a1.5 1.5 0 00-1.5-1.5h-15a1.5 1.5 0 00-1.5 1.5v4.5a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5v-.75a.75.75 0 011.5 0v.75a3 3 0 01-3 3h-15a3 3 0 01-3-3v-4.5z" />
  </motion.svg>
);

export const CopyIcon = (props) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    {...props}
  >
    <path fillRule="evenodd" d="M16.5 2.25a.75.75 0 00-1.5 0v11.5a.75.75 0 001.5 0V2.25zM12.75 5.25a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v11.5a.75.75 0 01-1.5 0V6h-1.5a.75.75 0 01-.75-.75zM9 9.75a.75.75 0 00-1.5 0v11.5a.75.75 0 001.5 0V9.75zM6 6.75a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v11.5a.75.75 0 01-1.5 0V7.5H6.75A.75.75 0 016 6.75z" clipRule="evenodd" />
  </motion.svg>
);

export const ShareIcon = (props) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    {...props}
  >
    <path fillRule="evenodd" d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z" clipRule="evenodd" />
  </motion.svg>
);

export const LinkIcon = (props) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    {...props}
  >
    <path fillRule="evenodd" d="M19.904 4.096a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l4.5-4.5a.75.75 0 011.06 0zM5.156 14.844a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l4.5-4.5a.75.75 0 011.06 0zM19.904 14.844a.75.75 0 01-1.06 0l-14.5-14.5a.75.75 0 011.06-1.06l14.5 14.5a.75.75 0 010 1.06z" clipRule="evenodd" />
  </motion.svg>
);

export const CheckIcon = (props) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    {...props}
  >
    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
  </motion.svg>
);

export const SendIcon = (props) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    {...props}
  >
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </motion.svg>
);

// Yangi ikonalar (optimizatsiya qilingan)
export const CoinIcon = (props) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
    whileHover={{ scale: 1.1, rotate: 10 }}
    whileTap={{ scale: 0.9 }}
    {...props}
  >
    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
    <path d="M12.25 7.5a.75.75 0 00-1.5 0v8.63l-1.6-1.28a.75.75 0 00-.9.2l-.5 1a.75.75 0 00.9.9l2.5 2a.75.75 0 00.9 0l2.5-2a.75.75 0 00.9-.9l-.5-1a.75.75 0 00-.9-.2l-1.6 1.28V7.5z" />
  </motion.svg>
);

export const CityscapeIcon = (props) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    {...props}
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
    <path d="M21.9,13.5H21V11h-2v2.5h-1V9.8l-2.4-1.2l-2.5,1.7V12h-1V9.5h-1V12h-1V9.5l-2.6-1.3L5,10.4V13.5H2.1 c-0.5,0-0.7-0.5-0.3-0.8L11.5,4c0.3-0.2,0.6-0.2,0.9,0l10,8.7C22.6,13,22.4,13.5,21.9,13.5z M10,14.5v3H8v-3H10z M13,14.5v3h-2v-3 H13z M16,14.5v3h-2v-3H16z" />
  </motion.svg>
);

export const YoutubeIcon = (props) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    {...props}
  >
    <path d="M12.04,18.84c-3.12,0-6.33-0.04-9.45-0.12c-1.3-0.04-2.43-1.15-2.47-2.45c-0.08-1.93-0.11-3.87-0.11-5.8s0.03-3.87,0.11-5.8c0.04-1.3,1.17-2.41,2.47-2.45c3.12-0.08,6.33-0.12,9.45-0.12s6.33,0.04,9.45,0.12c1.3,0.04,2.43,1.15,2.47,2.45c0.08,1.93,0.11,3.87,0.11,5.8s-0.03,3.87-0.11,5.8c-0.04,1.3-1.17,2.41-2.47,2.45C18.37,18.8,15.16,18.84,12.04,18.84z M9.78,8.73l6.06,3.3l-6.06,3.3V8.73z" />
  </motion.svg>
);

// Premium ikonalar
export const PremiumCoinIcon = (props) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="url(#premium-gradient)"
    strokeWidth="1.5"
    className="w-6 h-6 neon-glow"
    whileHover={{ scale: 1.15, rotate: 15 }}
    whileTap={{ scale: 0.85 }}
    {...props}
  >
    <defs>
      <linearGradient id="premium-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#FF8C00', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
    <path d="M12.25 7.5a.75.75 0 00-1.5 0v8.63l-1.6-1.28a.75.75 0 00-.9.2l-.5 1a.75.75 0 00.9.9l2.5 2a.75.75 0 00.9 0l2.5-2a.75.75 0 00.9-.9l-.5-1a.75.75 0 00-.9-.2l-1.6 1.28V7.5z" />
  </motion.svg>
);

export const PremiumCheckIcon = (props) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="url(#premium-gradient)"
    strokeWidth="1.5"
    className="w-6 h-6 neon-glow"
    whileHover={{ scale: 1.15 }}
    whileTap={{ scale: 0.85 }}
    {...props}
  >
    <defs>
      <linearGradient id="premium-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#FF8C00', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
  </motion.svg>
);