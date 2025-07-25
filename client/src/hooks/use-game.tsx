import { createContext, useContext, useEffect, useState } from "react";
import { useTelegram } from "./use-telegram";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@shared/schema";

interface GameContextType {
  user: User | null;
  isLoading: boolean;
  tap: (taps: number) => void;
  refillEnergy: () => void;
  isInitialized: boolean;
}

const GameContext = createContext<GameContextType>({
  user: null,
  isLoading: false,
  tap: () => {},
  refillEnergy: () => {},
  isInitialized: false,
});

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { user: telegramUser, startParam, isReady } = useTelegram();
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize or get user
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/user', telegramUser?.id],
    enabled: isReady && !!telegramUser && telegramUser.id !== undefined,
    queryFn: async () => {
      if (!telegramUser) throw new Error('No Telegram user');
      
      try {
        console.log('🚀 Initializing user for Telegram ID:', telegramUser.id);
        // Try to get existing user
        const response = await fetch(`/api/user/${telegramUser.id}`);
        
        if (response.ok) {
          const userData = await response.json();
          console.log('✅ Existing user loaded successfully');
          return userData;
        } else if (response.status === 404) {
          console.log('🆕 Creating new user...');
          // Create new user
          const createResponse = await apiRequest('POST', '/api/user', {
            telegramId: telegramUser.id.toString(),
            username: telegramUser.username,
            firstName: telegramUser.first_name,
            lastName: telegramUser.last_name,
            languageCode: telegramUser.language_code || 'en',
            referredBy: startParam || undefined,
          });
          
          const newUserData = await createResponse.json();
          console.log('✅ New user created successfully');
          return newUserData;
        } else {
          console.error('❌ API error response:', response.status, response.statusText);
          throw new Error(`Failed to get user: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('❌ Error initializing user:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: 1000,
  });

  // Tap mutation
  const tapMutation = useMutation({
    mutationFn: async (taps: number) => {
      if (!user) throw new Error('No user');
      
      const response = await apiRequest('POST', '/api/tap', {
        userId: user.id,
        taps,
      });
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/user', telegramUser?.id], data.user);
    },
  });

  // Energy refill mutation
  const energyRefillMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('No user');
      
      const response = await apiRequest('POST', '/api/energy/refill', {
        userId: user.id,
      });
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/user', telegramUser?.id], data.user);
    },
  });

  // Auto energy refill
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      energyRefillMutation.mutate();
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [user, energyRefillMutation]);

  useEffect(() => {
    if (user && !isInitialized) {
      setIsInitialized(true);
    }
  }, [user, isInitialized]);

  const tap = (taps: number) => {
    tapMutation.mutate(taps);
  };

  const refillEnergy = () => {
    energyRefillMutation.mutate();
  };

  return (
    <GameContext.Provider
      value={{
        user,
        isLoading,
        tap,
        refillEnergy,
        isInitialized,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}