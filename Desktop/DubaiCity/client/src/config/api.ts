// API Configuration for Dubai City Frontend
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://dubai-city-backend.onrender.com' 
    : 'http://localhost:3001');

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  TELEGRAM_AUTH: '/api/telegram/auth',
  
  // User management
  USERS: '/api/users',
  USER_BY_ID: (id: string) => `/api/users/${id}`,
  USER_BY_TELEGRAM_ID: (telegramId: string) => `/api/users/telegram/${telegramId}`,
  
  // Game data
  TASKS: '/api/tasks',
  SKINS: '/api/skins',
  BUSINESSES: '/api/businesses',
  EMPIRE_LEVELS: '/api/empire-levels',
  
  // User actions
  COMPLETE_TASK: (taskId: string) => `/api/tasks/${taskId}/complete`,
  PURCHASE_SKIN: (skinId: string) => `/api/skins/${skinId}/purchase`,
  PURCHASE_BUSINESS: (businessId: string) => `/api/businesses/${businessId}/purchase`,
  UPGRADE_BUSINESS: (businessId: string) => `/api/businesses/${businessId}/upgrade`,
  
  // Referral system
  REFERRALS: '/api/referrals',
  APPLY_REFERRAL: '/api/referrals/apply',
  
  // Payments
  CREATE_PAYMENT: '/api/payments/create',
  VERIFY_PAYMENT: '/api/payments/verify',
  
  // Notifications
  NOTIFICATIONS: '/api/notifications',
  MARK_NOTIFICATION_READ: (notificationId: string) => `/api/notifications/${notificationId}/read`,
  
  // Health check
  HEALTH: '/api/health',
};

// API Client class
export class ApiClient {
  private baseURL: string;
  private headers: HeadersInit;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async authenticateWithTelegram(initData: string) {
    return this.request(API_ENDPOINTS.TELEGRAM_AUTH, {
      method: 'POST',
      body: JSON.stringify({ initData }),
    });
  }

  // User methods
  async getUser(id: string) {
    return this.request(API_ENDPOINTS.USER_BY_ID(id));
  }

  async getUserByTelegramId(telegramId: string) {
    return this.request(API_ENDPOINTS.USER_BY_TELEGRAM_ID(telegramId));
  }

  async updateUser(id: string, data: any) {
    return this.request(API_ENDPOINTS.USER_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Game data methods
  async getTasks() {
    return this.request(API_ENDPOINTS.TASKS);
  }

  async getSkins() {
    return this.request(API_ENDPOINTS.SKINS);
  }

  async getBusinesses() {
    return this.request(API_ENDPOINTS.BUSINESSES);
  }

  async getEmpireLevels() {
    return this.request(API_ENDPOINTS.EMPIRE_LEVELS);
  }

  // User actions
  async completeTask(taskId: string, userId: string) {
    return this.request(API_ENDPOINTS.COMPLETE_TASK(taskId), {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async purchaseSkin(skinId: string, userId: string) {
    return this.request(API_ENDPOINTS.PURCHASE_SKIN(skinId), {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async purchaseBusiness(businessId: string, userId: string) {
    return this.request(API_ENDPOINTS.PURCHASE_BUSINESS(businessId), {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async upgradeBusiness(businessId: string, userId: string) {
    return this.request(API_ENDPOINTS.UPGRADE_BUSINESS(businessId), {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  // Referral methods
  async applyReferralCode(code: string, userId: string) {
    return this.request(API_ENDPOINTS.APPLY_REFERRAL, {
      method: 'POST',
      body: JSON.stringify({ code, userId }),
    });
  }

  async getUserReferrals(userId: string) {
    return this.request(`${API_ENDPOINTS.REFERRALS}?userId=${userId}`);
  }

  // Payment methods
  async createPayment(paymentData: any) {
    return this.request(API_ENDPOINTS.CREATE_PAYMENT, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async verifyPayment(transactionId: string) {
    return this.request(API_ENDPOINTS.VERIFY_PAYMENT, {
      method: 'POST',
      body: JSON.stringify({ transactionId }),
    });
  }

  // Notification methods
  async getNotifications(userId: string) {
    return this.request(`${API_ENDPOINTS.NOTIFICATIONS}?userId=${userId}`);
  }

  async markNotificationRead(notificationId: string, userId: string) {
    return this.request(API_ENDPOINTS.MARK_NOTIFICATION_READ(notificationId), {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request(API_ENDPOINTS.HEALTH);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export configuration
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

// Helper function to check if API is available
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await apiClient.healthCheck();
    return true;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};
