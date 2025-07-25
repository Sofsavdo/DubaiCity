import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NavButton = ({ label, icon, active, onClick, badgeCount = 0 }) => {
  return (
    <motion.button
      className={`relative flex flex-col items-center py-2 px-1 rounded-xl transition-all duration-300 ${
        active 
          ? 'bg-gradient-to-br from-slate-700/80 to-slate-800/80 shadow-xl' 
          : 'hover:bg-slate-800/40'
      }`}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Active indicator line */}
      {active && (
        <motion.div
          className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
          layoutId="activeIndicator"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}

      {/* Icon container */}
      <motion.div
        className={`relative mb-1 p-2 rounded-lg transition-all ${
          active 
            ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-black shadow-lg' 
            : 'text-gray-400 hover:text-white'
        }`}
        animate={active ? {
          boxShadow: [
            "0 4px 15px rgba(251, 191, 36, 0.3)",
            "0 6px 25px rgba(251, 191, 36, 0.5)",
            "0 4px 15px rgba(251, 191, 36, 0.3)"
          ]
        } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <motion.div
          animate={active ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {icon}
        </motion.div>

        {/* Notification badge */}
        <AnimatePresence mode="wait">
          {badgeCount > 0 && (
            <motion.div
              className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center border-2 border-black"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
              whileHover={{ scale: 1.2 }}
            >
              <span className="text-xs font-bold text-white">
                {badgeCount > 9 ? '9+' : badgeCount}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Label */}
      <motion.span
        className={`text-xs font-medium transition-colors ${
          active ? 'text-white' : 'text-gray-500'
        }`}
        animate={active ? { 
          color: ['#ffffff', '#fbbf24', '#ffffff'],
          scale: [1, 1.05, 1]
        } : {}}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        {label}
      </motion.span>

      {/* Active background glow */}
      {active && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400/10 to-orange-500/10 pointer-events-none"
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.05, 1]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}
    </motion.button>
  );
};

export default NavButton;