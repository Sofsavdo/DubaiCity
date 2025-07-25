import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { EMPIRE_LEVELS, BUSINESS_TYPES, DAILY_REWARDS } from '@shared/schema';
import cors from 'cors';

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://dubai-city-lilac.vercel.app', 'https://t.me']
    : ['http://localhost:5000', 'http://localhost:3000'],
  credentials: true,
};

// Apply CORS middleware
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
  
  const { method, query } = req;
  const endpoint = query.endpoint as string;
  
  try {
    switch (method) {
      case 'GET':
        await handleGET(req, res, endpoint);
        break;
      case 'POST':
        await handlePOST(req, res, endpoint);
        break;
      case 'PUT':
        await handlePUT(req, res, endpoint);
        break;
      case 'DELETE':
        await handleDELETE(req, res, endpoint);
        break;
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Game API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGET(req: VercelRequest, res: VercelResponse, endpoint: string) {
  const { telegramId, userId } = req.query;
  
  switch (endpoint) {
    case 'user':
      if (!telegramId) {
        return res.status(400).json({ error: 'Telegram ID required' });
      }
      
      const user = await storage.getUserByTelegramId(telegramId as string);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
      break;
      
    case 'businesses':
      if (!userId) {
        return res.status(400).json({ error: 'User ID required' });
      }
      
      const businesses = await storage.getUserBusinesses(parseInt(userId as string));
      res.json(businesses);
      break;
      
    case 'daily-rewards':
      if (!userId) {
        return res.status(400).json({ error: 'User ID required' });
      }
      
      const rewards = await storage.getUserDailyRewards(parseInt(userId as string));
      res.json(rewards);
      break;
      
    case 'tasks':
      if (!userId) {
        return res.status(400).json({ error: 'User ID required' });
      }
      
      const tasks = await storage.getUserTasks(parseInt(userId as string));
      res.json(tasks);
      break;
      
    case 'game-stats':
      if (!userId) {
        return res.status(400).json({ error: 'User ID required' });
      }
      
      const gameStats = await storage.getUserGameStats(parseInt(userId as string));
      res.json(gameStats);
      break;
      
    case 'leaderboard':
      // Implementation for leaderboard
      const topUsers = await getLeaderboard();
      res.json(topUsers);
      break;
      
    default:
      res.status(404).json({ error: 'Endpoint not found' });
  }
}

async function handlePOST(req: VercelRequest, res: VercelResponse, endpoint: string) {
  const body = req.body;
  
  switch (endpoint) {
    case 'user':
      const userData = body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByTelegramId(userData.telegramId);
      if (existingUser) {
        return res.json(existingUser);
      }
      
      // Handle referral bonus
      if (userData.referredBy) {
        const referrer = await storage.getUserByTelegramId(userData.referredBy);
        if (referrer) {
          await storage.updateUser(referrer.id, {
            referralCount: referrer.referralCount + 1,
            referralEarnings: referrer.referralEarnings + 5000,
            coins: referrer.coins + 5000,
          });
          userData.coins = (userData.coins || 1000) + 2000; // Bonus for new user
        }
      }
      
      const user = await storage.createUser(userData);
      
      // Create initial game stats
      await storage.createGameStats({
        userId: user.id,
        totalTaps: 0,
        totalCoinsEarned: 0,
        totalEnergyUsed: 0,
        playTimeMinutes: 0,
      });
      
      res.json(user);
      break;
      
    case 'tap':
      const { userId, taps } = body;
      
      if (!userId || !taps || taps <= 0) {
        return res.status(400).json({ error: 'Invalid tap data' });
      }
      
      const tapUser = await storage.getUser(userId);
      if (!tapUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Check energy
      if (tapUser.energy < taps) {
        return res.status(400).json({ error: 'Not enough energy' });
      }
      
      // Calculate coins earned
      const coinsEarned = taps * tapUser.coinsPerTap;
      const newEnergy = tapUser.energy - taps;
      const newCoins = tapUser.coins + coinsEarned;
      const newExperience = tapUser.experience + taps;
      
      // Check for level up
      const currentLevelData = EMPIRE_LEVELS.find(l => l.level === tapUser.level);
      const nextLevelData = EMPIRE_LEVELS.find(l => l.level === tapUser.level + 1);
      
      let newLevel = tapUser.level;
      let newTitle = tapUser.empireTitle;
      
      if (nextLevelData && newExperience >= nextLevelData.requiredXP) {
        newLevel = nextLevelData.level;
        newTitle = nextLevelData.title;
      }
      
      // Update user
      const updatedUser = await storage.updateUser(userId, {
        coins: newCoins,
        energy: newEnergy,
        experience: newExperience,
        level: newLevel,
        empireTitle: newTitle,
        lastActiveAt: new Date(),
      });
      
      // Update game stats
      const gameStats = await storage.getUserGameStats(userId);
      if (gameStats) {
        await storage.updateGameStats(gameStats.id, {
          totalTaps: gameStats.totalTaps + taps,
          totalCoinsEarned: gameStats.totalCoinsEarned + coinsEarned,
          totalEnergyUsed: gameStats.totalEnergyUsed + taps,
          lastPlayedAt: new Date(),
        });
      }
      
      res.json({
        user: updatedUser,
        coinsEarned,
        levelUp: newLevel > tapUser.level,
      });
      break;
      
    case 'energy-refill':
      const { userId: refillUserId } = body;
      
      const refillUser = await storage.getUser(refillUserId);
      if (!refillUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Check if enough time has passed (1 energy per minute)
      const now = new Date();
      const lastRefill = new Date(refillUser.lastEnergyRefill);
      const minutesPassed = Math.floor((now.getTime() - lastRefill.getTime()) / (1000 * 60));
      
      if (minutesPassed > 0) {
        const energyToRestore = Math.min(minutesPassed, refillUser.maxEnergy - refillUser.energy);
        const newEnergy = refillUser.energy + energyToRestore;
        
        const updatedUser = await storage.updateUser(refillUserId, {
          energy: newEnergy,
          lastEnergyRefill: now,
        });
        
        res.json({ user: updatedUser, energyRestored: energyToRestore });
      } else {
        res.json({ user: refillUser, energyRestored: 0 });
      }
      break;
      
    case 'businesses':
      const { userId: businessUserId, type } = body;
      
      const businessType = BUSINESS_TYPES.find(b => b.type === type);
      if (!businessType) {
        return res.status(400).json({ error: 'Invalid business type' });
      }
      
      const businessUser = await storage.getUser(businessUserId);
      if (!businessUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      if (businessUser.coins < businessType.baseCost) {
        return res.status(400).json({ error: 'Not enough coins' });
      }
      
      const business = await storage.createBusiness({
        userId: businessUserId,
        type: businessType.type,
        name: businessType.name,
        level: 1,
        income: businessType.baseIncome,
        upgradeCost: businessType.baseCost * 2,
      });
      
      // Deduct coins
      await storage.updateUser(businessUserId, {
        coins: businessUser.coins - businessType.baseCost,
      });
      
      res.json(business);
      break;
      
    case 'daily-reward-claim':
      const { userId: rewardUserId, day } = body;
      
      const rewardUser = await storage.getUser(rewardUserId);
      if (!rewardUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const rewardData = DAILY_REWARDS.find(r => r.day === day);
      if (!rewardData) {
        return res.status(400).json({ error: 'Invalid day' });
      }
      
      // Check if already claimed
      const existingReward = await storage.getUserDailyRewards(rewardUserId);
      const todayReward = existingReward.find(r => r.day === day && r.claimed);
      
      if (todayReward) {
        return res.status(400).json({ error: 'Already claimed today' });
      }
      
      // Create or update reward
      const reward = await storage.createDailyReward({
        userId: rewardUserId,
        day,
        reward: rewardData.reward,
        claimed: true,
        claimedAt: new Date(),
        streakDay: day,
      });
      
      // Add coins to user
      await storage.updateUser(rewardUserId, {
        coins: rewardUser.coins + rewardData.reward,
      });
      
      res.json(reward);
      break;
      
    case 'task-complete':
      const { userId: taskUserId, taskId } = body;
      
      const userTasks = await storage.getUserTasks(taskUserId);
      const targetTask = userTasks.find(t => t.id === taskId);
      
      if (!targetTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      if (targetTask.isCompleted) {
        return res.status(400).json({ error: 'Task already completed' });
      }
      
      // Complete task
      const completedTask = await storage.updateTask(taskId, {
        isCompleted: true,
        completedAt: new Date(),
      });
      
      // Add reward to user
      const taskUser = await storage.getUser(taskUserId);
      if (taskUser) {
        await storage.updateUser(taskUserId, {
          coins: taskUser.coins + targetTask.reward,
        });
      }
      
      res.json(completedTask);
      break;
      
    default:
      res.status(404).json({ error: 'Endpoint not found' });
  }
}

async function handlePUT(req: VercelRequest, res: VercelResponse, endpoint: string) {
  // Handle PUT requests (updates)
  res.status(404).json({ error: 'Endpoint not found' });
}

async function handleDELETE(req: VercelRequest, res: VercelResponse, endpoint: string) {
  // Handle DELETE requests
  res.status(404).json({ error: 'Endpoint not found' });
}

// Helper function to get leaderboard
async function getLeaderboard(limit: number = 100) {
  // This would need to be implemented with proper database queries
  // For now, return empty array
  return [];
}

// Health check endpoint
export async function healthCheck(req: VercelRequest, res: VercelResponse) {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
}
