import React from 'react';
import { motion } from 'framer-motion';
import { formatNumberShort, formatNumberFull } from '../../utils/helpers';
import { CoinIcon } from '../Icons';

const BalanceDisplay = ({ user, size = 'normal', showIcon = true }) => {
  if (!user) return null;

  return (
    <motion.div
      className="bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-xl p-3 border border-amber-500/30 shadow-xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between">
        {/* Main Balance */}
        <div className="flex items-center space-x-3">
          <motion.div
            className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg"
            animate={{ 
              rotate: [0, 5, -5, 0],
              boxShadow: [
                "0 4px 20px rgba(251, 191, 36, 0.4)",
                "0 6px 30px rgba(251, 191, 36, 0.6)",
                "0 4px 20px rgba(251, 191, 36, 0.4)"
              ]
            }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <CoinIcon className="w-6 h-6 text-black" />
          </motion.div>
          
          <div>
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
            >
              <motion.h1
                className={`${size === 'small' ? 'text-sm' : 'text-xl'} font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 bg-clip-text text-transparent`}
                animate={{ 
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{ repeat: Infinity, duration: 3 }}
                style={{ backgroundSize: "200% auto" }}
              >
                {formatNumberFull(user.dubaiCoin || 0)}
              </motion.h1>
              <motion.span
                className="text-sm text-amber-400 font-medium"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                DC
              </motion.span>
            </motion.div>
            {size !== 'small' && (
              <p className="text-xs text-gray-400">
                Jami: {formatNumberFull(user.totalEarned || 0)}
              </p>
            )}
          </div>
        </div>

        {/* Premium Badge */}
        {user.isPremium && (
          <motion.div
            className="bg-gradient-to-r from-purple-600 to-pink-600 px-2 py-1 rounded-lg shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center space-x-1">
              <motion.span
                className="text-sm"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                👑
              </motion.span>
              <div className="text-xs font-medium text-white">
                <div>VIP</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Stats Row */}
      <motion.div
        className="mt-2 pt-2 border-t border-slate-600/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <motion.p 
              className="text-sm font-bold text-blue-400"
              whileHover={{ scale: 1.1 }}
            >
              {user.level || 1}
            </motion.p>
            <p className="text-xs text-gray-500">Daraja</p>
          </div>
          <div>
            <motion.p 
              className="text-sm font-bold text-green-400"
              whileHover={{ scale: 1.1 }}
            >
              {user.tapsToday || 0}
            </motion.p>
            <p className="text-xs text-gray-500">Bugungi tap</p>
          </div>
          <div>
            <motion.p 
              className="text-sm font-bold text-purple-400"
              whileHover={{ scale: 1.1 }}
            >
              {user.referrals?.length || 0}
            </motion.p>
            <p className="text-xs text-gray-500">Do'stlar</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BalanceDisplay;