
import React, { useState, useEffect } from 'react';

interface LimitedTimeEventProps {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

const LimitedTimeEvent: React.FC<LimitedTimeEventProps> = ({ user, setUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Event har 6 soatda 2 soat davom etadi
    const now = new Date().getTime();
    const sixHours = 6 * 60 * 60 * 1000;
    const twoHours = 2 * 60 * 60 * 1000;
    
    const cycleTime = now % sixHours;
    
    if (cycleTime < twoHours) {
      setIsActive(true);
      setTimeLeft(twoHours - cycleTime);
    } else {
      setIsActive(false);
      setTimeLeft(sixHours - cycleTime);
    }

    const timer = setInterval(() => {
      const newNow = new Date().getTime();
      const newCycleTime = newNow % sixHours;
      
      if (newCycleTime < twoHours) {
        setIsActive(true);
        setTimeLeft(twoHours - newCycleTime);
      } else {
        setIsActive(false);
        setTimeLeft(sixHours - newCycleTime);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isActive) {
    return (
      <div className="bg-gray-800 rounded-xl p-4 mb-4 border border-gray-700">
        <div className="text-center">
          <h3 className="text-gray-400 font-bold">⏰ Keyingi Boost Event</h3>
          <p className="text-gray-500">{formatTime(timeLeft)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 mb-4 animate-pulse">
      <div className="text-center">
        <h3 className="text-white font-bold text-lg">🔥 2X Coin Boost Faol!</h3>
        <p className="text-purple-100">Barcha tap va vazifalardan 2x coin!</p>
        <p className="text-yellow-300 font-bold">{formatTime(timeLeft)}</p>
      </div>
    </div>
  );
};

export default LimitedTimeEvent;
