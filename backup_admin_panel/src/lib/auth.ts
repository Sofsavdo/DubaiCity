
// Admin authentication utilities
export interface AdminUser {
  id: number;
  username: string;
  isAdmin: boolean;
  token: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'admin_token';
  private readonly USER_KEY = 'admin_user';

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): AdminUser | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  setAuth(user: AdminUser, token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user && user.isAdmin);
  }

  async login(username: string, password: string): Promise<AdminUser> {
    const response = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    if (data.success) {
      this.setAuth(data.data.user, data.data.token);
      return data.data.user;
    }

    throw new Error(data.message || 'Login failed');
  }

  logout(): void {
    this.clearAuth();
    window.location.href = '/login';
  }
}

export const authService = new AuthService();
