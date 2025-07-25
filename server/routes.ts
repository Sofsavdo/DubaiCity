import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import { storage } from "./storage";
import { telegramWebApp } from "./telegram";
import { verifyAdminToken, adminLogin } from "./admin-auth";
import { insertUserSchema, insertTaskSchema, insertSkinSchema, insertBusinessSchema, insertPromoCodeSchema, insertNotificationSchema, insertTeamSchema, insertProjectSchema } from "@shared/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerRoutes(app: Express): Promise<Express> {
  // CORS configuration
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Serve static files
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.use('/admin', express.static(path.join(__dirname, '../admin-panel/dist')));

  // ================= REAL-TIME SYNC API =================

  // Get unified game data for both admin and game client
  app.get("/api/game/data", async (req, res) => {
    try {
      const { telegramId } = req.query;

      let user = null;
      if (telegramId) {
        user = await storage.getUserByTelegramId(telegramId as string);
      }

      const [tasks, skins, businesses, users] = await Promise.all([
        storage.getAllTasks(),
        storage.getAllSkins(),
        storage.getAllBusinesses(),
        storage.getAllUsers()
      ]);

      const gameData = {
        user,
        tasks: tasks.filter(t => t.isActive),
        skins: skins.filter(s => s.isActive),
        businesses: businesses.filter(b => b.isActive),
        stats: {
          totalUsers: users.length,
          activeUsers: users.filter(u => u.isActive).length,
          totalCoins: users.reduce((sum, u) => sum + (u.dubaiCoin || 0), 0)
        }
      };

      res.json({ success: true, data: gameData });
    } catch (error) {
      console.error("Game data fetch error:", error);
      res.status(500).json({ success: false, message: "Error fetching game data" });
    }
  });

  // Update user data (for real-time sync)
  app.put("/api/game/user/:telegramId", async (req, res) => {
    try {
      const { telegramId } = req.params;
      const updateData = req.body;

      const user = await storage.getUserByTelegramId(telegramId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const updatedUser = await storage.updateUser(user.id, updateData);

      // Broadcast update to admin panel if needed
      res.json({ success: true, data: updatedUser });
    } catch (error) {
      console.error("User update error:", error);
      res.status(500).json({ success: false, message: "Error updating user" });
    }
  });

  // ================= ADMIN AUTH =================

  app.post("/api/admin/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username and password required" });
      }

      const token = await adminLogin(username, password);

      if (token) {
        res.json({ 
          success: true, 
          data: { 
            token, 
            user: { username, role: 'admin' } 
          } 
        });
      } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Login failed" });
    }
  });

  // ================= TELEGRAM WEB APP AUTH =================

  app.post("/api/telegram/auth", async (req, res) => {
    try {
      const { initData } = req.body;

      if (!initData) {
        return res.status(400).json({ success: false, message: "Init data is required" });
      }

      const verificationResult = telegramWebApp.verifyWebAppData(initData);

      if (!verificationResult.verified) {
        return res.status(401).json({ success: false, message: "Invalid Telegram data" });
      }

      const telegramUser = verificationResult.user;
      let user = await storage.getUserByTelegramId(telegramUser.id.toString());

      if (!user) {
        const newUser = {
          telegramId: telegramUser.id.toString(),
          username: telegramUser.username || `user_${telegramUser.id}`,
          firstName: telegramUser.first_name || "",
          lastName: telegramUser.last_name || "",
          language: telegramWebApp.getUserLanguage(telegramUser),
          isActive: true,
          coins: 1000,
          dubaiCoin: 1000,
          empireLevel: 1,
          profileImage: null,
          referralCode: `DC${telegramUser.id.toString().slice(-6)}`,
          referredBy: null,
          isPremium: telegramUser.is_premium || false,
        };

        user = await storage.createUser(newUser);
      }

      res.json({
        success: true,
        data: {
          user,
          telegram: {
            id: telegramUser.id,
            username: telegramUser.username,
            firstName: telegramUser.first_name,
            lastName: telegramUser.last_name,
            isPremium: telegramUser.is_premium,
          },
        },
      });
    } catch (error) {
      console.error("Telegram auth error:", error);
      res.status(500).json({ success: false, message: "Authentication failed" });
    }
  });

  // ================= UNIFIED USER MANAGEMENT =================

  app.get("/api/users", verifyAdminToken, async (req, res) => {
    try {
      const { page = 1, limit = 50 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const users = await storage.getUsersWithPagination(offset, Number(limit));
      const totalUsers = await storage.getAllUsers();

      res.json({
        success: true,
        data: users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalUsers.length,
          totalPages: Math.ceil(totalUsers.length / Number(limit)),
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(Number(req.params.id));
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching user" });
    }
  });

  app.post("/api/users", verifyAdminToken, async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, message: "Invalid user data" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(Number(req.params.id), req.body);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error updating user" });
    }
  });

  // ================= UNIFIED TASK MANAGEMENT =================

  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getAllTasks();
      res.json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching tasks" });
    }
  });

  app.post("/api/tasks", verifyAdminToken, async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedData);
      res.status(201).json({ success: true, data: task });
    } catch (error) {
      res.status(400).json({ success: false, message: "Invalid task data" });
    }
  });

  app.put("/api/tasks/:id", verifyAdminToken, async (req, res) => {
    try {
      const task = await storage.updateTask(Number(req.params.id), req.body);
      if (!task) {
        return res.status(404).json({ success: false, message: "Task not found" });
      }
      res.json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error updating task" });
    }
  });

  app.delete("/api/tasks/:id", verifyAdminToken, async (req, res) => {
    try {
      const deleted = await storage.deleteTask(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Task not found" });
      }
      res.json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error deleting task" });
    }
  });

  // ================= ADMIN DASHBOARD =================

  app.get("/api/admin/stats", verifyAdminToken, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const tasks = await storage.getAllTasks();
      const businesses = await storage.getAllBusinesses();

      const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.isActive).length,
        totalCoins: users.reduce((sum, user) => sum + (user.dubaiCoin || 0), 0),
        completedTasks: users.reduce((sum, user) => sum + (user.completedTasks?.length || 0), 0),
        totalTasks: tasks.length,
        totalBusinesses: businesses.length,
        premiumUsers: users.filter(u => u.isPremium).length,
        dailyActiveUsers: Math.floor(users.length * 0.7),
        weeklyGrowth: Math.floor(Math.random() * 20) + 5,
        topCountries: [
          { name: 'O\'zbekiston', users: Math.floor(users.length * 0.45) },
          { name: 'Rossiya', users: Math.floor(users.length * 0.31) },
          { name: 'Qozog\'iston', users: Math.floor(users.length * 0.16) },
          { name: 'Tojikiston', users: Math.floor(users.length * 0.08) }
        ]
      };

      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching stats" });
    }
  });

  // ================= GAME ACTIONS =================

  app.post("/api/game/complete-task", async (req, res) => {
    try {
      const { telegramId, taskId } = req.body;

      const user = await storage.getUserByTelegramId(telegramId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const task = await storage.getTask(taskId);
      if (!task) {
        return res.status(404).json({ success: false, message: "Task not found" });
      }

      const userTask = await storage.completeTask(user.id, task.id);
      const updatedUser = await storage.updateUser(user.id, {
        coins: (user.coins || 0) + task.reward,
        dubaiCoin: (user.dubaiCoin || 0) + task.reward,
      });

      res.json({ 
        success: true, 
        data: {
          userTask,
          user: updatedUser,
          reward: task.reward,
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error completing task" });
    }
  });

  // ================= STATIC FILES =================

  app.get('/admin*', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin-panel/dist/index.html'));
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });

  return app;
}