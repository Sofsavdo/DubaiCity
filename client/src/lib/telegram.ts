import { User } from "@shared/schema";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    start_param?: string;
    query_id?: string;
    auth_date?: number;
    hash?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: Record<string, string>;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  
  // Methods
  ready: () => void;
  close: () => void;
  expand: () => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  onEvent: (eventType: string, eventHandler: () => void) => void;
  offEvent: (eventType: string, eventHandler: () => void) => void;
  sendData: (data: string) => void;
  openLink: (url: string) => void;
  openTelegramLink: (url: string) => void;
  openInvoice: (url: string, callback?: (status: string) => void) => void;
  
  // Popups
  showPopup: (params: {
    title?: string;
    message: string;
    buttons?: Array<{
      id?: string;
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
      text: string;
    }>;
  }, callback?: (buttonId: string) => void) => void;
  
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (result: boolean) => void) => void;
  showScanQrPopup: (params: { text?: string }, callback?: (result: string) => void) => void;
  closeScanQrPopup: () => void;
  
  // Permissions
  requestWriteAccess: (callback?: (result: boolean) => void) => void;
  requestContact: (callback?: (result: boolean) => void) => void;
  
  // Haptic Feedback
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  
  // Main Button
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive: boolean) => void;
    hideProgress: () => void;
    setParams: (params: {
      text?: string;
      color?: string;
      text_color?: string;
      is_active?: boolean;
      is_visible?: boolean;
    }) => void;
  };
  
  // Back Button
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  
  // Settings Button
  SettingsButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  
  // Cloud Storage
  CloudStorage: {
    setItem: (key: string, value: string, callback?: (error: Error | null, result?: boolean) => void) => void;
    getItem: (key: string, callback: (error: Error | null, value?: string) => void) => void;
    getItems: (keys: string[], callback: (error: Error | null, values?: Record<string, string>) => void) => void;
    removeItem: (key: string, callback?: (error: Error | null, result?: boolean) => void) => void;
    removeItems: (keys: string[], callback?: (error: Error | null, result?: boolean) => void) => void;
    getKeys: (callback: (error: Error | null, keys?: string[]) => void) => void;
  };
  
  // Biometric Manager
  BiometricManager: {
    isInited: boolean;
    isBiometricAvailable: boolean;
    biometricType: 'finger' | 'face' | 'unknown';
    isAccessRequested: boolean;
    isAccessGranted: boolean;
    isBiometricTokenSaved: boolean;
    deviceId: string;
    init: (callback?: () => void) => void;
    requestAccess: (params: { reason?: string }, callback?: (result: boolean) => void) => void;
    authenticate: (params: { reason?: string }, callback?: (result: boolean) => void) => void;
    updateBiometricToken: (token: string, callback?: (result: boolean) => void) => void;
    openSettings: () => void;
  };
}

export class TelegramWebAppUtils {
  private static instance: TelegramWebAppUtils;
  private tg: TelegramWebApp | null = null;
  
  private constructor() {
    this.initTelegramWebApp();
  }
  
  public static getInstance(): TelegramWebAppUtils {
    if (!TelegramWebAppUtils.instance) {
      TelegramWebAppUtils.instance = new TelegramWebAppUtils();
    }
    return TelegramWebAppUtils.instance;
  }
  
  private initTelegramWebApp() {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      this.tg = window.Telegram.WebApp;
      this.tg.ready();
      this.tg.expand();
      this.setupMainButton();
    }
  }
  
  private setupMainButton() {
    if (!this.tg) return;
    
    this.tg.MainButton.setParams({
      text: 'Start Playing',
      color: '#FFD700',
      text_color: '#000000',
      is_active: true,
      is_visible: false,
    });
  }
  
  public getTelegramWebApp(): TelegramWebApp | null {
    return this.tg;
  }
  
  public getUser(): TelegramUser | null {
    return this.tg?.initDataUnsafe?.user || null;
  }
  
  public getStartParam(): string | null {
    return this.tg?.initDataUnsafe?.start_param || null;
  }
  
  public isReady(): boolean {
    return !!this.tg;
  }
  
  public showMainButton(text: string, callback: () => void) {
    if (!this.tg) return;
    
    this.tg.MainButton.setText(text);
    this.tg.MainButton.onClick(callback);
    this.tg.MainButton.show();
  }
  
  public hideMainButton() {
    if (!this.tg) return;
    this.tg.MainButton.hide();
  }
  
  public showBackButton(callback: () => void) {
    if (!this.tg) return;
    
    this.tg.BackButton.onClick(callback);
    this.tg.BackButton.show();
  }
  
  public hideBackButton() {
    if (!this.tg) return;
    this.tg.BackButton.hide();
  }
  
  public hapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light') {
    if (!this.tg?.HapticFeedback) return;
    this.tg.HapticFeedback.impactOccurred(type);
  }
  
  public showAlert(message: string, callback?: () => void) {
    if (!this.tg) return;
    this.tg.showAlert(message, callback);
  }
  
  public showConfirm(message: string, callback?: (result: boolean) => void) {
    if (!this.tg) return;
    this.tg.showConfirm(message, callback);
  }
  
  public openTelegramLink(url: string) {
    if (!this.tg) return;
    this.tg.openTelegramLink(url);
  }
  
  public openInvoice(url: string, callback?: (status: string) => void) {
    if (!this.tg) return;
    this.tg.openInvoice(url, callback);
  }
  
  public sendData(data: any) {
    if (!this.tg) return;
    this.tg.sendData(JSON.stringify(data));
  }
  
  public close() {
    if (!this.tg) return;
    this.tg.close();
  }
  
  public setHeaderColor(color: string) {
    if (!this.tg) return;
    this.tg.headerColor = color;
  }
  
  public setBackgroundColor(color: string) {
    if (!this.tg) return;
    this.tg.backgroundColor = color;
  }
  
  public enableClosingConfirmation() {
    if (!this.tg) return;
    this.tg.enableClosingConfirmation();
  }
  
  public disableClosingConfirmation() {
    if (!this.tg) return;
    this.tg.disableClosingConfirmation();
  }
  
  public cloudStorageSetItem(key: string, value: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.tg?.CloudStorage) {
        resolve(false);
        return;
      }
      
      this.tg.CloudStorage.setItem(key, value, (error, result) => {
        resolve(result || false);
      });
    });
  }
  
  public cloudStorageGetItem(key: string): Promise<string | null> {
    return new Promise((resolve) => {
      if (!this.tg?.CloudStorage) {
        resolve(null);
        return;
      }
      
      this.tg.CloudStorage.getItem(key, (error, value) => {
        resolve(value || null);
      });
    });
  }
  
  public generateReferralLink(userId: string): string {
    return `https://t.me/DubaiCITY_robot?start=${userId}`;
  }
  
  public shareReferralLink(userId: string, customText?: string) {
    const link = this.generateReferralLink(userId);
    const text = customText || 'Join me in Dubai City! Build your empire and earn coins! 🏙️';
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;
    
    this.openTelegramLink(shareUrl);
  }
  
  public openChannelLink() {
    this.openTelegramLink('https://t.me/DubaiCity_live');
  }
  
  public validateInitData(): boolean {
    if (!this.tg?.initData) return false;
    
    // In a real implementation, you would validate the hash
    // against the bot token using crypto
    return true;
  }
  
  public getTheme(): 'light' | 'dark' {
    return this.tg?.colorScheme || 'dark';
  }
  
  public getViewportHeight(): number {
    return this.tg?.viewportHeight || window.innerHeight;
  }
  
  public getViewportStableHeight(): number {
    return this.tg?.viewportStableHeight || window.innerHeight;
  }
  
  public isExpanded(): boolean {
    return this.tg?.isExpanded || false;
  }
  
  public getPlatform(): string {
    return this.tg?.platform || 'unknown';
  }
  
  public getVersion(): string {
    return this.tg?.version || '6.0';
  }
}

// Global window type extension
declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export default TelegramWebAppUtils;
