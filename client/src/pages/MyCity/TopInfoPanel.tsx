import React from 'react';
import { motion } from 'framer-motion';
import { formatNumberShort, formatNumberFull } from '../../utils/helpers';
import { CoinIcon } from '../../components/Icons';

const TopInfoPanel = ({ user, passiveIncome, isTapBoostActive, tapProfit, nextLevelText }) => {
  return (
    <motion.div
      className="bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-xl p-2 border border-amber-500/20 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-3 gap-2">
        {/* Tap Power */}
        <motion.div 
          className="text-center group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div 
            className="mb-1 mx-auto w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg"
            animate={isTapBoostActive ? { 
              scale: [1, 1.1, 1],
              boxShadow: [
                "0 4px 20px rgba(251, 191, 36, 0.3)",
                "0 4px 30px rgba(251, 191, 36, 0.6)",
                "0 4px 20px rgba(251, 191, 36, 0.3)"
              ]
            } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <motion.span 
              className="text-sm"
              animate={isTapBoostActive ? { rotate: [0, 10, -10, 0] } : {}}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              👆
            </motion.span>
          </motion.div>
          <p className="text-xs text-gray-400 mb-1">Har bosishga</p>
          <div className="flex items-center justify-center gap-1">
            <CoinIcon className="w-3 h-3 text-amber-400" />
            <motion.p
              className={`text-sm font-bold ${
                isTapBoostActive ? 'text-purple-400' : 'text-amber-400'
              }`}
              animate={isTapBoostActive ? { 
                scale: [1, 1.1, 1],
                textShadow: [
                  "0 0 10px rgba(168, 85, 247, 0.5)",
                  "0 0 20px rgba(168, 85, 247, 0.8)",
                  "0 0 10px rgba(168, 85, 247, 0.5)"
                ]
              } : {}}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              +{formatNumberFull(tapProfit || 0)}
            </motion.p>
          </div>
          {isTapBoostActive && (
            <motion.div
              className="text-xs text-purple-400 font-medium mt-1"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              🚀 BOOST!
            </motion.div>
          )}
        </motion.div>

        {/* Next Level */}
        <motion.div 
          className="text-center border-x border-white/10 px-1 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div 
            className="mb-1 mx-auto w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg"
            whileHover={{ 
              boxShadow: "0 8px 25px rgba(59, 130, 246, 0.5)",
              scale: 1.1 
            }}
          >
            <span className="text-sm">🎯</span>
          </motion.div>
          <p className="text-xs text-gray-400 mb-1">Keyingi daraja</p>
          <motion.p 
            className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            whileHover={{ scale: 1.1 }}
          >
            {nextLevelText || '0'}
          </motion.p>
          <div className="text-xs text-blue-400">Qolgan</div>
        </motion.div>

        {/* Passive Income */}
        <motion.div 
          className="text-center group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div 
            className="mb-1 mx-auto w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg"
            animate={{ 
              rotate: [0, 5, -5, 0],
              boxShadow: [
                "0 4px 20px rgba(34, 197, 94, 0.3)",
                "0 4px 30px rgba(34, 197, 94, 0.5)",
                "0 4px 20px rgba(34, 197, 94, 0.3)"
              ]
            }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <span className="text-sm">💰</span>
          </motion.div>
          <p className="text-xs text-gray-400 mb-1">Soatlik</p>
          <div className="flex items-center justify-center gap-1">
            <CoinIcon className="w-3 h-3 text-green-400" />
            <motion.p 
              className="text-sm font-bold text-green-400"
              animate={{ 
                scale: [1, 1.05, 1],
                textShadow: [
                  "0 0 10px rgba(34, 197, 94, 0.3)",
                  "0 0 15px rgba(34, 197, 94, 0.6)",
                  "0 0 10px rgba(34, 197, 94, 0.3)"
                ]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              +{formatNumberFull(Math.floor(passiveIncome * (user?.isPremium ? 1.5 : 1)) || 0)}
            </motion.p>
          </div>
          {user?.isPremium && (
            <motion.div
              className="text-xs text-amber-400 font-medium mt-1"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              👑 +50%
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Premium Benefits Bar */}
      {user?.isPremium && (
        <motion.div
          className="mt-2 pt-2 border-t border-amber-500/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-center space-x-2 text-xs">
            <motion.div 
              className="flex items-center space-x-1 text-amber-400"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <span>👑</span>
              <span className="font-medium text-xs">Premium</span>
            </motion.div>
            <div className="w-px h-3 bg-amber-500/30"></div>
            <div className="text-green-400 font-medium text-xs">+50%</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TopInfoPanel;