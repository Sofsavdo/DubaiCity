export interface GameUser {
  id: string;
  username: string;
  telegramId?: string;
  firstName?: string;
  lastName?: string;
  dubaiCoin: number;
  energy: number;
  maxEnergy: number;
  totalEarned: number;
  level: number;
  isPremium: boolean;
  premiumLevel?: number;
  autoRobotLevel: number;
  itemLevels: Record<string, number>;
  referrals: string[];
  taskStatus: Record<string, boolean>;
  claimedYoutubeTasks: number[];
  ownedPremiumAvatars: string[];
  dailyLoginStreak: number;
  lastDailyClaim: string | null;
  dailyAdWatches: number;
  lastAdWatchTimestamp: number | null;
  tapsToday: number;
  upgradesToday: number;
  gamesPlayedToday: number;
  dailyTapBoostsUsed: number;
  lastTapBoostTimestamp: number | null;
  activeTapBoostEnd: number | null;
  profilePicture: string;
  profilePictureUrl: string;
  promoCodes: PromoCodeEntry[];
  tradeHistory: TradeEntry[];
  selectedAvatar: string;
  selectedVehicle: string | null;
  selectedBuilding: string | null;
  lastOnlineTimestamp: number;
  totalDonated?: number;
}

export interface GameItem {
  id: string;
  name: string;
  category: string;
  type: 'energy' | 'income' | 'status' | 'robot' | 'energy_limit' | 'tap_power';
  baseCost: number;
  baseIncome?: number;
  description: string;
  usdPrice?: number;
  maxLevel?: number;
  icon?: string;
  isVisible?: boolean;
}

export interface PromoCodeEntry {
  id: number;
  partner: string;
  code: string;
  description: string;
  expiry: string;
  link: string;
  createdAt: number;
  used: boolean;
}

export interface TradeEntry {
  id: number;
  type: string;
  amount: number;
  timestamp: number;
  details: string;
}

export interface YoutubeTask {
  id: number;
  title: string;
  url: string;
  rewardAmount: number;
  validCodes: string[];
}

export interface GameData {
  user: GameUser;
  marketItems: GameItem[];
  offlineEarningsToClaim?: number;
  offlineEarningsShown?: boolean;
}

export interface InputModalConfig {
  title: string;
  placeholder: string;
  inputType: string;
  onConfirm: (value: string) => void;
}

export interface PaymentModalConfig {
  show: boolean;
  item: {
    name: string;
    usdPrice: number;
    onConfirm: () => void;
  } | null;
}

// Telegram Web App types
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        openInvoice: (url: string, callback: (status: string) => void) => void;
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
        };
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            username?: string;
            first_name?: string;
            last_name?: string;
            is_premium?: boolean;
          };
        };
      };
    };
  }
}