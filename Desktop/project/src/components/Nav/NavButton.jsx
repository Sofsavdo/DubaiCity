import React from 'react';
import { motion } from 'framer-motion';

const NavButton = React.memo(({ icon, label, active, onClick, badgeCount }) => (
  <motion.button
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center py-2 text-xs font-medium transition-all duration-300 relative ${
      active ? 'text-yellow-300 neon-text' : 'text-gray-400 hover:text-white'
    }`}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
  >
    {icon || <div className="w-6 h-6" />}
    <span className="text-[10px] mt-1">{label || 'Tab'}</span>
    {badgeCount > 0 && (
      <motion.span
        className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center neon-glow"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {badgeCount}
      </motion.span>
    )}
  </motion.button>
));

export default NavButton;