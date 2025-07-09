import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNotifier } from '../../hooks/useNotifier';
import { formatNumberShort } from '../../utils/helpers';
import BalanceDisplay from '../../components/Common/BalanceDisplay';

const ActiveBetRow = ({ bet, currentPrice }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const updateTimer = () => {
            const remaining = Math.max(0, Math.round((bet.endTime - Date.now()) / 1000));
            setTimeLeft(remaining);
        };
        updateTimer();
        const timerInterval = setInterval(updateTimer, 1000);
        return () => clearInterval(timerInterval);
    }, [bet.endTime]);

    const RealTimeProfitDisplay = useCallback(() => {
        const isWinning = (bet.direction === 'up' && currentPrice > bet.startPrice) || (bet.direction === 'down' && currentPrice < bet.startPrice);
        const isPush = currentPrice === bet.startPrice;

        let pnl = 0;
        if (isWinning) pnl = bet.amount * 0.8;
        else if (!isPush) pnl = -bet.amount;
        
        const pnlText = pnl >= 0 ? `+${formatNumberShort(pnl)}` : formatNumberShort(pnl);
        const textColor = pnl > 0 ? 'text-green-400' : pnl < 0 ? 'text-red-400' : 'text-gray-400';

        return <span className={`font-bold ${textColor}`}>{pnlText}</span>;
    }, [currentPrice, bet]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    return (
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-2 flex items-center justify-between text-sm">
            <span className={`w-1/4 text-center font-bold ${bet.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>{bet.direction === 'up' ? 'BUY' : 'SELL'}</span>
            <span className="w-1/4 text-center">{formatNumberShort(bet.amount)}</span>
            <span className="w-1/4 text-center font-mono">{formatTime(timeLeft)}</span>
            <div className="w-1/4 text-center">
                <RealTimeProfitDisplay />
            </div>
        </div>
    );
};

const Birja = ({ user, setUser, exchangeRate, handleUpdateHistory }) => {
    const canvasRef = useRef(null);
    const dataPoints = 100;
    const livePriceIndex = dataPoints - 1;
    const priceUpdateInterval = 1500;

    const [priceData, setPriceData] = useState(() => {
        let data = [];
        let currentPrice = exchangeRate || 0.00015;
        for (let i = 0; i < dataPoints; i++) {
            data.push(currentPrice);
            currentPrice *= 1 + (Math.random() - 0.5) * 0.05;
        }
        return data;
    });

    const [currentPrice, setCurrentPrice] = useState(priceData[livePriceIndex]);
    const [activeBets, setActiveBets] = useState([]);
    const [historyTab, setHistoryTab] = useState('active');
    const [timeframe, setTimeframe] = useState(60);
    const [betAmount, setBetAmount] = useState(1000);
    const notifier = useNotifier();

    // Narxni yangilab turish uchun useEffect
    useEffect(() => {
        const priceInterval = setInterval(() => {
            setPriceData(prevData => {
                const newPrice = prevData[prevData.length - 1] * (1 + (Math.random() - 0.49) * 0.08);
                const newData = [...prevData.slice(1), newPrice];
                setCurrentPrice(newPrice);
                return newData;
            });
        }, priceUpdateInterval);
        return () => clearInterval(priceInterval);
    }, []);

    const betsRef = useRef(activeBets);
    useEffect(() => {
        betsRef.current = activeBets;
    }, [activeBets]);

    const priceRef = useRef(currentPrice);
    useEffect(() => {
        priceRef.current = currentPrice;
    }, [currentPrice]);

    useEffect(() => {
        const checkBetsInterval = setInterval(() => {
            const now = Date.now();
            const currentActiveBets = betsRef.current;
            let betsToResolve = currentActiveBets.filter(bet => now >= bet.endTime);

            if (betsToResolve.length > 0) {
                let totalCoinChange = 0;
                
                betsToResolve.forEach(bet => {
                    let outcome, pnl;
                    const finalPrice = priceRef.current;

                    if ((finalPrice > bet.startPrice && bet.direction === 'up') || (finalPrice < bet.startPrice && bet.direction === 'down')) {
                        outcome = 'win';
                        pnl = bet.amount * 0.8;
                        totalCoinChange += bet.amount + pnl;
                    } else if (finalPrice === bet.startPrice) {
                        outcome = 'push';
                        pnl = 0;
                        totalCoinChange += bet.amount;
                    } else {
                        outcome = 'loss';
                        pnl = -bet.amount;
                    }
                    handleUpdateHistory({ id: bet.id, direction: bet.direction, amount: bet.amount, outcome, pnl });
                });
                
                if(totalCoinChange > 0) {
                    setUser(u => ({...u, dubaiCoin: u.dubaiCoin + totalCoinChange}));
                }
                
                setActiveBets(prev => prev.filter(bet => !betsToResolve.find(b => b.id === bet.id)));
            }
        }, 1000);

        return () => clearInterval(checkBetsInterval);
    }, [setUser, handleUpdateHistory]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        const drawChart = () => {
            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);
            const maxPrice = Math.max(...priceData);
            const minPrice = Math.min(...priceData);
            const priceRange = maxPrice - minPrice === 0 ? maxPrice * 0.1 : maxPrice - minPrice;
            const paddingLeft = 5, paddingRight = 5, yAxisWidth = 55;
            const chartDrawingAreaWidth = width - yAxisWidth - paddingLeft - paddingRight;
            const getX = (index) => paddingLeft + (index / (dataPoints - 1)) * chartDrawingAreaWidth;
            const getY = (price) => height - ((price - minPrice) / priceRange) * (height - 20) - 10;
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = '10px Inter';
            ctx.textAlign = 'right';
            for (let i = 0; i <= 5; i++) {
                const price = minPrice + (priceRange / 5) * i;
                const y = getY(price);
                ctx.fillText(price.toFixed(6), width - paddingRight, y + 3);
            }
            for (let i = 0; i <= 5; i++) {
                 const y = getY(minPrice + (priceRange / 5) * i);
                 ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                 ctx.beginPath();
                 ctx.moveTo(paddingLeft, y);
                 ctx.lineTo(paddingLeft + chartDrawingAreaWidth, y);
                 ctx.stroke();
            }

            ctx.beginPath();
            ctx.moveTo(getX(0), getY(priceData[0]));
            for (let i = 1; i < priceData.length; i++) {
                ctx.lineTo(getX(i), getY(priceData[i]));
            }
            ctx.strokeStyle = currentPrice >= priceData[priceData.length - 2] ? '#22c55e' : '#ef4444';
            ctx.lineWidth = 2;
            ctx.stroke();

            const liveX = getX(livePriceIndex);
            const liveY = getY(currentPrice);
            ctx.fillStyle = ctx.strokeStyle;
            ctx.beginPath();
            ctx.arc(liveX, liveY, 4, 0, Math.PI * 2);
            ctx.fill();

            activeBets.forEach(bet => {
                const startY = getY(bet.startPrice);
                ctx.strokeStyle = bet.direction === 'up' ? 'rgba(34, 197, 94, 0.7)' : 'rgba(239, 68, 68, 0.7)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(getX(0), startY); 
                ctx.lineTo(width, startY);
                ctx.stroke();
            });
        };
        drawChart();
    }, [priceData, activeBets, currentPrice]);

    const handlePlaceBet = (direction) => {
        if (user.dubaiCoin < betAmount) {
            notifier.addNotification("Tikish uchun mablag' yetarli emas!", "error");
            return;
        }
        setUser(u => ({...u, dubaiCoin: u.dubaiCoin - betAmount}));
        const now = Date.now();
        const newBet = { id: now, amount: betAmount, direction, startTime: now, endTime: now + timeframe * 1000, startPrice: currentPrice };
        setActiveBets(prev => [...prev, newBet]);
    };
    
    const handleBetAmountChange = (multiplier) => {
        setBetAmount(prev => {
            const newAmount = prev * multiplier;
            if (newAmount < 1000) return 1000;
            if (newAmount > 1000000) return 1000000;
            return newAmount;
        });
    };

    return (
        <div className="p-2 z-10 relative flex flex-col h-full">
            <div className="flex-grow overflow-y-auto custom-scrollbar">
                {/* Kattalashtrilgan Chart */}
                <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-800/50 border border-gray-600 p-1 relative mb-1">
                    <canvas ref={canvasRef} className="w-full h-full"></canvas>
                </div>

                {/* Savdo paneli */}
                <div className="space-y-1 flex-shrink-0">
                    <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-2 flex justify-between items-center">
                        <button onClick={() => handleBetAmountChange(0.5)} className="bg-gray-700 hover:bg-gray-600 font-bold px-2 py-1 rounded text-xs disabled:opacity-50" disabled={betAmount <= 1000}>/2</button>
                        <span className="font-bold text-xs">{formatNumberShort(betAmount)}</span>
                        <button onClick={() => handleBetAmountChange(2)} className="bg-gray-700 hover:bg-gray-600 font-bold px-2 py-1 rounded text-xs disabled:opacity-50" disabled={betAmount >= 1000000}>x2</button>
                    </div>
                    
                    {/* Timeframe va Buy/Sell tugmalari */}
                    <div className="grid grid-cols-2 gap-1">
                        <button onClick={() => setTimeframe(60)} className={`py-2 rounded text-xs font-bold transition-colors ${timeframe === 60 ? 'bg-blue-600' : 'bg-gray-700'}`}>1 min</button>
                        <button onClick={() => setTimeframe(120)} className={`py-2 rounded text-xs font-bold transition-colors ${timeframe === 120 ? 'bg-blue-600' : 'bg-gray-700'}`}>2 min</button>
                        <button onClick={() => handlePlaceBet('up')} className="py-2 rounded bg-green-500/80 hover:bg-green-500 text-white font-bold transition-colors text-xs">BUY</button>
                        <button onClick={() => handlePlaceBet('down')} className="py-2 rounded bg-red-500/80 hover:bg-red-500 text-white font-bold transition-colors text-xs">SELL</button>
                    </div>
                </div>

                {/* Tablar */}
                <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-1 flex mt-1 flex-shrink-0">
                    <button onClick={() => setHistoryTab('active')} className={`flex-1 rounded py-1 text-xs font-bold transition-colors ${historyTab === 'active' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}>
                        Aktiv ({activeBets.length})
                    </button>
                    <button onClick={() => setHistoryTab('completed')} className={`flex-1 rounded py-1 text-xs font-bold transition-colors ${historyTab === 'completed' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}>
                        Tarix
                    </button>
                </div>
                
                <div className="mt-1 flex-grow overflow-y-auto custom-scrollbar">
                    {historyTab === 'active' && (
                        <div className="space-y-1">
                            <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-2 text-xs text-gray-400 flex justify-between">
                                <span className="w-1/4 text-center">Amaliyot</span>
                                <span className="w-1/4 text-center">Summa</span>
                                <span className="w-1/4 text-center">Vaqt</span>
                                <span className="w-1/4 text-center">Prognoz</span>
                            </div>
                            {activeBets.length > 0 ? activeBets.map(bet => (
                                <ActiveBetRow key={bet.id} bet={bet} currentPrice={currentPrice} />
                            )) : <p className="text-gray-500 text-center pt-4 text-xs">Aktiv garovlar yo'q.</p>}
                        </div>
                    )}
                    {historyTab === 'completed' && (
                        <div className="space-y-1">
                            <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-2 text-xs text-gray-400 flex justify-between">
                                <span className="w-1/3 text-center">Amaliyot</span>
                                <span className="w-1/3 text-center">Summa</span>
                                <span className="w-1/3 text-center">Natija</span>
                            </div>
                            {user.tradeHistory && user.tradeHistory.length > 0 ? user.tradeHistory.map(trade => (
                                <div key={trade.id} className="bg-gray-800/50 border border-gray-600 rounded-lg p-2 flex items-center justify-between text-xs">
                                    <span className={`w-1/3 text-center font-bold ${trade.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>{trade.direction === 'up' ? 'BUY' : 'SELL'}</span>
                                    <span className="w-1/3 text-center">{formatNumberShort(trade.amount)}</span>
                                    <span className={`w-1/3 text-center font-bold ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {trade.pnl >= 0 ? '+' : ''}{formatNumberShort(trade.pnl)}
                                    </span>
                                </div>
                            )) : <p className="text-gray-500 text-center pt-4 text-xs">Tarix bo'sh.</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Birja;