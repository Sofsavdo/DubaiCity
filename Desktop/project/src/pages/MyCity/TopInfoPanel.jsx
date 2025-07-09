import React from 'react';
import { motion } from 'framer-motion';
import { formatNumberShort } from '../../utils/helpers';
import { CoinIcon } from '../../components/Icons';

const TopInfoPanel = ({ user, passiveIncome, isTapBoostActive, tapProfit, nextLevelText }) => {
  return (
    <motion.div
      className="grid grid-cols-3 gap-2 text-center w-full px-1 py-2 bg-gray-800/30 border border-gray-600/50 rounded-lg backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div className="flex-1" whileHover={{ scale: 1.02 }}>
        <p className="text-xs text-gray-400">Har bosishga</p>
        <div className="flex items-center justify-center gap-1">
          <CoinIcon className="w-3 h-3 text-yellow-400" />
          <p
            className={`text-sm font-bold ${
              isTapBoostActive ? 'text-purple-400 animate-pulse' : 'text-yellow-400'
            }`}
          >
            +{formatNumberShort(tapProfit || 0)}
          </p>
        </div>
      </motion.div>
      
      <motion.div className="flex-1 border-x border-white/10" whileHover={{ scale: 1.02 }}>
        <p className="text-xs text-gray-400">Keyingi daraja</p>
        <p className="text-sm font-bold text-white">{nextLevelText || '0'}</p>
      </motion.div>
      
      <motion.div className="flex-1" whileHover={{ scale: 1.02 }}>
        <p className="text-xs text-gray-400">Soatlik</p>
        <div className="flex items-center justify-center gap-1">
          <CoinIcon className="w-3 h-3 text-green-400" />
          <p className="text-sm font-bold text-green-400">
            +{formatNumberShort(Math.floor(passiveIncome * (user?.isPremium ? 1.5 : 1)) || 0)}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TopInfoPanel;