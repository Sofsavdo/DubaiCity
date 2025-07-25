import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { insertUserSchema } from '@shared/schema';
import crypto from 'crypto';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const BOT_USERNAME = process.env.BOT_USERNAME || 'DubaiCITY_robot';
const CHANNEL_URL = process.env.CHANNEL_URL || 'https://t.me/DubaiCity_live';
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://dubai-city-lilac.vercel.app';

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    chat: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      type: string;
    };
    date: number;
    text?: string;
    entities?: Array<{
      offset: number;
      length: number;
      type: string;
    }>;
  };
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

// Validate Telegram webhook data
function validateTelegramData(data: string, hash: string): boolean {
  const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest();
  const calculatedHash = crypto.createHmac('sha256', secret).update(data).digest('hex');
  return calculatedHash === hash;
}

// Send message to Telegram
async function sendTelegramMessage(chatId: number, text: string, replyMarkup?: any) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    reply_markup: replyMarkup,
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    throw error;
  }
}

// Handle /start command
async function handleStartCommand(user: TelegramUser, chatId: number, startParam?: string) {
  const messages = {
    uz: {
      welcome: `🏙️ <b>Dubai City</b>ga xush kelibsiz, ${user.first_name}!\n\n💰 Tangalar yig'ing va o'z imperiyangizni qurib chiqing!\n⚡ Energiyadan foydalanib tangalar ishlab topingv\n🏢 Bizneslar sotib oling va passiv daromad qiling\n🎁 Har kungi sovg'alar va bonuslar\n\n👥 Do'stlaringizni taklif qiling va qo'shimcha bonuslar oling!`,
      button: "🎮 O'yinni boshlash",
      channel: "📢 Kanalga obuna bo'ling",
      help: "❓ Yordam"
    },
    ru: {
      welcome: `🏙️ Добро пожаловать в <b>Dubai City</b>, ${user.first_name}!\n\n💰 Собирайте монеты и стройте свою империю!\n⚡ Используйте энергию для заработка монет\n🏢 Покупайте бизнесы и получайте пассивный доход\n🎁 Ежедневные награды и бонусы\n\n👥 Приглашайте друзей и получайте дополнительные бонусы!`,
      button: "🎮 Начать игру",
      channel: "📢 Подписаться на канал",
      help: "❓ Помощь"
    },
    en: {
      welcome: `🏙️ Welcome to <b>Dubai City</b>, ${user.first_name}!\n\n💰 Collect coins and build your empire!\n⚡ Use energy to earn coins\n🏢 Buy businesses and earn passive income\n🎁 Daily rewards and bonuses\n\n👥 Invite friends and get extra bonuses!`,
      button: "🎮 Start Game",
      channel: "📢 Join Channel",
      help: "❓ Help"
    }
  };
  
  const lang = user.language_code?.startsWith('uz') ? 'uz' : 
               user.language_code?.startsWith('ru') ? 'ru' : 'en';
  
  const msg = messages[lang];
  
  const keyboard = {
    inline_keyboard: [
      [
        {
          text: msg.button,
          web_app: { url: startParam ? `${WEBAPP_URL}?start=${startParam}` : WEBAPP_URL }
        }
      ],
      [
        {
          text: msg.channel,
          url: CHANNEL_URL
        },
        {
          text: msg.help,
          callback_data: 'help'
        }
      ]
    ]
  };
  
  // Create or update user in database
  try {
    let dbUser = await storage.getUserByTelegramId(user.id.toString());
    
    if (!dbUser) {
      // Create new user
      dbUser = await storage.createUser({
        telegramId: user.id.toString(),
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        languageCode: lang,
        referredBy: startParam,
        coins: startParam ? 3000 : 1000, // Bonus for referral
      });
      
      // Create initial game stats
      await storage.createGameStats({
        userId: dbUser.id,
        totalTaps: 0,
        totalCoinsEarned: 0,
        totalEnergyUsed: 0,
        playTimeMinutes: 0,
      });
      
      // Handle referral bonus
      if (startParam) {
        try {
          const referrer = await storage.getUserByTelegramId(startParam);
          if (referrer) {
            await storage.updateUser(referrer.id, {
              referralCount: referrer.referralCount + 1,
              referralEarnings: referrer.referralEarnings + 5000,
              coins: referrer.coins + 5000,
            });
            
            // Send referral bonus notification
            const referralMsg = lang === 'uz' 
              ? `🎉 Tabriklaymiz! ${user.first_name} sizning taklif linkingiz orqali o'yinga qo'shildi!\n\n💰 +5000 tanga bonusi olindi!`
              : lang === 'ru'
              ? `🎉 Поздравляем! ${user.first_name} присоединился к игре по вашей ссылке!\n\n💰 Получен бонус +5000 монет!`
              : `🎉 Congratulations! ${user.first_name} joined the game through your referral link!\n\n💰 +5000 coins bonus received!`;
            
            await sendTelegramMessage(referrer.telegramId, referralMsg);
          }
        } catch (error) {
          console.error('Error processing referral:', error);
        }
      }
    } else {
      // Update existing user
      await storage.updateUser(dbUser.id, {
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        languageCode: lang,
        lastActiveAt: new Date(),
      });
    }
  } catch (error) {
    console.error('Error handling user in database:', error);
  }
  
  await sendTelegramMessage(chatId, msg.welcome, keyboard);
}

// Handle help command
async function handleHelpCommand(user: TelegramUser, chatId: number) {
  const messages = {
    uz: {
      help: `❓ <b>Dubai City Yordam</b>\n\n🎮 <b>O'yin haqida:</b>\n• Tangalar yig'ish uchun building tugmasiga bosing\n• Energiyangizni kuzatib turing\n• Bizneslar sotib oling va passiv daromad qiling\n• Har kun sovg'alar oling\n\n💰 <b>Tangalar:</b>\n• Har bir bosish uchun tangalar olasiz\n• Energiya sarflanadi\n• Bizneslar sizga doimiy daromad beradi\n\n👥 <b>Referral:</b>\n• Do'stlaringizni taklif qiling\n• Har bir do'st uchun 5000 tanga\n• Do'stingiz 2000 tanga bonus oladi\n\n🎁 <b>Bonuslar:</b>\n• Har kungi sovg'alar\n• Vazifalarni bajarish\n• Premium xususiyatlar\n\n📞 <b>Yordam:</b>\n• Savol va takliflar: @DubaiCity_live`
    },
    ru: {
      help: `❓ <b>Помощь Dubai City</b>\n\n🎮 <b>Об игре:</b>\n• Нажимайте на здание для сбора монет\n• Следите за своей энергией\n• Покупайте бизнесы для пассивного дохода\n• Получайте ежедневные награды\n\n💰 <b>Монеты:</b>\n• За каждое нажатие получаете монеты\n• Тратится энергия\n• Бизнесы дают постоянный доход\n\n👥 <b>Рефералы:</b>\n• Приглашайте друзей\n• 5000 монет за каждого друга\n• Друг получает бонус 2000 монет\n\n🎁 <b>Бонусы:</b>\n• Ежедневные награды\n• Выполнение заданий\n• Премиум функции\n\n📞 <b>Поддержка:</b>\n• Вопросы и предложения: @DubaiCity_live`
    },
    en: {
      help: `❓ <b>Dubai City Help</b>\n\n🎮 <b>About the game:</b>\n• Tap the building to collect coins\n• Watch your energy level\n• Buy businesses for passive income\n• Collect daily rewards\n\n💰 <b>Coins:</b>\n• Each tap earns you coins\n• Energy is consumed\n• Businesses provide constant income\n\n👥 <b>Referrals:</b>\n• Invite friends\n• 5000 coins per friend\n• Friend gets 2000 coins bonus\n\n🎁 <b>Bonuses:</b>\n• Daily rewards\n• Task completion\n• Premium features\n\n📞 <b>Support:</b>\n• Questions and suggestions: @DubaiCity_live`
    }
  };
  
  const lang = user.language_code?.startsWith('uz') ? 'uz' : 
               user.language_code?.startsWith('ru') ? 'ru' : 'en';
  
  await sendTelegramMessage(chatId, messages[lang].help);
}

// Main webhook handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const update: TelegramUpdate = req.body;
    
    if (!update.message) {
      return res.status(200).json({ ok: true });
    }
    
    const { message } = update;
    const user = message.from;
    const chatId = message.chat.id;
    const text = message.text || '';
    
    // Handle /start command
    if (text.startsWith('/start')) {
      const startParam = text.split(' ')[1]; // Get referral parameter
      await handleStartCommand(user, chatId, startParam);
    }
    // Handle /help command
    else if (text === '/help') {
      await handleHelpCommand(user, chatId);
    }
    // Handle /stats command
    else if (text === '/stats') {
      try {
        const dbUser = await storage.getUserByTelegramId(user.id.toString());
        if (dbUser) {
          const gameStats = await storage.getUserGameStats(dbUser.id);
          const statsMsg = `📊 <b>Your Statistics</b>\n\n` +
            `💰 Coins: ${dbUser.coins.toLocaleString()}\n` +
            `⚡ Energy: ${dbUser.energy}/${dbUser.maxEnergy}\n` +
            `🏆 Level: ${dbUser.level} (${dbUser.empireTitle})\n` +
            `📈 Experience: ${dbUser.experience.toLocaleString()}\n` +
            `👥 Referrals: ${dbUser.referralCount}\n` +
            `🎯 Total Taps: ${gameStats?.totalTaps || 0}\n` +
            `💎 Total Earned: ${gameStats?.totalCoinsEarned || 0}`;
          
          await sendTelegramMessage(chatId, statsMsg);
        }
      } catch (error) {
        console.error('Error getting stats:', error);
      }
    }
    // Handle /referral command
    else if (text === '/referral') {
      try {
        const dbUser = await storage.getUserByTelegramId(user.id.toString());
        if (dbUser) {
          const referralLink = `https://t.me/${BOT_USERNAME}?start=${dbUser.telegramId}`;
          const referralMsg = `👥 <b>Referral System</b>\n\n` +
            `🔗 Your referral link:\n${referralLink}\n\n` +
            `📊 <b>Statistics:</b>\n` +
            `• Invited friends: ${dbUser.referralCount}\n` +
            `• Coins earned: ${dbUser.referralEarnings.toLocaleString()}\n\n` +
            `💰 <b>Rewards:</b>\n` +
            `• You get 5000 coins per friend\n` +
            `• Friend gets 2000 coins bonus\n\n` +
            `📤 Share your link and earn more coins!`;
          
          const keyboard = {
            inline_keyboard: [
              [
                {
                  text: "📤 Share Referral Link",
                  switch_inline_query: `Join me in Dubai City! 🏙️ ${referralLink}`
                }
              ]
            ]
          };
          
          await sendTelegramMessage(chatId, referralMsg, keyboard);
        }
      } catch (error) {
        console.error('Error getting referral info:', error);
      }
    }
    // Default response for unknown commands
    else {
      const unknownMsg = user.language_code?.startsWith('uz') 
        ? "❓ Noma'lum buyruq. /help tugmasini bosing."
        : user.language_code?.startsWith('ru')
        ? "❓ Неизвестная команда. Нажмите /help для помощи."
        : "❓ Unknown command. Press /help for assistance.";
      
      await sendTelegramMessage(chatId, unknownMsg);
    }
    
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error handling Telegram webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
