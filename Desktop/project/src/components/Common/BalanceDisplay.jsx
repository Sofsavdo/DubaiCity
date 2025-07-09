import React from 'react';

const formatBalanceDisplay = (amount) => {
  return Math.floor(amount || 0).toLocaleString('en-US').replace(/,/g, ' ');
};

const BalanceDisplay = ({ user, size = 'large', showIcon = true }) => (
  <div className="flex justify-center items-center gap-2 my-2">
    {showIcon && <img src="https://i.ibb.co/3k3h1yM/Remove-bg-ai-1719598284643.png" className="w-9 h-9 sm:w-10 sm:h-10" alt="DubaiCoin"/>}
    <p className={`font-bold text-white ${size === 'large' ? 'text-5xl sm:text-6xl' : size === 'medium' ? 'text-3xl' : size === 'small' ? 'text-lg' : 'text-xl'}`}>
      {formatBalanceDisplay(Math.floor(user.dubaiCoin || 0))}
    </p>
  </div>
);

export default BalanceDisplay;