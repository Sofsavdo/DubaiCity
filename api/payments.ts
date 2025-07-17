import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import crypto from 'crypto';
import cors from 'cors';

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://dubai-city-lilac.vercel.app', 'https://t.me']
    : ['http://localhost:5000', 'http://localhost:3000'],
  credentials: true,
};

const corsMiddleware = cors(corsOptions);

function runMiddleware(req: VercelRequest, res: VercelResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TON_WALLET_ADDRESS = process.env.TON_WALLET_ADDRESS || '';

interface PaymentItem {
  label: string;
  amount: number;
}

interface PaymentRequest {
  userId: number;
  type: 'premium' | 'coins' | 'activation' | 'energy';
  amount: number;
  currency: string;
  description: string;
}

interface TelegramPayment {
  invoice_payload: string;
  shipping_option_id?: string;
  order_info?: {
    name?: string;
    phone_number?: string;
    email?: string;
    shipping_address?: {
      country_code: string;
      state: string;
      city: string;
      street_line1: string;
      street_line2?: string;
      post_code: string;
    };
  };
  telegram_payment_charge_id: string;
  provider_payment_charge_id: string;
  total_amount: number;
}

// Predefined payment packages
const PAYMENT_PACKAGES = {
  premium: {
    title: 'Premium Status',
    description: 'Unlock premium features and exclusive content',
    amount: 200, // 2.00 TON in smallest units
    currency: 'TON',
    benefits: ['2x coin multiplier', 'Exclusive skins', 'Priority support'],
  },
  coins_1m: {
    title: '1M Coins',
    description: 'Get 1 million coins instantly',
    amount: 100, // 1.00 TON in smallest units
    currency: 'TON',
    coins: 1000000,
  },
  energy_boost: {
    title: 'Energy Booster',
    description: 'Increase max energy by 500',
    amount: 50, // 0.50 TON in smallest units
    currency: 'TON',
    energy: 500,
  },
  activation: {
    title: 'Bot Activation',
    description: 'Activate premium bot features',
    amount: 50, // 0.50 TON in smallest units
    currency: 'TON',
    benefits: ['Unlock all features', 'Remove limitations'],
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await runMiddleware(req, res, corsMiddleware);
  
  const { method, query } = req;
  const endpoint = query.endpoint as string;
  
  try {
    switch (method) {
      case 'GET':
        await handleGET(req, res, endpoint);
        break;
      case 'POST':
        await handlePOST(req, res, endpoint);
        break;
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Payment API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGET(req: VercelRequest, res: VercelResponse, endpoint: string) {
  const { userId } = req.query;
  
  switch (endpoint) {
    case 'packages':
      res.json(PAYMENT_PACKAGES);
      break;
      
    case 'payments':
      if (!userId) {
        return res.status(400).json({ error: 'User ID required' });
      }
      
      const payments = await storage.getUserPayments(parseInt(userId as string));
      res.json(payments);
      break;
      
    case 'wallet':
      res.json({ 
        address: TON_WALLET_ADDRESS,
        network: 'mainnet',
        currency: 'TON'
      });
      break;
      
    default:
      res.status(404).json({ error: 'Endpoint not found' });
  }
}

async function handlePOST(req: VercelRequest, res: VercelResponse, endpoint: string) {
  const body = req.body;
  
  switch (endpoint) {
    case 'create-invoice':
      const { userId, packageType, telegramUserId } = body;
      
      if (!userId || !packageType || !telegramUserId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      const package = PAYMENT_PACKAGES[packageType as keyof typeof PAYMENT_PACKAGES];
      if (!package) {
        return res.status(400).json({ error: 'Invalid package type' });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Create payment record
      const payment = await storage.createPayment({
        userId,
        amount: package.amount / 100, // Convert to actual amount
        currency: package.currency,
        type: packageType,
        status: 'pending',
      });
      
      // Create Telegram invoice
      const invoice = await createTelegramInvoice(
        telegramUserId,
        package,
        payment.id.toString()
      );
      
      res.json({
        paymentId: payment.id,
        invoiceLink: invoice.invoice_link,
        invoice,
      });
      break;
      
    case 'webhook':
      // Handle Telegram payment webhook
      await handlePaymentWebhook(req, res);
      break;
      
    case 'verify':
      const { paymentId, telegramPaymentId } = body;
      
      if (!paymentId || !telegramPaymentId) {
        return res.status(400).json({ error: 'Missing payment information' });
      }
      
      const verificationResult = await verifyPayment(paymentId, telegramPaymentId);
      res.json(verificationResult);
      break;
      
    case 'ton-payment':
      // Handle direct TON payment
      const { fromAddress, toAddress, amount, transactionHash } = body;
      
      if (!fromAddress || !toAddress || !amount || !transactionHash) {
        return res.status(400).json({ error: 'Missing transaction information' });
      }
      
      // Verify TON transaction (this would need actual TON blockchain integration)
      const tonResult = await verifyTONTransaction(transactionHash, amount);
      res.json(tonResult);
      break;
      
    default:
      res.status(404).json({ error: 'Endpoint not found' });
  }
}

async function createTelegramInvoice(telegramUserId: number, package: any, payloadId: string) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`;
  
  const invoice = {
    title: package.title,
    description: package.description,
    payload: payloadId,
    provider_token: '', // Use empty string for TON payments
    currency: package.currency,
    prices: [
      {
        label: package.title,
        amount: package.amount,
      }
    ],
    need_name: false,
    need_phone_number: false,
    need_email: false,
    need_shipping_address: false,
    send_phone_number_to_provider: false,
    send_email_to_provider: false,
    is_flexible: false,
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoice),
    });
    
    const result = await response.json();
    
    if (!result.ok) {
      throw new Error(`Telegram API error: ${result.description}`);
    }
    
    return {
      invoice_link: result.result,
      payload: payloadId,
    };
  } catch (error) {
    console.error('Error creating Telegram invoice:', error);
    throw error;
  }
}

async function handlePaymentWebhook(req: VercelRequest, res: VercelResponse) {
  const update = req.body;
  
  // Handle successful payment
  if (update.pre_checkout_query) {
    const preCheckout = update.pre_checkout_query;
    
    // Verify payment before processing
    const isValid = await verifyPreCheckout(preCheckout);
    
    const answerPreCheckout = {
      pre_checkout_query_id: preCheckout.id,
      ok: isValid,
      error_message: isValid ? undefined : 'Payment verification failed',
    };
    
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/answerPreCheckoutQuery`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answerPreCheckout),
    });
    
    return res.status(200).json({ ok: true });
  }
  
  // Handle completed payment
  if (update.message?.successful_payment) {
    const payment = update.message.successful_payment;
    const userId = update.message.from.id;
    
    await processSuccessfulPayment(userId, payment);
    
    return res.status(200).json({ ok: true });
  }
  
  res.status(200).json({ ok: true });
}

async function verifyPreCheckout(preCheckout: any): Promise<boolean> {
  try {
    const paymentId = parseInt(preCheckout.invoice_payload);
    const payment = await storage.getUserPayments(paymentId);
    
    // Verify payment exists and is pending
    return payment.length > 0 && payment[0].status === 'pending';
  } catch (error) {
    console.error('Error verifying pre-checkout:', error);
    return false;
  }
}

async function processSuccessfulPayment(telegramUserId: number, payment: TelegramPayment) {
  try {
    const paymentId = parseInt(payment.invoice_payload);
    const dbPayment = await storage.getUserPayments(paymentId);
    
    if (dbPayment.length === 0) {
      throw new Error('Payment not found');
    }
    
    const paymentRecord = dbPayment[0];
    const user = await storage.getUser(paymentRecord.userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Update payment status
    await storage.updatePayment(paymentId, {
      status: 'completed',
      transactionId: payment.telegram_payment_charge_id,
      completedAt: new Date(),
    });
    
    // Apply payment benefits
    await applyPaymentBenefits(user, paymentRecord.type, paymentRecord.amount);
    
    // Send confirmation message
    await sendPaymentConfirmation(telegramUserId, paymentRecord.type);
    
  } catch (error) {
    console.error('Error processing successful payment:', error);
  }
}

async function applyPaymentBenefits(user: any, type: string, amount: number) {
  const updates: any = {};
  
  switch (type) {
    case 'premium':
      updates.isPremium = true;
      updates.coinsPerTap = user.coinsPerTap * 2; // Double coin multiplier
      break;
      
    case 'coins':
      updates.coins = user.coins + 1000000; // Add 1M coins
      break;
      
    case 'activation':
      updates.isActive = true;
      break;
      
    case 'energy':
      updates.maxEnergy = user.maxEnergy + 500; // Add 500 max energy
      break;
  }
  
  if (Object.keys(updates).length > 0) {
    await storage.updateUser(user.id, updates);
  }
}

async function sendPaymentConfirmation(telegramUserId: number, type: string) {
  const messages = {
    premium: '🎉 Premium status activated! Enjoy 2x coin multiplier and exclusive features!',
    coins: '🪙 1,000,000 coins added to your account!',
    activation: '⚡ Bot activation complete! All features unlocked!',
    energy: '🔋 Energy booster applied! +500 max energy!',
  };
  
  const message = messages[type as keyof typeof messages] || 'Payment processed successfully!';
  
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: telegramUserId,
      text: message,
      parse_mode: 'HTML',
    }),
  });
}

async function verifyPayment(paymentId: number, telegramPaymentId: string) {
  try {
    const payment = await storage.getUserPayments(paymentId);
    
    if (payment.length === 0) {
      return { valid: false, error: 'Payment not found' };
    }
    
    const paymentRecord = payment[0];
    
    if (paymentRecord.transactionId === telegramPaymentId && paymentRecord.status === 'completed') {
      return { valid: true, payment: paymentRecord };
    }
    
    return { valid: false, error: 'Payment verification failed' };
  } catch (error) {
    console.error('Error verifying payment:', error);
    return { valid: false, error: 'Verification error' };
  }
}

async function verifyTONTransaction(transactionHash: string, expectedAmount: number) {
  // This would need actual TON blockchain integration
  // For now, return a mock response
  return {
    valid: false,
    error: 'TON blockchain verification not implemented',
    transactionHash,
    expectedAmount,
  };
}

// Export payment types for use in other modules
export interface PaymentPackage {
  title: string;
  description: string;
  amount: number;
  currency: string;
  benefits?: string[];
  coins?: number;
  energy?: number;
}

export { PAYMENT_PACKAGES };
