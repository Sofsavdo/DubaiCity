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
  
  const { endpoint, userId, period = '7d' } = req.query;
  
  try {
    switch (endpoint) {
      case 'user-stats':
        if (!userId) {
          return res.status(400).json({ error: 'User ID required' });
        }
        
        const userStats = await getUserAnalytics(parseInt(userId as string), period as string);
        res.json(userStats);
        break;
        
      case 'global-stats':
        const globalStats = await getGlobalAnalytics();
        res.json(globalStats);
        break;
        
      case 'revenue':
        const revenueStats = await getRevenueAnalytics(period as string);
        res.json(revenueStats);
        break;
        
      default:
        res.status(404).json({ error: 'Endpoint not found' });
    }
  } catch (error) {
    console.error('Analytics API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getUserAnalytics(userId: number, period: string) {
  const user = await storage.getUser(userId);
  const gameStats = await storage.getUserGameStats(userId);
  const businesses = await storage.getUserBusinesses(userId);
  const payments = await storage.getUserPayments(userId);
  
  if (!user || !gameStats) {
    throw new Error('User or stats not found');
  }
  
  const totalBusinessIncome = businesses.reduce((sum, b) => sum + b.income, 0);
  const totalSpent = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  
  return {
    user: {
      level: user.level,
      empire: user.empireTitle,
      coins: user.coins,
      energy: user.energy,
      premium: user.isPremium,
    },
    activity: {
      totalTaps: gameStats.totalTaps,
      totalCoinsEarned: gameStats.totalCoinsEarned,
      totalEnergyUsed: gameStats.totalEnergyUsed,
      playTimeMinutes: gameStats.playTimeMinutes,
      lastPlayed: gameStats.lastPlayedAt,
    },
    business: {
      totalBusinesses: businesses.length,
      totalIncome: totalBusinessIncome,
      businesses: businesses.map(b => ({
        type: b.type,
        level: b.level,
        income: b.income,
      })),
    },
    referrals: {
      count: user.referralCount,
      earnings: user.referralEarnings,
    },
    payments: {
      totalSpent,
      transactionCount: payments.filter(p => p.status === 'completed').length,
    },
  };
}

async function getGlobalAnalytics() {
  // Note: These would require proper aggregation queries in a real implementation
  // For now, returning structure that would be populated by database queries
  
  return {
    users: {
      total: 0,
      active: 0,
      premium: 0,
      newToday: 0,
    },
    gameplay: {
      totalTaps: 0,
      totalCoins: 0,
      averageLevel: 0,
      totalBusinesses: 0,
    },
    revenue: {
      totalRevenue: 0,
      transactionCount: 0,
      averageOrderValue: 0,
    },
    engagement: {
      dailyActiveUsers: 0,
      averageSessionTime: 0,
      retentionRate: 0,
    },
  };
}

async function getRevenueAnalytics(period: string) {
  return {
    period,
    totalRevenue: 0,
    transactionCount: 0,
    averageOrderValue: 0,
    topProducts: [],
    dailyBreakdown: [],
    conversionRate: 0,
  };
}
