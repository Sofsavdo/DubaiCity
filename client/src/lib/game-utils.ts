import { EMPIRE_LEVELS } from "@shared/schema";

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function getCurrentLevel(experience: number) {
  const levels = [...EMPIRE_LEVELS].reverse();
  return levels.find(level => experience >= level.requiredXP) || EMPIRE_LEVELS[0];
}

export function getNextLevel(currentLevel: number) {
  return EMPIRE_LEVELS.find(level => level.level === currentLevel + 1);
}

export function getProgressPercentage(experience: number, level: number) {
  const currentLevelData = EMPIRE_LEVELS.find(l => l.level === level);
  const nextLevelData = EMPIRE_LEVELS.find(l => l.level === level + 1);
  
  if (!currentLevelData || !nextLevelData) return 100;
  
  const currentXP = experience - currentLevelData.requiredXP;
  const requiredXP = nextLevelData.requiredXP - currentLevelData.requiredXP;
  
  return Math.min(100, (currentXP / requiredXP) * 100);
}

export function getEnergyRefillTime(lastRefill: string, currentEnergy: number, maxEnergy: number): string {
  const now = new Date();
  const lastRefillTime = new Date(lastRefill);
  const minutesPassed = Math.floor((now.getTime() - lastRefillTime.getTime()) / (1000 * 60));
  
  const energyNeeded = maxEnergy - currentEnergy;
  const minutesNeeded = Math.max(0, energyNeeded - minutesPassed);
  
  if (minutesNeeded === 0) return "Full";
  
  const hours = Math.floor(minutesNeeded / 60);
  const minutes = minutesNeeded % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }
  return `${minutes}:00`;
}

export function generateReferralCode(telegramId: string): string {
  return `DC${telegramId.slice(-6)}`;
}

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type} show`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

export function createCoinAnimation(x: number, y: number, coins: number) {
  if (typeof document === 'undefined') return;
  
  const coinElement = document.createElement('div');
  coinElement.className = 'coin-animation';
  coinElement.innerHTML = `
    <div class="flex items-center text-yellow-400 font-bold">
      <i class="fas fa-coins mr-1"></i>
      +${coins}
    </div>
  `;
  
  coinElement.style.left = `${x}px`;
  coinElement.style.top = `${y}px`;
  
  try {
    document.body.appendChild(coinElement);
  } catch (error) {
    console.warn('Could not create coin animation:', error);
    return;
  }
  
  setTimeout(() => {
    try {
      if (document.body.contains(coinElement)) {
        document.body.removeChild(coinElement);
      }
    } catch (error) {
      console.warn('Could not remove coin animation:', error);
    }
  }, 1000);
}

export function vibrate(pattern: number | number[] = 50) {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch (error) {
    console.warn('Vibration not supported:', error);
  }
}
