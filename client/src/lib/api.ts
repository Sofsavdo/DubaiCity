// API client for Dubai City Bot Admin Panel
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiClient {
  private baseUrl = '';

  // API configuration - dynamically set the base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname.includes('replit') 
    ? `${window.location.origin}/api`
    : '/api');

console.log('🔧 API Base URL:', API_BASE_URL);

  async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Admin Stats
  async getAdminStats() {
    return this.request('/api/admin/stats');
  }

  // Users
  async getUsers(page = 1, limit = 50) {
    return this.request(`/api/admin/users?page=${page}&limit=${limit}`);
  }

  async getUser(id: number) {
    return this.request(`/api/admin/users/${id}`);
  }

  async createUser(userData: any) {
    return this.request('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: number, userData: any) {
    return this.request(`/api/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Tasks
  async getTasks() {
    return this.request('/api/admin/tasks');
  }

  async createTask(taskData: any) {
    return this.request('/api/admin/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(id: number, taskData: any) {
    return this.request(`/api/admin/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(id: number) {
    return this.request(`/api/admin/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Skins
  async getSkins() {
    return this.request('/api/admin/skins');
  }

  async createSkin(skinData: any) {
    return this.request('/api/admin/skins', {
      method: 'POST',
      body: JSON.stringify(skinData),
    });
  }

  async updateSkin(id: number, skinData: any) {
    return this.request(`/api/admin/skins/${id}`, {
      method: 'PUT',
      body: JSON.stringify(skinData),
    });
  }

  async deleteSkin(id: number) {
    return this.request(`/api/admin/skins/${id}`, {
      method: 'DELETE',
    });
  }

  // Businesses
  async getBusinesses() {
    return this.request('/api/admin/businesses');
  }

  async createBusiness(businessData: any) {
    return this.request('/api/admin/businesses', {
      method: 'POST',
      body: JSON.stringify(businessData),
    });
  }

  async updateBusiness(id: number, businessData: any) {
    return this.request(`/api/admin/businesses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(businessData),
    });
  }

  async deleteBusiness(id: number) {
    return this.request(`/api/admin/businesses/${id}`, {
      method: 'DELETE',
    });
  }

  // Promo Codes
  async getPromoCodes() {
    return this.request('/api/admin/promocodes');
  }

  async createPromoCode(promoData: any) {
    return this.request('/api/admin/promocodes', {
      method: 'POST',
      body: JSON.stringify(promoData),
    });
  }

  async updatePromoCode(id: number, promoData: any) {
    return this.request(`/api/admin/promocodes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(promoData),
    });
  }

  async deletePromoCode(id: number) {
    return this.request(`/api/admin/promocodes/${id}`, {
      method: 'DELETE',
    });
  }

  // Notifications
  async getNotifications() {
    return this.request('/api/admin/notifications');
  }

  async createNotification(notificationData: any) {
    return this.request('/api/admin/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  }

  async updateNotification(id: number, notificationData: any) {
    return this.request(`/api/admin/notifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(notificationData),
    });
  }

  async deleteNotification(id: number) {
    return this.request(`/api/admin/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  // Teams
  async getTeams() {
    return this.request('/api/admin/teams');
  }

  async createTeam(teamData: any) {
    return this.request('/api/admin/teams', {
      method: 'POST',
      body: JSON.stringify(teamData),
    });
  }

  async updateTeam(id: number, teamData: any) {
    return this.request(`/api/admin/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(teamData),
    });
  }

  async deleteTeam(id: number) {
    return this.request(`/api/admin/teams/${id}`, {
      method: 'DELETE',
    });
  }

  // Projects
  async getProjects() {
    return this.request('/api/admin/projects');
  }

  async createProject(projectData: any) {
    return this.request('/api/admin/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id: number, projectData: any) {
    return this.request(`/api/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(id: number) {
    return this.request(`/api/admin/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Empire Levels
  async getEmpireLevels() {
    return this.request('/api/empire-levels');
  }

  // Settings
  async getSettings() {
    return this.request('/api/admin/settings');
  }

  async updateSetting(key: string, value: string) {
    return this.request(`/api/admin/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    });
  }
}

export const api = new ApiClient();