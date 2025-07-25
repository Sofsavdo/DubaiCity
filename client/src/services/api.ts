const API_BASE_URL = '';

class APIService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}/api${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async authenticateWithTelegram(initData: string) {
    return this.request('/telegram/auth', {
      method: 'POST',
      body: JSON.stringify({ initData }),
    });
  }

  // Game data
  async getGameData(telegramId?: string) {
    const params = telegramId ? `?telegramId=${telegramId}` : '';
    return this.request(`/game/data${params}`);
  }

  async updateUser(telegramId: string, updateData: any) {
    return this.request(`/game/user/${telegramId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Tasks
  async getTasks() {
    return this.request('/tasks');
  }

  async completeTask(telegramId: string, taskId: number) {
    return this.request('/game/complete-task', {
      method: 'POST',
      body: JSON.stringify({ telegramId, taskId }),
    });
  }

  // Users
  async getUsers(page = 1, limit = 50) {
    return this.request(`/users?page=${page}&limit=${limit}`);
  }

  async getUser(id: number) {
    return this.request(`/users/${id}`);
  }

  async createUser(userData: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUserById(id: number, updateData: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }
}

export const apiService = new APIService();
export default apiService;