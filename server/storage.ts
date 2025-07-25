
import { db } from './db';
import { users, tasks, skins, businesses, promoCodes, notifications, teams, projects, userTasks, userSkins, userBusinesses, promoCodeUsage, empireLevels, settings, type User, type InsertUser, type Task, type InsertTask, type Skin, type InsertSkin, type Business, type InsertBusiness, type PromoCode, type InsertPromoCode, type Notification, type InsertNotification, type Team, type InsertTeam, type Project, type InsertProject, type EmpireLevel, type UserTask, type UserSkin, type UserBusiness, type PromoCodeUsage, type UserNotification, type TeamMember, type UserProject, type Setting } from '../shared/schema';
import { eq, desc, asc, and, gte, lte, sql } from 'drizzle-orm';

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByTelegramId(telegramId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getUsersWithPagination(offset: number, limit: number): Promise<User[]>;

  // Tasks management
  getAllTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  getUserTasks(userId: number): Promise<UserTask[]>;
  completeTask(userId: number, taskId: number): Promise<UserTask>;

  // Skins management
  getAllSkins(): Promise<Skin[]>;
  getSkin(id: number): Promise<Skin | undefined>;
  createSkin(skin: InsertSkin): Promise<Skin>;
  updateSkin(id: number, updates: Partial<Skin>): Promise<Skin | undefined>;
  deleteSkin(id: number): Promise<boolean>;
  getUserSkins(userId: number): Promise<UserSkin[]>;
  purchaseSkin(userId: number, skinId: number): Promise<UserSkin>;

  // Business management
  getAllBusinesses(): Promise<Business[]>;
  getBusiness(id: number): Promise<Business | undefined>;
  createBusiness(business: InsertBusiness): Promise<Business>;
  updateBusiness(id: number, updates: Partial<Business>): Promise<Business | undefined>;
  deleteBusiness(id: number): Promise<boolean>;
  getUserBusinesses(userId: number): Promise<UserBusiness[]>;
  purchaseBusiness(userId: number, businessId: number): Promise<UserBusiness>;

  // Promo codes
  getAllPromoCodes(): Promise<PromoCode[]>;
  getPromoCode(code: string): Promise<PromoCode | undefined>;
  createPromoCode(promoCode: InsertPromoCode): Promise<PromoCode>;
  updatePromoCode(id: number, updates: Partial<PromoCode>): Promise<PromoCode | undefined>;
  deletePromoCode(id: number): Promise<boolean>;
  usePromoCode(userId: number, code: string): Promise<PromoCodeUsage>;

  // Notifications
  getAllNotifications(): Promise<Notification[]>;
  getNotification(id: number): Promise<Notification | undefined>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  updateNotification(id: number, updates: Partial<Notification>): Promise<Notification | undefined>;
  deleteNotification(id: number): Promise<boolean>;
  getUserNotifications(userId: number): Promise<UserNotification[]>;

  // Teams
  getAllTeams(): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: number, updates: Partial<Team>): Promise<Team | undefined>;
  deleteTeam(id: number): Promise<boolean>;
  getTeamMembers(teamId: number): Promise<TeamMember[]>;
  joinTeam(teamId: number, userId: number): Promise<TeamMember>;

  // Projects
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  getUserProjects(userId: number): Promise<UserProject[]>;
  completeProject(userId: number, projectId: number): Promise<UserProject>;

  // Empire levels
  getAllEmpireLevels(): Promise<EmpireLevel[]>;
  getEmpireLevel(level: number): Promise<EmpireLevel | undefined>;

  // Settings
  getAllSettings(): Promise<Setting[]>;
  getSetting(key: string): Promise<Setting | undefined>;
  updateSetting(key: string, value: string): Promise<Setting>;

  // Statistics
  getUserStats(): Promise<any>;
  getGameStats(): Promise<any>;

  // Referral system
  getUserByReferralCode(referralCode: string): Promise<User | undefined>;
  getReferralStats(userId: number): Promise<{ count: number; totalEarned: number }>;
}

export class DatabaseStorage implements IStorage {
  // ================= USER OPERATIONS =================

  async createUser(userData: any): Promise<User> {
    try {
      const [user] = await db.insert(users).values({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      return user as User;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.telegramId, telegramId));
      return user || undefined;
    } catch (error) {
      console.error('Error getting user by telegram ID:', error);
      return undefined;
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user || undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user || undefined;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async updateUser(id: number, updateData: any): Promise<User | undefined> {
    try {
      const [user] = await db.update(users)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();
      return user || undefined;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await db.select().from(users).orderBy(desc(users.createdAt));
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  async getUsersWithPagination(offset: number, limit: number): Promise<User[]> {
    try {
      return await db.select().from(users)
        .orderBy(desc(users.createdAt))
        .offset(offset)
        .limit(limit);
    } catch (error) {
      console.error('Error getting users with pagination:', error);
      return [];
    }
  }

  // ================= TASK OPERATIONS =================

  async getAllTasks(): Promise<Task[]> {
    try {
      return await db.select().from(tasks).orderBy(asc(tasks.order));
    } catch (error) {
      console.error('Error getting all tasks:', error);
      return [];
    }
  }

  async getTask(id: number): Promise<Task | undefined> {
    try {
      const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
      return task || undefined;
    } catch (error) {
      console.error('Error getting task:', error);
      return undefined;
    }
  }

  async createTask(taskData: any): Promise<Task> {
    try {
      const [task] = await db.insert(tasks).values({
        ...taskData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      return task as Task;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(id: number, updateData: any): Promise<Task | undefined> {
    try {
      const [task] = await db.update(tasks)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(tasks.id, id))
        .returning();
      return task || undefined;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(id: number): Promise<boolean> {
    try {
      await db.delete(tasks).where(eq(tasks.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  }

  async getUserTasks(userId: number): Promise<UserTask[]> {
    try {
      return await db.select().from(userTasks).where(eq(userTasks.userId, userId));
    } catch (error) {
      console.error('Error getting user tasks:', error);
      return [];
    }
  }

  async completeTask(userId: number, taskId: number): Promise<UserTask> {
    try {
      const [userTask] = await db.insert(userTasks).values({
        userId,
        taskId,
        completedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      return userTask as UserTask;
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }

  // ================= SKIN OPERATIONS =================

  async getAllSkins(): Promise<Skin[]> {
    try {
      return await db.select().from(skins).orderBy(asc(skins.price));
    } catch (error) {
      console.error('Error getting all skins:', error);
      return [];
    }
  }

  async getSkin(id: number): Promise<Skin | undefined> {
    try {
      const [skin] = await db.select().from(skins).where(eq(skins.id, id));
      return skin || undefined;
    } catch (error) {
      console.error('Error getting skin:', error);
      return undefined;
    }
  }

  async createSkin(skinData: any): Promise<Skin> {
    try {
      const [skin] = await db.insert(skins).values({
        ...skinData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      return skin as Skin;
    } catch (error) {
      console.error('Error creating skin:', error);
      throw error;
    }
  }

  async updateSkin(id: number, updateData: any): Promise<Skin | undefined> {
    try {
      const [skin] = await db.update(skins)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(skins.id, id))
        .returning();
      return skin || undefined;
    } catch (error) {
      console.error('Error updating skin:', error);
      throw error;
    }
  }

  async deleteSkin(id: number): Promise<boolean> {
    try {
      await db.delete(skins).where(eq(skins.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting skin:', error);
      return false;
    }
  }

  async getUserSkins(userId: number): Promise<UserSkin[]> {
    try {
      return await db.select().from(userSkins).where(eq(userSkins.userId, userId));
    } catch (error) {
      console.error('Error getting user skins:', error);
      return [];
    }
  }

  async purchaseSkin(userId: number, skinId: number): Promise<UserSkin> {
    try {
      const [userSkin] = await db.insert(userSkins).values({
        userId,
        skinId,
        purchasedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      return userSkin as UserSkin;
    } catch (error) {
      console.error('Error purchasing skin:', error);
      throw error;
    }
  }

  // ================= BUSINESS OPERATIONS =================

  async getAllBusinesses(): Promise<Business[]> {
    try {
      return await db.select().from(businesses).orderBy(asc(businesses.requiredLevel));
    } catch (error) {
      console.error('Error getting all businesses:', error);
      return [];
    }
  }

  async getBusiness(id: number): Promise<Business | undefined> {
    try {
      const [business] = await db.select().from(businesses).where(eq(businesses.id, id));
      return business || undefined;
    } catch (error) {
      console.error('Error getting business:', error);
      return undefined;
    }
  }

  async createBusiness(businessData: any): Promise<Business> {
    try {
      const [business] = await db.insert(businesses).values({
        ...businessData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      return business as Business;
    } catch (error) {
      console.error('Error creating business:', error);
      throw error;
    }
  }

  async updateBusiness(id: number, updateData: any): Promise<Business | undefined> {
    try {
      const [business] = await db.update(businesses)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(businesses.id, id))
        .returning();
      return business || undefined;
    } catch (error) {
      console.error('Error updating business:', error);
      throw error;
    }
  }

  async deleteBusiness(id: number): Promise<boolean> {
    try {
      await db.delete(businesses).where(eq(businesses.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting business:', error);
      return false;
    }
  }

  async getUserBusinesses(userId: number): Promise<UserBusiness[]> {
    try {
      return await db.select().from(userBusinesses).where(eq(userBusinesses.userId, userId));
    } catch (error) {
      console.error('Error getting user businesses:', error);
      return [];
    }
  }

  async purchaseBusiness(userId: number, businessId: number): Promise<UserBusiness> {
    try {
      const [userBusiness] = await db.insert(userBusinesses).values({
        userId,
        businessId,
        level: 1,
        purchasedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      return userBusiness as UserBusiness;
    } catch (error) {
      console.error('Error purchasing business:', error);
      throw error;
    }
  }

  // ================= PROMO CODE OPERATIONS =================

  async getAllPromoCodes(): Promise<PromoCode[]> {
    try {
      return await db.select().from(promoCodes).orderBy(desc(promoCodes.createdAt));
    } catch (error) {
      console.error('Error getting all promo codes:', error);
      return [];
    }
  }

  async getPromoCode(code: string): Promise<PromoCode | undefined> {
    try {
      const [promoCode] = await db.select().from(promoCodes).where(eq(promoCodes.code, code));
      return promoCode || undefined;
    } catch (error) {
      console.error('Error getting promo code:', error);
      return undefined;
    }
  }

  async createPromoCode(promoData: any): Promise<PromoCode> {
    try {
      const [promoCode] = await db.insert(promoCodes).values({
        ...promoData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      return promoCode as PromoCode;
    } catch (error) {
      console.error('Error creating promo code:', error);
      throw error;
    }
  }

  async updatePromoCode(id: number, updateData: any): Promise<PromoCode | undefined> {
    try {
      const [promoCode] = await db.update(promoCodes)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(promoCodes.id, id))
        .returning();
      return promoCode || undefined;
    } catch (error) {
      console.error('Error updating promo code:', error);
      throw error;
    }
  }

  async deletePromoCode(id: number): Promise<boolean> {
    try {
      await db.delete(promoCodes).where(eq(promoCodes.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting promo code:', error);
      return false;
    }
  }

  async usePromoCode(userId: number, code: string): Promise<PromoCodeUsage> {
    try {
      const [usage] = await db.insert(promoCodeUsage).values({
        userId,
        promoCodeId: 1, // This should be the actual promo code ID
        usedAt: new Date(),
      }).returning();

      // Update promo code usage count
      await db.update(promoCodes)
        .set({ usedCount: sql`${promoCodes.usedCount} + 1` })
        .where(eq(promoCodes.code, code));

      return usage as PromoCodeUsage;
    } catch (error) {
      console.error('Error using promo code:', error);
      throw error;
    }
  }

  // ================= NOTIFICATION OPERATIONS =================

  async getAllNotifications(): Promise<Notification[]> {
    try {
      return await db.select().from(notifications).orderBy(desc(notifications.createdAt));
    } catch (error) {
      console.error('Error getting all notifications:', error);
      return [];
    }
  }

  async getNotification(id: number): Promise<Notification | undefined> {
    try {
      const [notification] = await db.select().from(notifications).where(eq(notifications.id, id));
      return notification || undefined;
    } catch (error) {
      console.error('Error getting notification:', error);
      return undefined;
    }
  }

  async createNotification(notificationData: any): Promise<Notification> {
    try {
      const [notification] = await db.insert(notifications).values({
        ...notificationData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      return notification as Notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async updateNotification(id: number, updateData: any): Promise<Notification | undefined> {
    try {
      const [notification] = await db.update(notifications)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(notifications.id, id))
        .returning();
      return notification || undefined;
    } catch (error) {
      console.error('Error updating notification:', error);
      throw error;
    }
  }

  async deleteNotification(id: number): Promise<boolean> {
    try {
      await db.delete(notifications).where(eq(notifications.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  async getUserNotifications(userId: number): Promise<UserNotification[]> {
    try {
      return [];
    } catch (error) {
      console.error('Error getting user notifications:', error);
      return [];
    }
  }

  // ================= TEAM OPERATIONS =================

  async getAllTeams(): Promise<Team[]> {
    try {
      return await db.select().from(teams).orderBy(desc(teams.createdAt));
    } catch (error) {
      console.error('Error getting all teams:', error);
      return [];
    }
  }

  async getTeam(id: number): Promise<Team | undefined> {
    try {
      const [team] = await db.select().from(teams).where(eq(teams.id, id));
      return team || undefined;
    } catch (error) {
      console.error('Error getting team:', error);
      return undefined;
    }
  }

  async createTeam(teamData: any): Promise<Team> {
    try {
      const [team] = await db.insert(teams).values({
        ...teamData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      return team as Team;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  }

  async updateTeam(id: number, updateData: any): Promise<Team | undefined> {
    try {
      const [team] = await db.update(teams)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(teams.id, id))
        .returning();
      return team || undefined;
    } catch (error) {
      console.error('Error updating team:', error);
      throw error;
    }
  }

  async deleteTeam(id: number): Promise<boolean> {
    try {
      await db.delete(teams).where(eq(teams.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting team:', error);
      return false;
    }
  }

  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    try {
      return await db.select().from(users).where(eq(users.teamId, teamId)) as any;
    } catch (error) {
      console.error('Error getting team members:', error);
      return [];
    }
  }

  async joinTeam(teamId: number, userId: number): Promise<TeamMember> {
    try {
      await db.update(users).set({ teamId: teamId }).where(eq(users.id, userId));

      return {
        id: 0,
        teamId: teamId,
        userId: userId,
        role: "member",
        joinedAt: new Date(),
      } as any;
    } catch (error) {
      console.error('Error joining team:', error);
      throw error;
    }
  }

  // ================= PROJECT OPERATIONS =================

  async getAllProjects(): Promise<Project[]> {
    try {
      return await db.select().from(projects).orderBy(desc(projects.createdAt));
    } catch (error) {
      console.error('Error getting all projects:', error);
      return [];
    }
  }

  async getProject(id: number): Promise<Project | undefined> {
    try {
      const [project] = await db.select().from(projects).where(eq(projects.id, id));
      return project || undefined;
    } catch (error) {
      console.error('Error getting project:', error);
      return undefined;
    }
  }

  async createProject(projectData: any): Promise<Project> {
    try {
      const [project] = await db.insert(projects).values({
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      return project as Project;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async updateProject(id: number, updateData: any): Promise<Project | undefined> {
    try {
      const [project] = await db.update(projects)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(projects.id, id))
        .returning();
      return project || undefined;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(id: number): Promise<boolean> {
    try {
      await db.delete(projects).where(eq(projects.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  }

  async getUserProjects(userId: number): Promise<UserProject[]> {
    try {
      return await db.select().from(projects).where(eq(projects.teamId, userId)) as any;
    } catch (error) {
      console.error('Error getting user projects:', error);
      return [];
    }
  }

  async completeProject(userId: number, projectId: number): Promise<UserProject> {
    try {
      await db.update(projects).set({ teamId: userId }).where(eq(projects.id, projectId));

      return {
        id: 0,
        userId: userId,
        projectId: projectId,
        completedAt: new Date(),
        rewardClaimed: false,
      } as any;
    } catch (error) {
      console.error('Error completing project:', error);
      throw error;
    }
  }

  // ================= EMPIRE LEVELS =================

  async getAllEmpireLevels(): Promise<EmpireLevel[]> {
    try {
      return await db.select().from(empireLevels).orderBy(asc(empireLevels.level));
    } catch (error) {
      console.error('Error getting empire levels:', error);
      return [];
    }
  }

  async getEmpireLevel(level: number): Promise<EmpireLevel | undefined> {
    try {
      const [empireLevel] = await db.select().from(empireLevels).where(eq(empireLevels.level, level));
      return empireLevel || undefined;
    } catch (error) {
      console.error('Error getting empire level:', error);
      return undefined;
    }
  }

  // ================= SETTINGS =================

  async getAllSettings(): Promise<Setting[]> {
    try {
      return await db.select().from(settings);
    } catch (error) {
      console.error('Error getting settings:', error);
      return [];
    }
  }

  async getSetting(key: string): Promise<Setting | undefined> {
    try {
      const [setting] = await db.select().from(settings).where(eq(settings.key, key));
      return setting || undefined;
    } catch (error) {
      console.error('Error getting setting:', error);
      return undefined;
    }
  }

  async updateSetting(key: string, value: string): Promise<Setting> {
    try {
      const [setting] = await db.insert(settings).values({
        key,
        value,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).onConflictDoUpdate({
        target: settings.key,
        set: { value, updatedAt: new Date() }
      }).returning();
      return setting as Setting;
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  }

  // ================= STATISTICS =================

  async getUserStats() {
    try {
      const totalUsers = await db.select({ count: sql`count(*)` }).from(users);
      const activeUsers = await db.select({ count: sql`count(*)` }).from(users).where(eq(users.isActive, true));
      const premiumUsers = await db.select({ count: sql`count(*)` }).from(users).where(eq(users.premiumStatus, true));

      return {
        total: Number(totalUsers[0]?.count) || 0,
        active: Number(activeUsers[0]?.count) || 0,
        premium: Number(premiumUsers[0]?.count) || 0,
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return { total: 0, active: 0, premium: 0 };
    }
  }

  async getGameStats() {
    try {
      const totalTasks = await db.select({ count: sql`count(*)` }).from(tasks);
      const completedTasks = await db.select({ count: sql`count(*)` }).from(userTasks);
      const totalBusinesses = await db.select({ count: sql`count(*)` }).from(businesses);

      return {
        totalTasks: Number(totalTasks[0]?.count) || 0,
        completedTasks: Number(completedTasks[0]?.count) || 0,
        totalBusinesses: Number(totalBusinesses[0]?.count) || 0,
      };
    } catch (error) {
      console.error('Error getting game stats:', error);
      return { totalTasks: 0, completedTasks: 0, totalBusinesses: 0 };
    }
  }

  // Get user by referral code
  async getUserByReferralCode(referralCode: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.referralCode, referralCode));
      return user || undefined;
    } catch (error) {
      console.error('Error getting user by referral code:', error);
      return undefined;
    }
  }

  async getReferralStats(userId: number): Promise<{ count: number; totalEarned: number }> {
    try {
      const referrals = await db.select().from(users).where(eq(users.referredBy, userId));

      return {
        count: referrals.length,
        totalEarned: referrals.length * 5000,
      };
    } catch (error) {
      console.error('Error getting referral stats:', error);
      return { count: 0, totalEarned: 0 };
    }
  }
}

// Simple in-memory storage for development
class MemStorage implements IStorage {
  private users: any[] = [];
  private tasks: any[] = [];
  private businesses: any[] = [];
  private skins: any[] = [];
  private notifications: any[] = [];
  private teams: any[] = [];
  private projects: any[] = [];
  private promoCodes: any[] = [];
  private empireLevels: any[] = [];
  private settings: any[] = [];

  async getAllUsers() { return this.users; }
  async getUser(id: number) { return this.users.find(u => u.id === id); }
  async getUserByTelegramId(telegramId: string) { return this.users.find(u => u.telegramId === telegramId); }
  async getUserByReferralCode(code: string) { return this.users.find(u => u.referralCode === code); }
  async getUserByUsername(username: string) { return this.users.find(u => u.username === username); }
  async getUsersWithPagination(offset: number, limit: number) { return this.users.slice(offset, offset + limit); }

  async createUser(userData: any) {
    const user = { id: Date.now(), createdAt: new Date(), ...userData };
    this.users.push(user);
    return user;
  }

  async updateUser(id: number, data: any) {
    const index = this.users.findIndex(u => u.id === id);
    if (index >= 0) {
      this.users[index] = { ...this.users[index], ...data };
      return this.users[index];
    }
    return undefined;
  }

  async getAllTasks() { return this.tasks; }
  async getTask(id: number) { return this.tasks.find(t => t.id === id); }
  async createTask(taskData: any) {
    const task = { id: Date.now(), createdAt: new Date(), ...taskData };
    this.tasks.push(task);
    return task;
  }
  async updateTask(id: number, updateData: any) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index >= 0) {
      this.tasks[index] = { ...this.tasks[index], ...updateData };
      return this.tasks[index];
    }
    return undefined;
  }
  async deleteTask(id: number) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index >= 0) {
      this.tasks.splice(index, 1);
      return true;
    }
    return false;
  }
  async getUserTasks(userId: number) { return []; }
  async completeTask(userId: number, taskId: number) { return { userId, taskId, completedAt: new Date() } as any; }

  async getAllBusinesses() { return this.businesses; }
  async getBusiness(id: number) { return this.businesses.find(b => b.id === id); }
  async createBusiness(businessData: any) {
    const business = { id: Date.now(), createdAt: new Date(), ...businessData };
    this.businesses.push(business);
    return business;
  }
  async updateBusiness(id: number, updateData: any) {
    const index = this.businesses.findIndex(b => b.id === id);
    if (index >= 0) {
      this.businesses[index] = { ...this.businesses[index], ...updateData };
      return this.businesses[index];
    }
    return undefined;
  }
  async deleteBusiness(id: number) {
    const index = this.businesses.findIndex(b => b.id === id);
    if (index >= 0) {
      this.businesses.splice(index, 1);
      return true;
    }
    return false;
  }
  async getUserBusinesses(userId: number) { return []; }
  async purchaseBusiness(userId: number, businessId: number) { return { userId, businessId, purchasedAt: new Date() } as any; }

  async getAllSkins() { return this.skins; }
  async getSkin(id: number) { return this.skins.find(s => s.id === id); }
  async createSkin(skinData: any) {
    const skin = { id: Date.now(), createdAt: new Date(), ...skinData };
    this.skins.push(skin);
    return skin;
  }
  async updateSkin(id: number, updateData: any) {
    const index = this.skins.findIndex(s => s.id === id);
    if (index >= 0) {
      this.skins[index] = { ...this.skins[index], ...updateData };
      return this.skins[index];
    }
    return undefined;
  }
  async deleteSkin(id: number) {
    const index = this.skins.findIndex(s => s.id === id);
    if (index >= 0) {
      this.skins.splice(index, 1);
      return true;
    }
    return false;
  }
  async getUserSkins(userId: number) { return []; }
  async purchaseSkin(userId: number, skinId: number) { return { userId, skinId, purchasedAt: new Date() } as any; }

  async getAllPromoCodes() { return this.promoCodes; }
  async getPromoCode(code: string) { return this.promoCodes.find(p => p.code === code); }
  async createPromoCode(promoData: any) {
    const promo = { id: Date.now(), createdAt: new Date(), ...promoData };
    this.promoCodes.push(promo);
    return promo;
  }
  async updatePromoCode(id: number, updateData: any) {
    const index = this.promoCodes.findIndex(p => p.id === id);
    if (index >= 0) {
      this.promoCodes[index] = { ...this.promoCodes[index], ...updateData };
      return this.promoCodes[index];
    }
    return undefined;
  }
  async deletePromoCode(id: number) {
    const index = this.promoCodes.findIndex(p => p.id === id);
    if (index >= 0) {
      this.promoCodes.splice(index, 1);
      return true;
    }
    return false;
  }
  async usePromoCode(userId: number, code: string) { return { userId, code, usedAt: new Date() } as any; }

  async getAllNotifications() { return this.notifications; }
  async getNotification(id: number) { return this.notifications.find(n => n.id === id); }
  async createNotification(notificationData: any) {
    const notification = { id: Date.now(), createdAt: new Date(), ...notificationData };
    this.notifications.push(notification);
    return notification;
  }
  async updateNotification(id: number, updateData: any) {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index >= 0) {
      this.notifications[index] = { ...this.notifications[index], ...updateData };
      return this.notifications[index];
    }
    return undefined;
  }
  async deleteNotification(id: number) {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index >= 0) {
      this.notifications.splice(index, 1);
      return true;
    }
    return false;
  }
  async getUserNotifications(userId: number) { return []; }

  async getAllTeams() { return this.teams; }
  async getTeam(id: number) { return this.teams.find(t => t.id === id); }
  async createTeam(teamData: any) {
    const team = { id: Date.now(), createdAt: new Date(), ...teamData };
    this.teams.push(team);
    return team;
  }
  async updateTeam(id: number, updateData: any) {
    const index = this.teams.findIndex(t => t.id === id);
    if (index >= 0) {
      this.teams[index] = { ...this.teams[index], ...updateData };
      return this.teams[index];
    }
    return undefined;
  }
  async deleteTeam(id: number) {
    const index = this.teams.findIndex(t => t.id === id);
    if (index >= 0) {
      this.teams.splice(index, 1);
      return true;
    }
    return false;
  }
  async getTeamMembers(teamId: number) { return []; }
  async joinTeam(teamId: number, userId: number) { return { teamId, userId, joinedAt: new Date() } as any; }

  async getAllProjects() { return this.projects; }
  async getProject(id: number) { return this.projects.find(p => p.id === id); }
  async createProject(projectData: any) {
    const project = { id: Date.now(), createdAt: new Date(), ...projectData };
    this.projects.push(project);
    return project;
  }
  async updateProject(id: number, updateData: any) {
    const index = this.projects.findIndex(p => p.id === id);
    if (index >= 0) {
      this.projects[index] = { ...this.projects[index], ...updateData };
      return this.projects[index];
    }
    return undefined;
  }
  async deleteProject(id: number) {
    const index = this.projects.findIndex(p => p.id === id);
    if (index >= 0) {
      this.projects.splice(index, 1);
      return true;
    }
    return false;
  }
  async getUserProjects(userId: number) { return []; }
  async completeProject(userId: number, projectId: number) { return { userId, projectId, completedAt: new Date() } as any; }

  async getAllEmpireLevels() { return this.empireLevels; }
  async getEmpireLevel(level: number) { return this.empireLevels.find(e => e.level === level); }

  async getAllSettings() { return this.settings; }
  async getSetting(key: string) { return this.settings.find(s => s.key === key); }
  async updateSetting(key: string, value: string) {
    const index = this.settings.findIndex(s => s.key === key);
    if (index >= 0) {
      this.settings[index] = { ...this.settings[index], value };
      return this.settings[index];
    } else {
      const setting = { key, value, createdAt: new Date() };
      this.settings.push(setting);
      return setting;
    }
  }

  async getUserStats() { return { total: this.users.length, active: this.users.length, premium: 0 }; }
  async getGameStats() { return { totalTasks: this.tasks.length, completedTasks: 0, totalBusinesses: this.businesses.length }; }
  async getReferralStats(userId: number) { return { count: 0, totalEarned: 0 }; }
}

// Determine storage type based on environment
const storage: IStorage = process.env.DATABASE_URL && process.env.DATABASE_URL !== 'sqlite:///data/database.db'
  ? new DatabaseStorage()
  : new MemStorage();

console.log(`📊 Storage initialized: ${process.env.DATABASE_URL && process.env.DATABASE_URL !== 'sqlite:///data/database.db' ? 'PostgreSQL' : 'Memory'}`);

export { storage };
