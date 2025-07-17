import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";

// Initialize storage first
console.log('🗄️ Initializing storage...');

// Initialize Telegram bot only if token is available
if (process.env.TELEGRAM_BOT_TOKEN) {
  console.log('🤖 Telegram Bot Token found, initializing bot...');
  import("./bot").then(() => {
    console.log('✅ Telegram bot initialized successfully');
  }).catch(error => {
    console.error('❌ Failed to initialize Telegram bot:', error);
  });
} else {
  console.warn('⚠️ TELEGRAM_BOT_TOKEN not found - bot will not be initialized');
  console.log('ℹ️ To enable Telegram bot:');
  console.log('   1. Get your bot token from @BotFather');
  console.log('   2. Add it to Secrets tab as TELEGRAM_BOT_TOKEN');
  console.log('   3. Restart the application');
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  const isDev = process.env.NODE_ENV !== 'production';
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`🚀 Server running on port ${port}`);
    log(`📊 Environment: ${app.get("env")}`);
    log(`🤖 Telegram Bot Token: ${process.env.TELEGRAM_BOT_TOKEN ? 'Found ✅' : 'Not found ❌'}`);
    log(`🗄️ Database: ${process.env.DATABASE_URL ? 'Connected ✅' : 'Not configured ❌'}`);
    log(`🌐 Test URL: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
  });
})();