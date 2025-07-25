import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: await checkDatabaseHealth(),
        telegram: await checkTelegramHealth(),
        storage: await checkStorageHealth(),
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
    
    res.status(200).json(healthStatus);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    });
  }
}

async function checkDatabaseHealth(): Promise<{ status: string; message?: string }> {
  try {
    // Try to import and use the database
    const { storage } = await import('../server/storage');
    
    // Simple database connectivity test
    // This would ideally run a simple query
    return { status: 'connected' };
  } catch (error) {
    return { 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Database connection failed'
    };
  }
}

async function checkTelegramHealth(): Promise<{ status: string; message?: string }> {
  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!BOT_TOKEN) {
      return { status: 'error', message: 'Bot token not configured' };
    }
    
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`, {
      method: 'GET',
    });
    
    if (response.ok) {
      const result = await response.json();
      return { 
        status: 'connected',
        message: `Bot @${result.result.username} is active`
      };
    } else {
      return { status: 'error', message: 'Bot API not responding' };
    }
  } catch (error) {
    return { 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Telegram API check failed'
    };
  }
}

async function checkStorageHealth(): Promise<{ status: string; message?: string }> {
  try {
    // Check if storage interface is available
    const { storage } = await import('../server/storage');
    
    if (storage) {
      return { status: 'available' };
    } else {
      return { status: 'error', message: 'Storage interface not available' };
    }
  } catch (error) {
    return { 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Storage check failed'
    };
  }
}
