# Dubai City Bot - Admin Panel

## Overview

This is a comprehensive admin panel for managing a Dubai City Bot Telegram application. The system is built using a modern full-stack architecture with React frontend, Express.js backend, and PostgreSQL database with Drizzle ORM. The application provides extensive management capabilities for users, game assets, economy, and community features.

**Recent Updates (January 2025):**
- ✅ Migrated from Bolt to Replit environment
- ✅ Created comprehensive database schema with 15+ tables
- ✅ Implemented full backend API for both admin panel and game frontend
- ✅ Added Dubai City Bot game logic with 14-level empire system
- ✅ Complete CRUD operations for all game entities
- ✅ **Telegram Web App Integration**: Added Telegram bot (@DubaiCITY_robot) with Web App functionality
- ✅ **Bot Authentication**: Implemented secure Telegram Web App data verification
- ✅ **Auto User Registration**: Users automatically register via Telegram bot interaction
- ✅ **Referral System**: Added referral code support with bonus rewards
- ✅ **PostgreSQL Database**: Added PostgreSQL database integration with Drizzle ORM and schema push
- ✅ **Enhanced UI**: Fixed balance displays to show full numbers (5,000,000 format) across all sections
- ✅ **Complete Hamster Kombat Design Overhaul (Latest)**: 
  - Exact layout replication with daily task cards at top
  - Large central balance display with animated coin icon
  - Character in blue gradient ring matching Hamster Kombat style
  - Bottom energy/boost layout identical to original
  - Clean combo effects with glowing text (no background frames)
  - Enhanced coin scatter effects with realistic physics
  - Fixed YouTube Premium section performance issues
- ✅ **Real-time Exchange**: Currency rate updates every second in Assets/Exchange section
- ✅ **2x Tap Boost**: Restored tap boost functionality with proper energy/boost controls
- ✅ **Smart Avatar System**: Only active/selected avatar displays on tap button
- ✅ **Rating System**: Added leaderboard section to Empire page with user rankings
- ✅ **Community Features**: Enhanced Community section with proper tab structure (Chat, Members, Announcements, Settings)
- ✅ **Complete Hamster Kombat Layout Implementation (January 2025)**: 
  - Exact screen fitting layout with proper h-screen and flex-col structure
  - Top header section matching Hamster Kombat: profile row, daily tasks, large balance display
  - Main character in blue gradient ring exactly like reference image
  - Bottom energy/boost section properly positioned to prevent cutoff
  - Responsive design ensuring all UI elements fit within screen boundaries
  - Dark background gradients matching Hamster Kombat visual style
  - Daily task cards with green checkmarks and completion status
  - Live rotating coin animation and proper typography
- ✅ **Final Migration to Replit (January 2025)**: 
  - Successfully migrated from Replit Agent to Replit environment
  - Fixed all dependencies and package installation issues
  - Created PostgreSQL database with proper schema
  - Redesigned Empire page to match exact Hamster Kombat layout from user's image
  - Updated top header with proper profile/settings row
  - Added three-stats row showing earn per tap, coins to level up, and profit per hour
  - Large balance display with animated coin icon
  - Character in blue gradient ring with proper sizing
  - Bottom section with energy/boost controls and navigation bar
  - All elements now fit properly on one screen without cutoff
  - Application running smoothly on Replit platform
- ✅ **Projects Section Redesign (January 2025)**:
  - Removed separate Tasks tab from navigation menu
  - Restructured Projects section to include daily rewards and task lists
  - Implemented 12-day progressive daily reward system (4x3 grid)
  - Added premium-style task cards matching Hamster Kombat design
  - Daily reward streak system with proper reset logic
  - Task completion tracking with reward distribution
  - Maintained balance synchronization across all sections
  - Clean UI with proper animations and responsive design
- ✅ **Unified Appearance Selection System (January 2025)**: 
  - Fixed appearance selection logic to allow only one item selected at a time
  - Users can no longer select multiple appearance items simultaneously (avatar + vehicle)
  - When selecting a new appearance item, previously selected items are automatically deselected
  - Improved user experience with consistent selection behavior across all appearance categories
- ✅ **Complete UI/UX Overhaul (January 2025)**:
  - **Balance Display**: Main balance now shows full numbers (5,000,000 format) instead of shortened versions
  - **Level Progress**: Fixed progress bar to work based on current dubaiCoin balance with dynamic filling
  - **Energy System**: Energy consumption now equals tap profit amount (if +20 coins, then -20 energy)
  - **Combo System**: Refined to only work with <0.2 second tap intervals, max 2x multiplier, 20-second duration
  - **Telegram Integration**: Replaced premium icon with user's Telegram photo, level name with username
  - **Premium UI**: Added rounded corners (rounded-xl) to all UI blocks for premium appearance
  - **Icon Updates**: Battery icon for energy, rocket/fire icon for boost with flame effect when active
  - **Layout Improvements**: Centered text in three-stats blocks, team icon next to DubaiCity branding
  - **Luxury Background**: Added Dubai-themed gradient background with golden accents for wealth aesthetic
  - **Removed Combo Display**: Eliminated multiplier text display, showing only coin increase effects
- ✅ **Replit Migration & Final UI Polish (January 2025)**:
  - **Complete Migration**: Successfully migrated from Replit Agent to Replit environment
  - **Rating System Redesign**: Fixed rating modal to start from center of screen with proper layout
  - **Energy/Boost Positioning**: Fixed positioning - boost on bottom right, energy on bottom left
  - **Proper Control Spacing**: Positioned controls above menu block with no overlap using fixed positioning
  - **Enhanced Visibility**: Added backdrop blur background to energy/boost controls for better contrast
  - **Fully Responsive Design**: Implemented comprehensive responsive layout with adaptive sizing, spacing, and positioning across all screen sizes
  - **Adaptive Elements**: All UI components (text, icons, buttons, spacing) now scale properly from mobile to desktop
  - **Sample Users**: Added test users to demonstrate rating system functionality
  - **Clean UI**: Removed unnecessary elements and scroll bars for cleaner interface
- ✅ **Final UI Polish & System Improvements (January 2025)**:
  - **Main Balance Format**: Fixed to always show full numbers (5,000,000) instead of shortened versions
  - **Avatar Size**: Increased tap button avatar to fill entire circle (200px) for better visibility
  - **Energy Refill System**: Added 5 free daily energy refills by clicking battery icon with counter display
  - **Boost Limit System**: Added 3 free daily boosts with counter display and proper notifications
  - **Level System Fix**: Fixed user level detection to show correct level based on actual balance
  - **Rating System Redesign**: Complete overhaul matching Hamster Kombat reference image:
    - Large level avatar with blue gradient background
    - Player cards with square avatars, Telegram usernames, and coin balances
    - Proper rank display (1st gold, 2nd silver, 3rd bronze)
    - User appears in correct level based on balance, not stored level value
  - **Energy Display**: Changed to full number format (5,000/7,000) instead of shortened
  - **Data Consistency**: Ensured balance, tap profit, and hourly income display identically across all sections:
    - Removed problematic Ferrari and Lamborghini vehicles from marketplace
    - Implemented permanent level system where levels never decrease
    - Fixed all stat displays to use consistent formatting and values
- ✅ **Projects Section Restructuring (January 2025)**:
  - **Removed Separate Tasks Tab**: Eliminated standalone "Vazifalar" menu item from navigation
  - **Unified Projects Experience**: Combined daily rewards and tasks into single "Projects" section
  - **Daily Reward System**: Implemented 12-day progressive reward system (4×3 grid) with sequential claiming
  - **Total Rewards Display**: Shows cumulative reward amount (+142,641,500 coins) for completing all 12 days
  - **Balance Integration**: Added main balance display at top of Projects section matching other sections
  - **Task List Redesign**: Premium-style task cards with direct click interaction (no separate button)
  - **Social Media Integration**: Tasks for Telegram, YouTube, X, Exchange, and Referral systems
  - **Streak Reset Logic**: Daily login streak resets if user misses consecutive days
  - **Progressive Rewards**: Daily rewards increase from 500 to 100,000,000 coins over 12 days
- ✅ **Assets Section Complete Redesign (January 2025)**:
  - **Enhanced Balance Display**: Three-column layout with labeled sections (Kurs, Balans, Dollar qiymati)
  - **Fixed Navigation Menu**: Sticky tab navigation preventing content compression
  - **Games Section**: Marketplace-style scratch card design with proper sizing and layout
  - **Exchange (Birja) Section**: Fixed height constraints to prevent menu compression
  - **Promo Codes System**: Premium design with countdown timer, sharing buttons (forward, copy, external link)
  - **Removed Ad Section**: Temporarily removed advertising functionality
  - **YouTube Tasks**: Improved layout matching game card design
  - **Premium Avatar Migration**: Moved all premium avatars to Marketplace Premium section as cards
  - **Responsive Design**: All sections maintain proper proportions without overlapping menus
- ✅ **Assets Section Layout Optimization (January 2025)**:
  - **Exchange Section Fix**: Chart and trading controls now fixed at top, only trading history scrollable
  - **Compact Promo Purchase**: Redesigned promo code purchase section with icon, description, and compact buy button
  - **Enhanced Exchange Rates**: Increased font size for better visibility of Kurs and Qiymat displays
  - **Improved Promo Buttons**: Forward button for Telegram sharing, copy button for clipboard, external button for partner sites
  - **Fixed Scrolling**: Only relevant content sections scroll while maintaining fixed navigation and controls
  - **Removed Modal**: Integrated promo code functionality directly into fixed menu area
- ✅ **Complete UI Responsiveness & Layout Fixes (January 2025)**:
  - **Fixed Menu Overlap**: Added proper padding (pb-20/pb-24) to prevent content hiding behind bottom menu
  - **Improved Copy Functionality**: Added fallback clipboard methods for secure/non-secure contexts
  - **Enhanced Forward Button**: Better Telegram integration with proper sharing text formatting
  - **ScratchCard Game Redesign**: Balance display moved to top header, game area properly centered, responsive layout
  - **Full Responsive Design**: All elements now scale properly across phone, tablet, and desktop screen sizes
  - **Safe Area Handling**: Proper spacing and padding to prevent UI elements from being cut off by device UI
- ✅ **Payment System Integration (January 2025)**:
  - **Wallet Integration**: Comprehensive payment system with UzCard/Humo support
  - **Payment Options**: Bot activation ($0.50), Premium purchase ($2.00), Sponsorship (variable), Company ads ($1.00)
  - **Auto Robot Purchase**: 1M coins direct payment without external wallet
  - **Team Section Fix**: Removed frames from user cards, fixed NaN balance display issues
  - **ScratchCard Improvements**: Removed DC text from balance display, fixed whole number calculations
  - **Enhanced Error Handling**: Better NaN value handling in formatNumberShort and formatNumberFull functions
  - **Profile Payment Section**: Added payment buttons for bot activation, premium purchase, and sponsorship
  - **Simplified Payment Flow**: Direct payment processing without complex modal flows
- ✅ **TON Kashalok Payment Integration (January 2025)**:
  - **TON Cryptocurrency Payments**: Integrated TON (Telegram Open Network) wallet system
  - **Backend TON API**: Created /api/telegram/payment/create for TON wallet transfers
  - **Frontend TON Modal**: Updated SimplePaymentModal to use TON wallet links
  - **TON Wallet Integration**: Direct transfers to user's TON wallet address
  - **Payment Types**: Premium status (2 TON), Bot activation (0.5 TON), and coin purchases
  - **TON Wallet Support**: Works with @wallet bot, TON Wallet, and Tonkeeper
  - **Real-time Processing**: Automatic payment detection and user updates
  - **Telegram Native**: Uses Telegram's built-in cryptocurrency system

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: connect-pg-simple for PostgreSQL session store
- **API Structure**: RESTful API with `/api` prefix

### Development Setup
- **Monorepo Structure**: Shared types and schemas between client and server
- **Hot Reloading**: Vite middleware integration for development
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)

## Key Components

### Admin Panel Modules
1. **Dashboard**: Overview statistics and recent activities
2. **Users Management**: User profiles, status, coins, levels, and actions
3. **Empire Management**: Level system with 14 tiers from beginner to Dubai King
4. **Skins Management**: Game appearance items with rarity and pricing
5. **Tasks Management**: Social media tasks and rewards system
6. **Prices & Rewards**: Configurable pricing for all game elements
7. **Notifications**: Bulk messaging system for users
8. **Market Management**: Business assets (cafes, restaurants, offices, factories)
9. **Assets Management**: Promo codes and YouTube tasks
10. **Projects**: Daily missions and special events
11. **Team Management**: Company/group management with chat features
12. **Profile Management**: Bot configuration and announcements
13. **Reports**: Analytics and data export functionality
14. **Statistics**: User metrics, revenue tracking, and geographic data
15. **Settings**: System configuration and localization

### Game Economy Features
- **Currency System**: Coin-based economy with various earning methods
- **Level Progression**: 14-tier empire system with themed names
- **Asset Ownership**: Businesses that generate hourly profits
- **Referral System**: User invitation rewards
- **Task Rewards**: Social media engagement incentives

## Data Flow

### User Management Flow
1. Users register through Telegram bot
2. Admin panel provides CRUD operations for user data
3. User statistics tracked for analytics and reports
4. Bulk actions available for user management

### Economy Management Flow
1. Admin configures prices and rewards through the panel
2. Users earn coins through tasks, purchases, and referrals
3. Users spend coins on skins, business assets, and upgrades
4. Revenue tracking and analytics provide business insights

### Content Management Flow
1. Admin creates tasks with social media links and rewards
2. Users complete tasks and receive automatic rewards
3. Promo codes provide additional earning opportunities
4. Notifications keep users engaged with new content

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@radix-ui/react-***: Accessible UI component primitives
- **@tanstack/react-query**: Server state management
- **class-variance-authority**: Type-safe styling variants
- **date-fns**: Date manipulation utilities

### Development Dependencies
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **@replit/vite-plugin-***: Replit-specific development tools

### Database Schema
- **PostgreSQL Database**: Production-ready database with all game tables
- **Drizzle ORM**: Type-safe database operations with schema migrations
- **Comprehensive Tables**: 15+ tables including users, tasks, skins, businesses, promo codes, notifications, teams, projects, and more
- **Database Infrastructure**: Includes db.ts for connection management and DatabaseStorage class for future implementation

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations handle schema updates

### Environment Configuration
- **Development**: tsx for hot reloading with Vite middleware
- **Production**: Node.js serves built assets and API routes
- **Database**: Environment variable `DATABASE_URL` for connection

### Deployment Commands
- `npm run dev`: Development server with hot reloading
- `npm run build`: Production build for both frontend and backend
- `npm run start`: Production server
- `npm run db:push`: Apply database schema changes

### Infrastructure Requirements
- Node.js runtime environment
- PostgreSQL database (Neon Database recommended)
- Static file serving capability
- Environment variable support for configuration

The application is designed to be deployed on platforms like Replit, Vercel, or similar Node.js hosting services with PostgreSQL database support.