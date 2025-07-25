import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import cors from 'cors';

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://dubai-city-lilac.vercel.app', 'https://t.me']
    : ['http://localhost:5000', 'http://localhost:3000'],
  credentials: true,
};

const corsMiddleware = cors(corsOptions);

function runMiddleware(req: VercelRequest, res: VercelResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await runMiddleware(req, res, corsMiddleware);
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { type = 'coins', limit = '100', userId } = req.query;
  
  try {
    const leaderboard = await getLeaderboard(type as string, parseInt(limit as string), userId as string);
    res.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getLeaderboard(type: string, limit: number, userId?: string) {
  // Note: This would require proper database queries with ordering and ranking
  // For now, returning the structure that would be populated
  
  const leaderboardTypes = {
    coins: 'Total Coins',
    level: 'Highest Level',
    referrals: 'Most Referrals',
    taps: 'Total Taps',
    businesses: 'Business Empire',
  };
  
  if (!leaderboardTypes[type as keyof typeof leaderboardTypes]) {
    throw new Error('Invalid leaderboard type');
  }
  
  // In a real implementation, this would be a database query like:
  // SELECT users.*, game_stats.* FROM users 
  // LEFT JOIN game_stats ON users.id = game_stats.user_id
  // ORDER BY [type field] DESC LIMIT [limit]
  
  const mockLeaderboard = {
    type,
    title: leaderboardTypes[type as keyof typeof leaderboardTypes],
    lastUpdated: new Date().toISOString(),
    userRank: userId ? await getUserRank(userId, type) : null,
    entries: [] as any[], // Would be populated from database
    pagination: {
      total: 0,
      limit,
      offset: 0,
    },
  };
  
  return mockLeaderboard;
}

async function getUserRank(userId: string, type: string): Promise<{ rank: number; value: number } | null> {
  try {
    const user = await storage.getUserByTelegramId(userId);
    if (!user) return null;
    
    const gameStats = await storage.getUserGameStats(user.id);
    
    // Calculate user's rank and value based on type
    let value = 0;
    switch (type) {
      case 'coins':
        value = user.coins;
        break;
      case 'level':
        value = user.level;
        break;
      case 'referrals':
        value = user.referralCount;
        break;
      case 'taps':
        value = gameStats?.totalTaps || 0;
        break;
      case 'businesses':
        const businesses = await storage.getUserBusinesses(user.id);
        value = businesses.length;
        break;
    }
    
    // In a real implementation, this would be a database query to count users with higher values
    const rank = 1; // Placeholder
    
    return { rank, value };
  } catch (error) {
    console.error('Error getting user rank:', error);
    return null;
  }
}
