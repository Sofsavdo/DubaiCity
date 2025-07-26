import { useState } from "react";
import { useGame } from "@/hooks/use-game";
import { useTelegram } from "@/hooks/use-telegram";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  Volume2, 
  VolumeX, 
  Vibrate, 
  Languages,
  Moon,
  Sun
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user } = useGame();
  const { tg } = useTelegram();
  
  const [soundEnabled, setSoundEnabled] = useState(() => 
    localStorage.getItem('dubai-sound') !== 'false'
  );
  const [vibrationEnabled, setVibrationEnabled] = useState(() =>
    localStorage.getItem('dubai-vibration') !== 'false'
  );
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem('dubai-theme') === 'dark'
  );
  const [language, setLanguage] = useState(() =>
    localStorage.getItem('dubai-language') || 'en'
  );

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('dubai-sound', newValue.toString());
  };

  const toggleVibration = () => {
    const newValue = !vibrationEnabled;
    setVibrationEnabled(newValue);
    localStorage.setItem('dubai-vibration', newValue.toString());
  };

  const toggleTheme = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('dubai-theme', newValue ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newValue);
  };

  const changeLanguage = (newLang: string) => {
    setLanguage(newLang);
    localStorage.setItem('dubai-language', newLang);
    // In a real implementation, this would trigger a language change
  };

  const clearGameData = () => {
    if (tg) {
      tg.showConfirm(
        'Are you sure you want to clear all game data? This action cannot be undone.',
        (confirmed) => {
          if (confirmed) {
            localStorage.clear();
            window.location.reload();
          }
        }
      );
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dubai-card text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center text-dubai-gold">
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Audio Settings */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Audio & Feedback</h3>
            
            <div className="flex items-center justify-between p-3 bg-dubai-dark rounded-lg">
              <div className="flex items-center">
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-dubai-gold mr-3" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-400 mr-3" />
                )}
                <span>Sound Effects</span>
              </div>
              <Button
                variant={soundEnabled ? "dubai" : "outline"}
                size="sm"
                onClick={toggleSound}
              >
                {soundEnabled ? "ON" : "OFF"}
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-dubai-dark rounded-lg">
              <div className="flex items-center">
                <Vibrate className={`w-5 h-5 mr-3 ${vibrationEnabled ? 'text-dubai-gold' : 'text-gray-400'}`} />
                <span>Haptic Feedback</span>
              </div>
              <Button
                variant={vibrationEnabled ? "dubai" : "outline"}
                size="sm"
                onClick={toggleVibration}
              >
                {vibrationEnabled ? "ON" : "OFF"}
              </Button>
            </div>
          </div>

          {/* Appearance */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Appearance</h3>
            
            <div className="flex items-center justify-between p-3 bg-dubai-dark rounded-lg">
              <div className="flex items-center">
                {darkMode ? (
                  <Moon className="w-5 h-5 text-dubai-gold mr-3" />
                ) : (
                  <Sun className="w-5 h-5 text-dubai-gold mr-3" />
                )}
                <span>Dark Mode</span>
              </div>
              <Button
                variant={darkMode ? "dubai" : "outline"}
                size="sm"
                onClick={toggleTheme}
              >
                {darkMode ? "ON" : "OFF"}
              </Button>
            </div>
          </div>

          {/* Language */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Language</h3>
            
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'en', label: '🇬🇧 English' },
                { code: 'ru', label: '🇷🇺 Русский' },
                { code: 'uz', label: '🇺🇿 O\'zbek' },
              ].map((lang) => (
                <Button
                  key={lang.code}
                  variant={language === lang.code ? "dubai" : "outline"}
                  size="sm"
                  onClick={() => changeLanguage(lang.code)}
                  className="text-xs"
                >
                  {lang.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Game Data */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Game Data</h3>
            
            <div className="p-3 bg-dubai-dark rounded-lg">
              <div className="text-sm text-gray-400 mb-2">
                User ID: {user.telegramId}
              </div>
              <div className="text-sm text-gray-400 mb-3">
                Account created: {new Date(user.createdAt).toLocaleDateString()}
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={clearGameData}
                className="w-full"
              >
                Clear Game Data
              </Button>
            </div>
          </div>

          {/* Close Button */}
          <Button
            variant="dubai"
            onClick={onClose}
            className="w-full"
          >
            Close Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
