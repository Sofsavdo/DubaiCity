import { pgTable, text, serial, integer, boolean, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - main user data
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  telegramId: text("telegram_id").unique(),
  username: text("username").notNull(),
  password: text("password"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  dubaiCoin: integer("dubai_coin").default(1000),
  tapProfit: integer("tap_profit").default(1),
  hourlyIncome: integer("hourly_income").default(0),
  level: integer("level").default(1),
  energy: integer("energy").default(5000),
  maxEnergy: integer("max_energy").default(5000),
  boost: integer("boost").default(0),
  maxBoost: integer("max_boost").default(3),
  energyRefill: integer("energy_refill").default(5),
  maxEnergyRefill: integer("max_energy_refill").default(5),
  currentAvatar: text("current_avatar"),
  premiumStatus: boolean("premium_status").default(false),
  premiumUntil: timestamp("premium_until"),
  selectedAppearance: json("selected_appearance"),
  lastDailyReward: timestamp("last_daily_reward"),
  dailyStreak: integer("daily_streak").default(0),
  referralCode: text("referral_code").unique(),
  referredBy: integer("referred_by"),
  isActive: boolean("is_active").default(true),
  isAdmin: boolean("is_admin").default(false),
  profileImage: text("profile_image"),
  language: text("language").default("uz"),
  createdAt: timestamp("created_at").defaultNow(),
  lastActive: timestamp("last_active").defaultNow(),
});

// Empire levels configuration
export const empireLevels = pgTable("empire_levels", {
  id: serial("id").primaryKey(),
  level: integer("level").notNull().unique(),
  name: text("name").notNull(),
  nameUz: text("name_uz"),
  nameRu: text("name_ru"),
  requiredCoins: integer("required_coins").notNull(),
  hourlyIncome: integer("hourly_income").default(0),
  description: text("description"),
  icon: text("icon"),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleUz: text("title_uz"),
  titleRu: text("title_ru"),
  description: text("description"),
  descriptionUz: text("description_uz"),
  descriptionRu: text("description_ru"),
  type: text("type").notNull(), // 'telegram', 'youtube', 'instagram', 'twitter'
  url: text("url"),
  reward: integer("reward").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User tasks completion
export const userTasks = pgTable("user_tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  taskId: integer("task_id").references(() => tasks.id).notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
  rewardClaimed: boolean("reward_claimed").default(false),
});

// Skins table
export const skins = pgTable("skins", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameUz: text("name_uz"),
  nameRu: text("name_ru"),
  description: text("description"),
  price: integer("price").notNull(),
  rarity: text("rarity").notNull(), // 'common', 'rare', 'epic', 'legendary'
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  category: text("category"), // 'character', 'weapon', 'background'
});

// User skins
export const userSkins = pgTable("user_skins", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  skinId: integer("skin_id").references(() => skins.id).notNull(),
  purchasedAt: timestamp("purchased_at").defaultNow(),
  isEquipped: boolean("is_equipped").default(false),
});

// Businesses/Market assets
export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameUz: text("name_uz"),
  nameRu: text("name_ru"),
  description: text("description"),
  price: integer("price").notNull(),
  hourlyProfit: integer("hourly_profit").notNull(),
  category: text("category").notNull(), // 'cafe', 'restaurant', 'office', 'factory'
  imageUrl: text("image_url"),
  requiredLevel: integer("required_level").default(1),
  isActive: boolean("is_active").default(true),
});

// User businesses
export const userBusinesses = pgTable("user_businesses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  businessId: integer("business_id").references(() => businesses.id).notNull(),
  purchasedAt: timestamp("purchased_at").defaultNow(),
  lastCollected: timestamp("last_collected").defaultNow(),
  level: integer("level").default(1),
});

// Promo codes
export const promoCodes = pgTable("promo_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  reward: integer("reward").notNull(),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").default(0),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Promo code usage
export const promoCodeUsage = pgTable("promo_code_usage", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  promoCodeId: integer("promo_code_id").references(() => promoCodes.id).notNull(),
  usedAt: timestamp("used_at").defaultNow(),
});

// Notifications/Messages
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleUz: text("title_uz"),
  titleRu: text("title_ru"),
  message: text("message").notNull(),
  messageUz: text("message_uz"),
  messageRu: text("message_ru"),
  type: text("type").notNull(), // 'broadcast', 'personal', 'system'
  targetUsers: json("target_users"), // array of user IDs for targeted messages
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User notifications
export const userNotifications = pgTable("user_notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  notificationId: integer("notification_id").references(() => notifications.id).notNull(),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
});

// Teams/Groups
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: integer("owner_id").references(() => users.id).notNull(),
  maxMembers: integer("max_members").default(50),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Team members
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  role: text("role").default("member"), // 'owner', 'admin', 'member'
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Projects/Daily missions
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameUz: text("name_uz"),
  nameRu: text("name_ru"),
  description: text("description"),
  reward: integer("reward").notNull(),
  type: text("type").notNull(), // 'daily', 'weekly', 'special'
  requirements: json("requirements"), // task requirements
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User projects completion
export const userProjects = pgTable("user_projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
  rewardClaimed: boolean("reward_claimed").default(false),
});

// System settings
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Create schemas
export const insertUserSchema = createInsertSchema(users).pick({
  telegramId: true,
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  dubaiCoin: true,
  tapProfit: true,
  hourlyIncome: true,
  level: true,
  energy: true,
  maxEnergy: true,
  boost: true,
  maxBoost: true,
  energyRefill: true,
  maxEnergyRefill: true,
  currentAvatar: true,
  premiumStatus: true,
  premiumUntil: true,
  selectedAppearance: true,
  lastDailyReward: true,
  dailyStreak: true,
  referralCode: true,
  referredBy: true,
  isActive: true,
  isAdmin: true,
  profileImage: true,
  language: true,
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  titleUz: true,
  titleRu: true,
  description: true,
  descriptionUz: true,
  descriptionRu: true,
  type: true,
  url: true,
  reward: true,
  isActive: true,
});

export const insertSkinSchema = createInsertSchema(skins).pick({
  name: true,
  nameUz: true,
  nameRu: true,
  description: true,
  price: true,
  rarity: true,
  imageUrl: true,
  category: true,
});

export const insertBusinessSchema = createInsertSchema(businesses).pick({
  name: true,
  nameUz: true,
  nameRu: true,
  description: true,
  price: true,
  hourlyProfit: true,
  category: true,
  imageUrl: true,
  requiredLevel: true,
});

export const insertPromoCodeSchema = createInsertSchema(promoCodes).pick({
  code: true,
  reward: true,
  usageLimit: true,
  expiresAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  title: true,
  titleUz: true,
  titleRu: true,
  message: true,
  messageUz: true,
  messageRu: true,
  type: true,
  targetUsers: true,
});

export const insertTeamSchema = createInsertSchema(teams).pick({
  name: true,
  description: true,
  ownerId: true,
  maxMembers: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  nameUz: true,
  nameRu: true,
  description: true,
  reward: true,
  type: true,
  requirements: true,
  startDate: true,
  endDate: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertSkin = z.infer<typeof insertSkinSchema>;
export type Skin = typeof skins.$inferSelect;
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type Business = typeof businesses.$inferSelect;
export type InsertPromoCode = z.infer<typeof insertPromoCodeSchema>;
export type PromoCode = typeof promoCodes.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type EmpireLevel = typeof empireLevels.$inferSelect;
export type UserTask = typeof userTasks.$inferSelect;
export type UserSkin = typeof userSkins.$inferSelect;
export type UserBusiness = typeof userBusinesses.$inferSelect;
export type PromoCodeUsage = typeof promoCodeUsage.$inferSelect;
export type UserNotification = typeof userNotifications.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type UserProject = typeof userProjects.$inferSelect;
export type Setting = typeof settings.$inferSelect;
