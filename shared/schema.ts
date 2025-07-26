export interface User {
  id: number;
  username: string;
  dubaiCoin: number;
  level: number;
  totalEarned: number;
  profilePictureUrl?: string;
  isPremium: boolean;
}

export interface GameData {
  user: User;
  leaderboard: User[];
}