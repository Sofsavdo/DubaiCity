import { motion } from 'framer-motion';
import { formatNumberShort, formatNumberFull } from '@/utils/helpers';
import { CoinIcon } from '../Icons';

interface TopHeaderProps {
  user: any;
  currentLevel: number;
  currentLevelName: string;
  tapProfit: number;
  passiveIncome: number;
  showExchangeRates?: boolean;
  exchangeRates?: {
    usd: number;
    eur: number;
    rub: number;
  };
}

export function TopHeader({ 
  user, 
  currentLevel, 
  currentLevelName, 
  tapProfit, 
  passiveIncome,
  showExchangeRates = false,
  exchangeRates
}: TopHeaderProps) {
  return (
    <div className="relative z-10 px-4 pt-2 pb-2 flex-shrink-0">
      {/* Profile Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-lg">🐹</span>
          </div>
          <div>
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg px-3 py-1">
              <span className="text-black font-bold text-sm">{currentLevelName} (CEO)</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-amber-500 rounded-lg p-2 flex items-center">
            <span className="text-black font-bold text-sm">💎 Binance</span>
          </div>
          <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">⚙️</span>
          </div>
        </div>
      </div>

      {/* Stats Row - Three sections exactly like Hamster Kombat */}
      <div className="bg-gray-800/60 rounded-2xl p-3 mb-3">
        {showExchangeRates && exchangeRates ? (
          /* Exchange Rates for Assets section */
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-green-400 font-bold text-sm mb-1">
                ${exchangeRates.usd.toFixed(4)}
              </div>
              <p className="text-xs text-gray-400">USD</p>
            </div>
            <div>
              <div className="text-blue-400 font-bold text-sm mb-1">
                €{exchangeRates.eur.toFixed(4)}
              </div>
              <p className="text-xs text-gray-400">EUR</p>
            </div>
            <div>
              <div className="text-yellow-400 font-bold text-sm mb-1">
                ₽{exchangeRates.rub.toFixed(2)}
              </div>
              <p className="text-xs text-gray-400">RUB</p>
            </div>
          </div>
        ) : (
          /* Default stats for other sections */
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center mb-1">
                <CoinIcon className="w-4 h-4 text-amber-400 mr-1" />
                <span className="text-amber-400 font-bold text-sm">+{Math.floor(tapProfit || 0)}</span>
              </div>
              <p className="text-xs text-gray-400">Tap +</p>
            </div>
            <div>
              <div className="text-white font-bold text-lg mb-1">+{Math.floor(passiveIncome || 0)}</div>
              <p className="text-xs text-blue-400">Soatlik</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-1">
                <CoinIcon className="w-4 h-4 text-amber-400 mr-1" />
                <span className="text-amber-400 font-bold text-sm">{Math.floor(user.dubaiCoin || 0)}</span>
              </div>
              <p className="text-xs text-gray-400">Balans</p>
            </div>
          </div>
        )}
      </div>

      {/* Large Balance Display */}
      <div className="text-center mb-2">
        <div className="flex items-center justify-center gap-2">
          <motion.div
            animate={{ 
              rotate: [0, 360],
            }}
            transition={{ 
              rotate: { repeat: Infinity, duration: 4, ease: "linear" }
            }}
          >
            <CoinIcon className="w-6 h-6 text-amber-400" />
          </motion.div>
          <motion.h1 
            className="text-3xl font-bold text-white"
            animate={{ 
              textShadow: [
                "0 0 20px rgba(251, 191, 36, 0.3)",
                "0 0 30px rgba(251, 191, 36, 0.5)",
                "0 0 20px rgba(251, 191, 36, 0.3)"
              ]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {formatNumberFull(user.dubaiCoin || 0)}
          </motion.h1>
        </div>
      </div>
    </div>
  );
}