import type { User, Task, Skin, Business, PromoCode, Notification, Team, Project } from '@shared/schema';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class GameAPI {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data: T; error?: string }> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
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

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        data: null as T,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // User Authentication & Registration
  async registerUser(userData: {
    telegramId: string;
    username: string;
    firstName: string;
    lastName?: string;
    language?: string;
    referralCode?: string;
  }) {
    return this.request<User>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUserProfile(telegramId: string) {
    return this.request<User>(`/api/user/${telegramId}`);
  }

  async updateUserProfile(telegramId: string, updates: Partial<User>) {
    return this.request<User>(`/api/user/${telegramId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Tasks
  async getUserTasks(telegramId: string) {
    return this.request<{ available: Task[]; completed: Task[] }>(`/api/user/${telegramId}/tasks`);
  }

  async completeTask(telegramId: string, taskId: number) {
    return this.request<{ user: User; reward: number }>(`/api/user/${telegramId}/tasks/${taskId}/complete`, {
      method: 'POST',
    });
  }

  // Skins
  async getAvailableSkins() {
    return this.request<Skin[]>('/api/skins');
  }

  async getUserSkins(telegramId: string) {
    return this.request<Skin[]>(`/api/user/${telegramId}/skins`);
  }

  async purchaseSkin(telegramId: string, skinId: number) {
    return this.request<{ user: User; skin: Skin }>(`/api/user/${telegramId}/skins/${skinId}/purchase`, {
      method: 'POST',
    });
  }

  // Businesses
  async getAvailableBusinesses() {
    return this.request<Business[]>('/api/businesses');
  }

  async getUserBusinesses(telegramId: string) {
    return this.request<Business[]>(`/api/user/${telegramId}/businesses`);
  }

  async purchaseBusiness(telegramId: string, businessId: number) {
    return this.request<{ user: User; business: Business }>(`/api/user/${telegramId}/businesses/${businessId}/purchase`, {
      method: 'POST',
    });
  }

  // Promo Codes
  async usePromoCode(telegramId: string, code: string) {
    return this.request<{ user: User; reward: number }>(`/api/user/${telegramId}/promo/${code}`, {
      method: 'POST',
    });
  }

  // Empire Levels
  async getEmpireLevels() {
    return this.request<any[]>('/api/empire-levels');
  }

  // Teams
  async getAvailableTeams() {
    return this.request<Team[]>('/api/teams');
  }

  async getUserTeam(telegramId: string) {
    return this.request<Team | null>(`/api/user/${telegramId}/team`);
  }

  async joinTeam(telegramId: string, teamId: number) {
    return this.request<{ user: User; team: Team }>(`/api/user/${telegramId}/teams/${teamId}/join`, {
      method: 'POST',
    });
  }

  // Projects
  async getAvailableProjects() {
    return this.request<Project[]>('/api/projects');
  }

  async getUserProjects(telegramId: string) {
    return this.request<{ available: Project[]; completed: Project[] }>(`/api/user/${telegramId}/projects`);
  }

  async completeProject(telegramId: string, projectId: number) {
    return this.request<{ user: User; reward: number }>(`/api/user/${telegramId}/projects/${projectId}/complete`, {
      method: 'POST',
    });
  }

  // Notifications
  async getUserNotifications(telegramId: string) {
    return this.request<Notification[]>(`/api/user/${telegramId}/notifications`);
  }

  // Game actions
  async updateCoins(telegramId: string, amount: number) {
    return this.request<User>(`/api/user/${telegramId}/coins`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  async updateEnergy(telegramId: string, energy: number) {
    return this.request<User>(`/api/user/${telegramId}/energy`, {
      method: 'POST',
      body: JSON.stringify({ energy }),
    });
  }
}

export const gameAPI = new GameAPI();