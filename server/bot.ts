import TelegramBot from 'node-telegram-bot-api';
import { storage } from './storage';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7550271169:AAEOtlJGVARG4zUftlh69hwQX6xUZab3zXc';

if (!BOT_TOKEN || BOT_TOKEN === 'your-telegram-bot-token-here') {
  console.log('🤖 TELEGRAM_BOT_TOKEN not found - Bot disabled for development');
} else {
  console.log('🤖 Telegram Bot Token found - Initializing bot...');
}

class DubaiCityBot {
  private bot: TelegramBot;
  private webAppUrl: string;

  constructor(token: string, webAppUrl: string) {
    this.bot = new TelegramBot(token, { polling: true });
    this.webAppUrl = webAppUrl;
    this.setupCommands();
    console.log('🤖 DubaiCity Bot initialized successfully');
  }

  private setupCommands() {
    // Handle pre-checkout query
    this.bot.on('pre_checkout_query', async (query) => {
      try {
        await this.bot.answerPreCheckoutQuery(query.id, true);
      } catch (error) {
        console.error('Pre-checkout error:', error);
        await this.bot.answerPreCheckoutQuery(query.id, false, 'Payment failed');
      }
    });

    // Handle successful payment
    this.bot.on('successful_payment', async (msg) => {
      try {
        const chatId = msg.chat.id;
        const telegramId = msg.from?.id.toString();
        const payment = msg.successful_payment;

        if (!telegramId || !payment) return;

        const user = await storage.getUserByTelegramId(telegramId);
        if (!user) return;

        const payload = payment.invoice_payload;
        let updateData = {};
        let successMessage = '';

        if (payload.includes('premium')) {
          updateData = { premiumStatus: true, premiumUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) };
          successMessage = '🎉 Premium faollashtirildi!';
        } else if (payload.includes('activation')) {
          updateData = { isActive: true };
          successMessage = '✅ Bot faollashtirildi!';
        } else if (payload.includes('coins')) {
          const coinAmount = 1000000;
          updateData = { dubaiCoin: (user.dubaiCoin || 0) + coinAmount };
          successMessage = `💰 ${coinAmount.toLocaleString()} coin qo'shildi!`;
        }

        await storage.updateUser(user.id, updateData);
        await this.bot.sendMessage(chatId, successMessage);

      } catch (error) {
        console.error('Payment error:', error);
      }
    });

    // Start command with referral support
    this.bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
      const chatId = msg.chat.id;
      const telegramId = msg.from?.id.toString();
      const username = msg.from?.username;
      const firstName = msg.from?.first_name || '';
      const lastName = msg.from?.last_name || '';
      const referralCode = match?.[1];

      if (!telegramId) return;

      try {
        let user = await storage.getUserByTelegramId(telegramId);
        let isNewUser = false;

        if (!user) {
          const userReferralCode = `DC${telegramId.slice(-6)}`;
          const newUser = {
            telegramId,
            username: username || `user_${telegramId}`,
            firstName,
            lastName,
            language: 'uz',
            isActive: true,
            dubaiCoin: 1000,
            level: 1,
            profileImage: null,
            referralCode: userReferralCode,
            referredBy: null,
            premiumStatus: false,
          };

          user = await storage.createUser(newUser);
          isNewUser = true;

          // Referral bonus
          if (referralCode && referralCode.startsWith('DC')) {
            try {
              const referrer = await storage.getUserByReferralCode(referralCode);
              if (referrer && referrer.id !== user.id) {
                await storage.updateUser(referrer.id, {
                  dubaiCoin: (referrer.dubaiCoin || 0) + 5000
                });
                await storage.updateUser(user.id, {
                  dubaiCoin: (user.dubaiCoin || 1000) + 2000,
                  referredBy: referrer.id
                });

                try {
                  await this.bot.sendMessage(referrer.telegramId!, 
                    `🎉 Yangi foydalanuvchi taklifingiz orqali qo'shildi!\n💰 +5000 coin bonus!`
                  );
                } catch (notifyError) {
                  console.error('Referrer notify error:', notifyError);
                }
              }
            } catch (parseError) {
              console.error('Referral parse error:', parseError);
            }
          }
        }

        const welcomeMessage = isNewUser
          ? `🎉 Xush kelibsiz Dubai City Bot ga, ${firstName}!\n\n` +
            `🏙️ Dubai imperiyangizni qurishni boshlang!\n\n` +
            `💰 Coinlar: ${(user.dubaiCoin || 0).toLocaleString()}\n` +
            `🏆 Daraja: ${user.level}\n` +
            `🎁 Taklif kodi: ${user.referralCode}\n\n` +
            `O'yinni boshlash uchun tugmani bosing:`
          : `🎮 Yana xush kelibsiz, ${firstName}!\n\n` +
            `💰 Coinlar: ${(user.dubaiCoin || 0).toLocaleString()}\n` +
            `🏆 Daraja: ${user.level}\n\n` +
            `O'yinni davom ettirish uchun tugmani bosing:`;

        await this.bot.sendMessage(chatId, welcomeMessage, {
          reply_markup: {
            inline_keyboard: [
              [{ text: '🎮 O\'yinni boshlash', web_app: { url: this.webAppUrl } }],
              [
                { text: '📊 Profil', callback_data: 'profile' },
                { text: '🎁 Taklif qilish', callback_data: 'referral' }
              ],
              [
                { text: '📢 Kanalimiz', url: process.env.CHANNEL_URL || 'https://t.me/DubaiCity_live' }
              ]
            ]
          }
        });

      } catch (error) {
        console.error('Start command error:', error);
        await this.bot.sendMessage(chatId, '❌ Xatolik yuz berdi. Qayta urinib ko\'ring.');
      }
    });

    // Profile command
    this.bot.onText(/\/profile/, async (msg) => {
      const chatId = msg.chat.id;
      const telegramId = msg.from?.id.toString();

      if (!telegramId) return;

      try {
        const user = await storage.getUserByTelegramId(telegramId);
        if (!user) {
          await this.bot.sendMessage(chatId, '❌ Foydalanuvchi topilmadi. /start buyrug\'ini bosing.');
          return;
        }

        const allUsers = await storage.getAllUsers();
        const referralCount = allUsers.filter(u => u.referredBy === user.id).length;

        const profileMessage = 
          `👤 Profilingiz:\n\n` +
          `📛 Ism: ${user.firstName} ${user.lastName || ''}\n` +
          `💰 Coinlar: ${(user.dubaiCoin || 0).toLocaleString()}\n` +
          `🏆 Daraja: ${user.level}\n` +
          `👥 Takliflar: ${referralCount}\n` +
          `🎁 Taklif kodi: ${user.referralCode}\n` +
          `🌟 Premium: ${user.premiumStatus ? 'Ha ✅' : 'Yo\'q ❌'}`;

        await this.bot.sendMessage(chatId, profileMessage, {
          reply_markup: {
            inline_keyboard: [
              [{ text: '🎮 O\'yinni ochish', web_app: { url: this.webAppUrl } }],
              [{ text: '🎁 Do\'st taklif qilish', callback_data: 'referral' }]
            ]
          }
        });

      } catch (error) {
        console.error('Profile error:', error);
        await this.bot.sendMessage(chatId, '❌ Profil ma\'lumotlarini olishda xatolik.');
      }
    });

    // Help command
    this.bot.onText(/\/help/, async (msg) => {
      const chatId = msg.chat.id;
      const helpMessage = 
        `🆘 Dubai City Bot Yordam:\n\n` +
        `🎮 /start - O'yinni boshlash\n` +
        `👤 /profile - Profilingizni ko'rish\n` +
        `🆘 /help - Yordam\n\n` +
        `🏙️ Dubai imperiyangizni qurishga yo'naltirilgan o'yin!\n\n` +
        `💰 Coinlar to'plang\n` +
        `🏆 Darajangizni oshiring\n` +
        `👥 Do'stlaringizni taklif qiling`;

      await this.bot.sendMessage(chatId, helpMessage);
    });

    // Callback query handler
    this.bot.on('callback_query', async (query) => {
      const chatId = query.message?.chat.id;
      const telegramId = query.from.id.toString();
      const data = query.data;

      if (!chatId) return;

      try {
        switch (data) {
          case 'profile':
            const user = await storage.getUserByTelegramId(telegramId);
            if (user) {
              const allUsers = await storage.getAllUsers();
              const referralCount = allUsers.filter(u => u.referredBy === user.id).length;

              const profileMessage = 
                `👤 Profil:\n\n` +
                `💰 Coinlar: ${(user.dubaiCoin || 0).toLocaleString()}\n` +
                `🏆 Daraja: ${user.level}\n` +
                `👥 Takliflar: ${referralCount}\n` +
                `🎁 Taklif kodi: ${user.referralCode}\n` +
                `🌟 Premium: ${user.premiumStatus ? 'Ha ✅' : 'Yo\'q ❌'}`;

              await this.bot.editMessageText(profileMessage, {
                chat_id: chatId,
                message_id: query.message?.message_id,
                reply_markup: {
                  inline_keyboard: [
                    [{ text: '🎮 O\'yinni ochish', web_app: { url: this.webAppUrl } }],
                    [{ text: '🎁 Do\'st taklif qilish', callback_data: 'referral' }]
                  ]
                }
              });
            }
            break;

          case 'referral':
            const referralUser = await storage.getUserByTelegramId(telegramId);
            if (referralUser) {
              const allUsers = await storage.getAllUsers();
              const referralCount = allUsers.filter(u => u.referredBy === referralUser.id).length;
              const totalEarned = referralCount * 5000;

              const referralMessage = 
                `🎁 Do'stlaringizni taklif qiling!\n\n` +
                `💎 Har bir do'st uchun: 5000 coin\n` +
                `👥 Taklif qilganlar: ${referralCount}\n` +
                `💰 Jami: ${totalEarned.toLocaleString()} coin\n\n` +
                `🔗 Taklif havolangiz:\n` +
                `https://t.me/DubaiCITY_robot?start=${referralUser.referralCode}`;

              await this.bot.editMessageText(referralMessage, {
                chat_id: chatId,
                message_id: query.message?.message_id,
                reply_markup: {
                  inline_keyboard: [
                    [{ text: '📤 Havola yuborish', switch_inline_query: `🎮 Dubai City Bot ga qo'shiling! 💰\n\nhttps://t.me/DubaiCITY_robot?start=${referralUser.referralCode}` }],
                    [{ text: '🔙 Orqaga', callback_data: 'back_to_main' }]
                  ]
                }
              });
            }
            break;

          case 'back_to_main':
            const mainUser = await storage.getUserByTelegramId(telegramId);
            if (mainUser) {
              const mainMessage = 
                `🎮 Dubai City Bot\n\n` +
                `💰 Coinlar: ${(mainUser.dubaiCoin || 0).toLocaleString()}\n` +
                `🏆 Daraja: ${mainUser.level}`;

              await this.bot.editMessageText(mainMessage, {
                chat_id: chatId,
                message_id: query.message?.message_id,
                reply_markup: {
                  inline_keyboard: [
                    [{ text: '🎮 O\'yinni boshlash', web_app: { url: this.webAppUrl } }],
                    [
                      { text: '📊 Profil', callback_data: 'profile' },
                      { text: '🎁 Taklif qilish', callback_data: 'referral' }
                    ]
                  ]
                }
              });
            }
            break;
        }

        await this.bot.answerCallbackQuery(query.id);
      } catch (error) {
        console.error('Callback error:', error);
        await this.bot.answerCallbackQuery(query.id, {
          text: '❌ Xatolik yuz berdi',
          show_alert: true
        });
      }
    });

    // Error handling
    this.bot.on('error', (error) => {
      console.error('Bot error:', error);
    });

    this.bot.on('polling_error', (error) => {
      console.error('Polling error:', error);
    });
  }

  public async sendNotification(telegramId: string, message: string) {
    try {
      await this.bot.sendMessage(telegramId, message);
      return true;
    } catch (error) {
      console.error(`Notification error ${telegramId}:`, error);
      return false;
    }
  }

  public async sendBulkNotification(telegramIds: string[], message: string) {
    const results = [];
    for (const telegramId of telegramIds) {
      const success = await this.sendNotification(telegramId, message);
      results.push({ telegramId, success });
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return results;
  }
}

let dubaiCityBot: DubaiCityBot | null = null;

if (BOT_TOKEN) {
  const webAppUrl = process.env.WEB_APP_URL || 
    (process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : 'https://workspace.jefeji1173.repl.co');

  dubaiCityBot = new DubaiCityBot(BOT_TOKEN, webAppUrl);
  console.log('Dubai City Bot initialized');
  console.log('Web App URL:', webAppUrl);
} else {
  console.warn('TELEGRAM_BOT_TOKEN not found');
}

export { dubaiCityBot, DubaiCityBot };
export const bot = dubaiCityBot;