import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNotifier } from '../../hooks/useNotifier';
import { formatNumberShort } from '../../utils/helpers';
import BalanceDisplay from '../../components/Common/BalanceDisplay';

const prizeIcons = ['💎', '👑', '🚗', '⛵️', '💰', '🌴'];
const winningLines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

const generateInitialIcons = () => {
    let initialIcons;
    let isAccidentalWin;
    do {
        isAccidentalWin = false;
        let iconPool = [...prizeIcons, ...prizeIcons, ...prizeIcons];
        iconPool.sort(() => 0.5 - Math.random());
        initialIcons = iconPool.slice(0, 9);
        for (const line of winningLines) {
            const [a, b, c] = line.map(i => initialIcons[i]);
            if (a === b && b === c) {
                isAccidentalWin = true;
                break;
            }
        }
    } while (isAccidentalWin);
    return initialIcons;
};

const ScratchCardGame = ({ user, setUser, onBack }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [gameState, setGameState] = useState('ready');
    const [prize, setPrize] = useState(0);
    const [icons, setIcons] = useState(generateInitialIcons);
    const [betAmount, setBetAmount] = useState(1000);
    const betIncrements = [1000, 2500, 5000, 10000, 25000, 50000];
    const [resultText, setResultText] = useState({ message: '', type: '' });
    const [winningLine, setWinningLine] = useState([]);
    const [scratchProgress, setScratchProgress] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const notifier = useNotifier();
    const [isRevealed, setIsRevealed] = useState(false);

    const changeBet = (direction) => {
        const currentIndex = betIncrements.indexOf(betAmount);
        if (direction === 'up' && currentIndex < betIncrements.length - 1) {
            setBetAmount(betIncrements[currentIndex + 1]);
        } else if (direction === 'down' && currentIndex > 0) {
            setBetAmount(betIncrements[currentIndex - 1]);
        }
    };

    const setupNewGame = useCallback(() => {
        setResultText({ message: '', type: '' });
        setWinningLine([]);
        setScratchProgress(0);
        setIsRevealed(false);
        setShowResult(false);

        if (user.dubaiCoin < betAmount) {
            notifier.addNotification("O'yin uchun mablag' yetarli emas!", "error");
            return;
        }
        
        setUser(prev => ({...prev, dubaiCoin: Math.floor(prev.dubaiCoin - betAmount)}));

        const isWin = Math.random() < 0.25; // 25% yutish ehtimoli
        let newIcons = Array(9).fill(null);

        if (isWin) {
            const winMultiplier = [5, 10, 15, 25, 50][Math.floor(Math.random() * 5)];
            const winPrize = Math.floor(betAmount * winMultiplier);
            setPrize(winPrize);
            const winIcon = prizeIcons[Math.floor(Math.random() * prizeIcons.length)];
            const winLineIndexes = winningLines[Math.floor(Math.random() * winningLines.length)];
            setWinningLine(winLineIndexes);
            winLineIndexes.forEach(index => { newIcons[index] = winIcon; });
            
            const remainingIcons = prizeIcons.filter(i => i !== winIcon);
            for (let i = 0; i < 9; i++) {
                if (newIcons[i] === null) newIcons[i] = remainingIcons[Math.floor(Math.random() * remainingIcons.length)];
            }
        } else {
            setPrize(0);
            newIcons = generateInitialIcons();
        }
        
        setIcons(newIcons);
        setGameState('playing');
        setIsRevealed(false);
        
    }, [user.dubaiCoin, setUser, betAmount, notifier]);

    useEffect(() => {
        if (gameState === 'playing') {
            const canvas = canvasRef.current;
            if (!canvas) return;
            canvas.style.opacity = 1;
            const ctx = canvas.getContext('2d');
            ctx.globalCompositeOperation = 'source-over';
            
            // Gradient background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#6366f1');
            gradient.addColorStop(1, '#8b5cf6');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.font = 'bold 20px Inter';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText("SCRATCH TO WIN", canvas.width / 2, canvas.height / 2);
        } else if (canvasRef.current) {
            canvasRef.current.style.opacity = 0;
        }
    }, [gameState]);

    const revealCard = useCallback(() => {
        if (gameState !== 'playing' || !canvasRef.current) return;
        
        setIsRevealed(true);
        
        if (prize > 0) {
            setUser(prev => ({
                ...prev, 
                dubaiCoin: Math.floor(prev.dubaiCoin + prize),
                totalEarned: Math.floor((prev.totalEarned || 0) + prize),
                gamesPlayedToday: (prev.gamesPlayedToday || 0) + 1,
            }));
            setResultText({ message: `YUTUQ: ${Math.floor(prize).toLocaleString('en-US').replace(/,/g, ' ')}!`, type: 'win' });
        } else {
            setResultText({ message: 'YUTQAZDINGIZ', type: 'loss' });
            setUser(prev => ({
                ...prev,
                gamesPlayedToday: (prev.gamesPlayedToday || 0) + 1,
            }));
        }
        setGameState('finished');
        setShowResult(true);
    }, [gameState, prize, setUser]);

    const getPos = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const onPointerDown = (e) => {
        e.preventDefault();
        if (gameState !== 'playing') return;
        setIsDrawing(true);
        const pos = getPos(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2);
        ctx.fill();
        
        // Progress tracking
        setScratchProgress(prev => Math.min(prev + 2, 100));
        
        // Auto reveal when enough scratched
        if (scratchProgress > 30 && !isRevealed) {
            setTimeout(revealCard, 500);
        }
    };

    const onPointerMove = (e) => {
        if (!isDrawing || gameState !== 'playing') return;
        const pos = getPos(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2);
        ctx.fill();
        
        // Progress tracking
        setScratchProgress(prev => Math.min(prev + 1, 100));
    };

    const onPointerUp = () => {
        setIsDrawing(false);
        // Instant reveal when finger is lifted and enough scratched
        if (gameState === 'playing' && scratchProgress > 15 && !isRevealed) {
            revealCard();
        }
    };
    
    return (
        <div className="p-3 z-10 relative pb-4 flex flex-col h-full bg-gradient-to-b from-gray-900 to-black">
            <button onClick={onBack} className="self-start mb-3 text-cyan-400 font-bold py-2 px-4 rounded-lg">
                ⬅️ Orqaga
            </button>
            
            {/* Balans yuqori qismda */}
            <div className="text-center mb-3">
                <BalanceDisplay user={user} size="medium" />
            </div>
            
            <h2 className="text-xl font-bold text-gradient-gold mb-3 text-center">🎫 Scratch Card</h2>
            
            <div className="relative w-72 h-72 mb-3 mx-auto" style={{
                filter: prize > 0 && isRevealed ? 'drop-shadow(0 0 20px gold)' : 
                        prize === 0 && isRevealed ? 'drop-shadow(0 0 20px red)' : 'none'
            }}>
                {/* Yutish effekti - yulduzchalar */}
                {prize > 0 && isRevealed && (
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute text-yellow-400 animate-ping"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 2}s`,
                                    fontSize: '20px'
                                }}
                            >
                                ⭐
                            </div>
                        ))}
                    </div>
                )}
                
                <div className={`absolute inset-0 grid grid-cols-3 gap-1 p-2 rounded-xl shadow-2xl transition-all duration-500 ${
                    prize > 0 && isRevealed ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                    prize === 0 && isRevealed ? 'bg-gradient-to-br from-red-500 to-red-700' :
                    'bg-gradient-to-br from-purple-600 to-blue-600'
                }`}>
                    {icons.map((icon, index) => (
                        <div key={index} className={`flex items-center justify-center text-3xl rounded-lg backdrop-blur-sm transition-all duration-500 ${
                            winningLine.includes(index) && prize > 0
                                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 animate-pulse shadow-lg ring-2 ring-yellow-300' 
                                : prize === 0 && isRevealed 
                                    ? 'bg-gray-500/30 grayscale opacity-50' 
                                    : prize > 0 && isRevealed
                                        ? 'bg-gray-500/30 grayscale opacity-50'
                                        : 'bg-white/20'
                        }`}>
                            <span className={`${
                                winningLine.includes(index) && prize > 0 
                                    ? 'filter brightness-125 drop-shadow-lg' 
                                    : prize > 0 && isRevealed && !winningLine.includes(index)
                                        ? 'filter grayscale opacity-50'
                                        : prize === 0 && isRevealed 
                                            ? 'filter grayscale opacity-50' 
                                            : ''
                            }`}>
                                {icon}
                            </span>
                        </div>
                    ))}
                </div>
                <canvas
                    ref={canvasRef}
                    width={288}
                    height={288}
                    className="absolute inset-0 cursor-pointer rounded-xl"
                    onMouseDown={onPointerDown}
                    onMouseMove={onPointerMove}
                    onMouseUp={onPointerUp}
                    onTouchStart={onPointerDown}
                    onTouchMove={onPointerMove}
                    onTouchEnd={onPointerUp}
                />
            </div>

            {/* Kichik natija ko'rsatkichi */}
            <div className="text-center mb-2 h-6">
                {isRevealed && (
                    <p className={`text-sm font-bold ${
                        prize > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                        {prize > 0 ? 'Yutdiz!' : 'Yutqazdiz!'}
                    </p>
                )}
            </div>
            
            <div className="flex items-center gap-3 mb-3 justify-center">
                <button onClick={() => changeBet('down')} disabled={betAmount <= betIncrements[0]} className="bg-slate-700 hover:bg-slate-600 font-bold px-3 py-1 rounded-md disabled:opacity-50">-</button>
                <span className="font-bold text-lg">{Math.floor(betAmount).toLocaleString('en-US').replace(/,/g, ' ')}</span>
                <button onClick={() => changeBet('up')} disabled={betAmount >= betIncrements[betIncrements.length - 1]} className="bg-slate-700 hover:bg-slate-600 font-bold px-3 py-1 rounded-md disabled:opacity-50">+</button>
            </div>

            <div className="text-center">
                <button 
                onClick={setupNewGame} 
                disabled={gameState === 'playing' || user.dubaiCoin < betAmount}
                className="bg-gradient-to-br from-green-500 to-green-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {gameState === 'ready' ? 'O\'yinni Boshlash' : gameState === 'playing' ? 'O\'yin davom etmoqda...' : 'Yana O\'ynash'}
                </button>
            </div>
        </div>
    );
};

export default ScratchCardGame;