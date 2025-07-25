import React, { useEffect, useRef, useState } from 'react';

const AdVideoModal = ({ show, onClose, onAdFinished }) => {
    const videoRef = useRef(null);
    const [countdown, setCountdown] = useState(5);
    const [isRewardReady, setIsRewardReady] = useState(false);
    const isProcessingRef = useRef(false);

    useEffect(() => {
        if (show) {
            console.log(`[AdVideoModal] MODAL OCHILDI, holat tozalanyapti. Vaqt: ${new Date().toLocaleTimeString()}`);
            
            // Boshlang'ich holatni o'rnatish
            setCountdown(5);
            setIsRewardReady(false);
            isProcessingRef.current = false;

            if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play().catch(error => console.log("Avtomatik video ijrosi bloklandi:", error));
            }

            console.log(`[AdVideoModal] Taymer (setInterval) ishga tushirilyapti...`);
            const intervalId = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        console.log(`[AdVideoModal] Taymer tugadi. Mukofot tayyorlanmoqda.`);
                        clearInterval(intervalId);
                        setIsRewardReady(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            // Komponent yopilganda intervalni tozalash
            return () => {
                console.log(`[AdVideoModal] useEffect tozalash funksiyasi ishga tushdi. Taymer tozalandi. Vaqt: ${new Date().toLocaleTimeString()}`);
                clearInterval(intervalId);
            };
        }
    }, [show]);

    const handleGetReward = () => {
        console.log(`[AdVideoModal] "Mukofotni olish" tugmasi bosildi. Vaqt: ${new Date().toLocaleTimeString()}`);
        
        if (isProcessingRef.current) {
            console.log(`[AdVideoModal] Qayta bosish bloklandi, jarayon allaqachon boshlangan.`);
            return; 
        }
        
        console.log(`[AdVideoModal] Mukofot berish jarayoni boshlandi (isProcessing=true).`);
        isProcessingRef.current = true;
        
        console.log(`[AdVideoModal] onAdFinished (app.jsx'dan) chaqirilyapti.`);
        onAdFinished();      
        
        console.log(`[AdVideoModal] onClose (oynani yopish) chaqirilyapti.`);
        onClose();           
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-slate-900 p-2 rounded-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <video
                    ref={videoRef}
                    width="100%"
                    onEnded={() => {
                        console.log(`[AdVideoModal] Video o'zi tugadi.`);
                        setIsRewardReady(true);
                    }}
                    playsInline
                    muted
                    className="rounded-lg"
                >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-futuristic-wireframe-tunnel-12914-large.mp4" type="video/mp4" />
                    Brauzeringiz videoni qo'llab-quvvatlamaydi.
                </video>
                <button 
                    onClick={handleGetReward} 
                    disabled={!isRewardReady}
                    className="w-full mt-2 bg-slate-700 text-sm py-2 rounded-lg hover:bg-slate-600 disabled:bg-slate-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
                >
                    {isRewardReady ? "Mukofotni olish" : `Iltimos, kuting... (${countdown})`}
                </button>
            </div>
        </div>
    );
};

export default AdVideoModal;