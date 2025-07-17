# 🚀 Dubai City - Complete Deployment Guide (FIXED)

## 📋 Overview

This guide provides step-by-step instructions for deploying the Dubai City project with all issues fixed:

- **Frontend Game** → Vercel
- **Backend API + Admin Panel** → Render
- **Database** → PostgreSQL (Neon, Supabase, or Render)

## 🔧 Pre-Deployment Fixes Applied

### ✅ 1. Database Schema Unified
- Both repositories now use the same database schema
- Consistent field names and types
- Support for both game and admin functionality

### ✅ 2. API Configuration Fixed
- Dynamic API URLs based on environment
- Proper CORS configuration
- Error handling and retry logic

### ✅ 3. Build Process Optimized
- Frontend builds only client code
- Backend builds API server and admin panel
- Proper TypeScript configurations

### ✅ 4. Deployment Configurations Updated
- Vercel configuration for SPA routing
- Render configuration for backend deployment
- Environment variable management

## 🎯 Deployment Steps

### Step 1: Database Setup

#### Option A: Neon Database (Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Format: `postgresql://username:password@host:5432/database?sslmode=require`

#### Option B: Supabase Database
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string

#### Option C: Render PostgreSQL
1. In Render dashboard, create a new PostgreSQL database
2. Copy the connection string from the database info

### Step 2: Backend Deployment (Render)

#### 2.1 Connect Repository
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `https://github.com/Sofsavdo/DubaiCity_Admin.git`

#### 2.2 Configure Service
- **Name**: `dubai-city-backend`
- **Runtime**: `Node`
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Build Command**: `npm install`
- **Start Command**: `npm start`

#### 2.3 Environment Variables
Add these in Render dashboard:

```bash
# Required
NODE_ENV=production
DATABASE_URL=your_postgresql_connection_string
PORT=10000

# Optional (for Telegram bot)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TON_WALLET_ADDRESS=your_ton_wallet_address

# CORS Origins (add your frontend domain)
CORS_ORIGINS=https://your-frontend.vercel.app,https://t.me,https://web.telegram.org
```

#### 2.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://dubai-city-backend.onrender.com`

### Step 3: Frontend Deployment (Vercel)

#### 3.1 Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import from GitHub: `https://github.com/Sofsavdo/DubaiCity.git`

#### 3.2 Configure Project
- **Framework Preset**: Vite
- **Root Directory**: Leave empty
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

#### 3.3 Environment Variables
Add these in Vercel dashboard:

```bash
# Required
VITE_API_URL=https://dubai-city-backend.onrender.com
NODE_ENV=production

# Optional (for Telegram integration)
VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
VITE_TON_WALLET_ADDRESS=your_ton_wallet_address
```

#### 3.4 Deploy
1. Click "Deploy"
2. Wait for deployment (3-5 minutes)
3. Note your frontend URL: `https://your-app.vercel.app`

### Step 4: Update CORS Configuration

After getting your frontend URL, update the backend CORS configuration:

1. Go to Render dashboard
2. Open your backend service
3. Go to Environment
4. Update `CORS_ORIGINS` to include your Vercel URL:
   ```
   CORS_ORIGINS=https://your-app.vercel.app,https://t.me,https://web.telegram.org
   ```
5. Redeploy the service

### Step 5: Database Migration

#### 5.1 Run Migration
```bash
# Clone the admin repository
git clone https://github.com/Sofsavdo/DubaiCity_Admin.git
cd DubaiCity_Admin

# Install dependencies
npm install

# Set environment variables
export DATABASE_URL="your_postgresql_connection_string"

# Run migration
npx drizzle-kit push:pg
```

#### 5.2 Seed Initial Data (Optional)
```bash
# Run seed script
npm run seed
```

### Step 6: Telegram Bot Setup

#### 6.1 Create Telegram Bot
1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Use `/newbot` command
3. Follow instructions to create bot
4. Copy the bot token

#### 6.2 Configure Web App
1. Use `/setmenubutton` command with BotFather
2. Set the button URL to your Vercel frontend URL
3. Configure bot description and about text

#### 6.3 Update Environment Variables
Add the bot token to both Render and Vercel:
- Render: `TELEGRAM_BOT_TOKEN=your_bot_token`
- Vercel: `VITE_TELEGRAM_BOT_TOKEN=your_bot_token`

## 🧪 Testing Deployment

### Backend Health Check
```bash
curl https://dubai-city-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "database": "connected"
}
```

### Frontend Access
1. Open your Vercel URL in browser
2. Check that the game loads properly
3. Test API connectivity

### API Integration Test
```bash
# Test user creation
curl -X POST https://dubai-city-backend.onrender.com/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","telegramId":"123456789"}'
```

## 🔍 Troubleshooting

### Common Issues

#### 1. CORS Errors
- Check that frontend URL is in CORS_ORIGINS
- Verify environment variables are set correctly
- Redeploy backend after CORS changes

#### 2. Database Connection Issues
- Verify DATABASE_URL format
- Check database is accessible from Render
- Ensure SSL mode is enabled

#### 3. Build Failures
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review build logs for specific errors

#### 4. API Not Responding
- Check backend health endpoint
- Verify environment variables
- Review server logs in Render dashboard

### Debugging Commands

```bash
# Check backend logs
# Go to Render dashboard → Your service → Logs

# Check frontend build logs
# Go to Vercel dashboard → Your project → Functions

# Test API locally
npm run dev:backend
curl http://localhost:3001/api/health
```

## 📊 Monitoring

### Backend Monitoring
- Monitor response times in Render dashboard
- Check error rates and logs
- Set up alerts for downtime

### Frontend Monitoring
- Monitor deployment status in Vercel
- Check Core Web Vitals
- Monitor API request success rates

## 🔄 Updates and Maintenance

### Updating Backend
1. Push changes to GitHub
2. Render auto-deploys from main branch
3. Monitor deployment in dashboard

### Updating Frontend
1. Push changes to GitHub
2. Vercel auto-deploys from main branch
3. Monitor deployment in dashboard

### Database Updates
1. Update schema files
2. Run migration: `npx drizzle-kit push:pg`
3. Test changes in staging environment

## 🎉 Success Checklist

- [ ] Backend deployed and healthy
- [ ] Frontend deployed and accessible
- [ ] Database connected and migrated
- [ ] CORS configured correctly
- [ ] API integration working
- [ ] Telegram bot configured
- [ ] All environment variables set
- [ ] Monitoring set up

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review deployment logs
3. Verify environment variables
4. Test API endpoints manually

Your Dubai City project is now ready for production! 🚀