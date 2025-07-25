import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer } from 'http';
import { registerRoutes } from "./routes.js";
import { setupViteDevMiddleware } from "./vite.js";
import { storage } from "./storage.js";
import helmet from "helmet";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = parseInt(process.env.PORT || '5000');
const ADMIN_PORT = parseInt(process.env.ADMIN_PORT || '5001');
const HOST = '0.0.0.0';

async function startServer() {
  const app = express();
  const adminApp = express();

  // Security middleware for main app
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'", "https://telegram.org", "https://web.telegram.org", "https://replit.com", "*.replit.com", "*.replit.dev"],
        scriptSrcElem: ["'self'", "'unsafe-inline'", "https://telegram.org", "https://web.telegram.org", "https://replit.com", "*.replit.com", "*.replit.dev"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:", "*.replit.com", "*.replit.dev"],
        imgSrc: ["'self'", "data:", "https:", "blob:", "*.replit.com", "*.replit.dev"],
        connectSrc: ["'self'", "https:", "wss:", "ws:", "*.replit.com", "*.replit.dev"],
        fontSrc: ["'self'", "data:", "https:", "*.replit.com", "*.replit.dev"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'", "data:", "https:", "*.replit.com", "*.replit.dev"],
        frameSrc: ["'self'", "https://telegram.org", "https://web.telegram.org", "*.replit.com", "*.replit.dev"]
      }
    }
  }));
  app.use(cors({
    origin: [
      'https://web.telegram.org',
      'https://telegram.org',
      /.*\.replit\.app$/,
      /.*\.replit\.dev$/,
      /.*\.pike\.replit\.dev$/,
      'http://localhost:3000',
      'http://localhost:5000',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5000',
      'http://0.0.0.0:3000',
      'http://0.0.0.0:5000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));

  // Security middleware for admin app
  adminApp.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'", "https://replit.com", "*.replit.com", "*.replit.dev"],
        scriptSrcElem: ["'self'", "'unsafe-inline'", "https://replit.com", "*.replit.com", "*.replit.dev"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:", "*.replit.com", "*.replit.dev"],
        imgSrc: ["'self'", "data:", "https:", "blob:", "*.replit.com", "*.replit.dev"],
        connectSrc: ["'self'", "https:", "wss:", "ws:", "*.replit.com", "*.replit.dev"],
        fontSrc: ["'self'", "data:", "https:", "*.replit.com", "*.replit.dev"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'", "data:", "https:", "*.replit.com", "*.replit.dev"],
        frameSrc: ["'self'", "*.replit.com", "*.replit.dev"]
      }
    }
  }));
  adminApp.use(cors({
    origin: [
      `http://localhost:${ADMIN_PORT}`,
      `http://0.0.0.0:${ADMIN_PORT}`,
      /.*\.replit\.app$/,
      /.*\.replit\.dev$/,
      /.*\.pike\.replit\.dev$/,
      'https://dubaicity-admin.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));

  // Trust proxy headers (important for Replit)
  app.set('trust proxy', true);
  adminApp.set('trust proxy', true);

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  adminApp.use(express.json({ limit: '10mb' }));
  adminApp.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logging middleware
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
  adminApp.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} (ADMIN)`);
    next();
  });

  try {
    console.log('🚀 Starting Dubai City server...');

    // Test database connection
    try {
      console.log('🔗 Testing database connection...');
      const { testConnection } = await import('./db');
      await testConnection();
      await storage.getAllUsers();
      console.log('✅ Database and storage connection successful');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      console.log('🔄 Falling back to memory storage for development');
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
    }

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
        database: !!process.env.DATABASE_URL
      });
    });

    // Static fayllar uchun middleware
    app.use('/attached_assets', express.static('attached_assets', {
      fallthrough: true,
      setHeaders: (res, path) => {
        res.set('Cache-Control', 'public, max-age=86400'); // 24 soat cache
        res.set('Access-Control-Allow-Origin', '*');
      }
    }));

    // 404 bo'lgan rasmlar uchun fallback
    app.use('/attached_assets', (req, res, next) => {
      // Don't log missing asset errors to reduce noise
      res.status(404).json({ 
        success: false, 
        message: 'Image not found',
        path: req.path 
      });
    });

    // Register API routes
    console.log('📡 Registering API routes...');
    await registerRoutes(app);

    // Admin panel middleware
    // Admin static files
    adminApp.use(express.static('admin-panel/dist', {
      fallthrough: true,
      setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
          res.set('Cache-Control', 'no-cache');
        }
      }
    }));

    // Admin API routes - reuse same API but with admin prefix
    adminApp.use('/admin-api', app);

    // Admin SPA fallback
    adminApp.get('*', async (req, res) => {
      const indexPath = path.join(process.cwd(), 'admin-panel/dist/index.html');
      try {
        const fs = await import('fs');
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(404).json({ 
            success: false, 
            message: 'Admin panel not built. Run: cd admin-panel && npm run build' 
          });
        }
      } catch (error) {
        res.status(404).json({ 
          success: false, 
          message: 'Admin panel not built. Run: cd admin-panel && npm run build' 
        });
      }
    });

    // Setup Vite middleware in development
    if (process.env.NODE_ENV !== "production") {
      console.log('⚡ Setting up Vite development middleware...');
      await setupViteDevMiddleware(app);

      // Admin panel routing for development
      app.get('/admin*', (req, res, next) => {
        // Vite will handle this in development
        next();
      });
    } else {
      // Production static file serving
      // Development mode: proxy to dev servers
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Development mode: API server on port 5000');
    console.log('🎮 Client dev server should run on port 3000');
    console.log('⚙️ Admin dev server should run on port 3001');
  } else {
    // Production mode: serve static files
    app.use('/admin', express.static(path.join(process.cwd(), 'admin-panel/dist')));
    app.use(express.static(path.join(process.cwd(), 'dist/public')));
  }

      // Admin panel SPA fallback
      app.get('/admin*', (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/admin/index.html'));
      });

      // Main app SPA fallback
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/client/index.html'));
      });
    }

    // Global error handler
    app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      // Log xatolarni faqat muhim xatolarni
      if (!error.message?.includes('ECONNRESET') && !error.message?.includes('EPIPE')) {
        console.error('🚨 Global error handler:', error.message);
      }

      // Client uchun xavfsiz xato xabari
      res.status(error.status || 500).json({ 
        success: false, 
        message: error.status === 404 ? 'Not found' : 'Server error',
        ...(process.env.NODE_ENV === 'development' && { 
          error: error.message,
          stack: error.stack?.split('\n').slice(0, 5) // Faqat muhim qismini ko'rsatish
        })
      });
    });

    // 404 handler
    app.use('*', (req, res) => {
      res.status(404).json({ 
        success: false, 
        message: 'Route not found',
        path: req.originalUrl 
      });
    });

    // Create HTTP servers
    const mainServer = createServer(app);
    const adminServer = createServer(adminApp);

    // Start main server (Bot + Game)
    mainServer.listen(PORT, HOST, () => {
      console.log(`🚀 Game Server running on http://0.0.0.0:${PORT}`);
      console.log(`🎮 Bot Game: http://0.0.0.0:${PORT}`);
      console.log(`📊 Game API: http://0.0.0.0:${PORT}/api`);
    });

    // Start admin server
    adminServer.listen(ADMIN_PORT, HOST, () => {
      console.log(`👑 Admin Panel running on http://0.0.0.0:${ADMIN_PORT}`);
      console.log(`⚙️ Admin API: http://0.0.0.0:${ADMIN_PORT}/admin-api`);
    });

  } catch (error) {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

startServer();