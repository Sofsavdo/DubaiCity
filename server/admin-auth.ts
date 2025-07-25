import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { Request, Response, NextFunction } from 'express';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

export async function adminLogin(username: string, password: string): Promise<string | null> {
  try {
    if (!username || !password) {
      return null;
    }

    // Simple comparison for demo, in production use bcrypt
    if (username.toLowerCase() === ADMIN_USERNAME.toLowerCase() && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { 
          username, 
          role: 'admin',
          iat: Math.floor(Date.now() / 1000)
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      console.log('✅ Admin login successful for:', username);
      return token;
    }

    console.log('❌ Admin login failed for:', username);
    return null;
  } catch (error) {
    console.error('Admin login error:', error);
    return null;
  }
}

export function verifyAdminToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Authorization header required' });
    }

    let token: string;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      token = authHeader;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ success: false, message: 'Token expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    return res.status(401).json({ success: false, message: 'Token verification failed' });
  }
}

// Health check for admin auth
export function adminAuthStatus() {
  return {
    configured: !!(ADMIN_USERNAME && ADMIN_PASSWORD && JWT_SECRET),
    username: ADMIN_USERNAME,
    jwtConfigured: !!JWT_SECRET
  };
}