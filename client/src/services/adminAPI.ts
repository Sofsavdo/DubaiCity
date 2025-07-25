
class AdminAPI {
  private baseURL = '/api/admin';
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('adminToken', token);
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('adminToken');
    }
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        window.location.href = '/admin/login';
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async login(username: string, password: string) {
    const response = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        this.setToken(data.data.token);
        return data.data;
      }
    }
    throw new Error('Login failed');
  }

  logout() {
    this.token = null;
    localStorage.removeItem('adminToken');
  }

  // Dashboard
  async getStats() {
    return this.request<any>('/stats');
  }

  // Users
  async getUsers(page = 1, limit = 50) {
    return this.request<any>(`/users?page=${page}&limit=${limit}`);
  }

  async createUser(userData: any) {
    return this.request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: number, userData: any) {
    return this.request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Tasks
  async getTasks() {
    return this.request<any>('/tasks');
  }

  async createTask(taskData: any) {
    return this.request<any>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(id: number, taskData: any) {
    return this.request<any>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(id: number) {
    return this.request<any>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Skins
  async getSkins() {
    return this.request<any>('/skins');
  }

  async createSkin(skinData: any) {
    return this.request<any>('/skins', {
      method: 'POST',
      body: JSON.stringify(skinData),
    });
  }

  // Businesses
  async getBusinesses() {
    return this.request<any>('/businesses');
  }

  async createBusiness(businessData: any) {
    return this.request<any>('/businesses', {
      method: 'POST',
      body: JSON.stringify(businessData),
    });
  }

  // Promo Codes
  async getPromoCodes() {
    return this.request<any>('/promocodes');
  }

  async createPromoCode(promoData: any) {
    return this.request<any>('/promocodes', {
      method: 'POST',
      body: JSON.stringify(promoData),
    });
  }

  // Teams
  async getTeams() {
    return this.request<any>('/teams');
  }

  // Projects
  async getProjects() {
    return this.request<any>('/projects');
  }

  // Notifications
  async getNotifications() {
    return this.request<any>('/notifications');
  }

  async createNotification(notificationData: any) {
    return this.request<any>('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  }

  // Settings
  async getSettings() {
    return this.request<any>('/settings');
  }

  async updateSetting(key: string, value: string) {
    return this.request<any>(`/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    });
  }
}

export const adminAPI = new AdminAPI();
