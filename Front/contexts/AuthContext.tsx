import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole } from '../types';
import { authService } from '../services/api/auth.service.real';
import { userService } from '../services/api/user.service.real';
import type { UserDto, UserResponse } from '../types/backend.types';
import { toast } from 'sonner';

interface AuthContextType {
  user: UserDto | UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sendOtp: (phoneNumber: string) => Promise<void>;
  verifyOtp: (phoneNumber: string, otp: string) => Promise<UserDto>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserDto | UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      // Check if token exists
      if (authService.isAuthenticated()) {
        // Try to get stored user first
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
          setIsLoading(false);
          return;
        }

        // Fetch fresh profile from API
        try {
          const profile = await userService.getMyProfile();
          setUser(profile);
        } catch (error: unknown) {
          // If profile fetch fails, clear auth
          authService.logout();
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error: unknown) {
      // Silent fail on auth check
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async (phoneNumber: string): Promise<void> => {
    try {
      const response = await authService.sendOtp({ phoneNumber });
      toast.success(response.message || 'کد تایید ارسال شد');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const verifyOtp = async (phoneNumber: string, otp: string): Promise<UserDto> => {
    setIsLoading(true);
    try {
      const response = await authService.verifyOtp({ 
        phoneNumber, 
        otpCode: otp 
      });
      setUser(response.user);
      toast.success('ورود موفقیت‌آمیز');
      return response.user;
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    authService.logout();
    setUser(null);
    toast.success('با موفقیت خارج شدید');
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const profile = await userService.getMyProfile();
      setUser(profile);
    } catch (error: unknown) {
      // Silent fail on refresh error
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    sendOtp,
    verifyOtp,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useRole = () => {
  const { user } = useAuth();
  
  const role = user?.role || 'GUEST';
  
  return {
    isGuest: !user || role === 'GUEST',
    isCustomer: role === 'CUSTOMER',
    isDriver: role === 'DRIVER',
    isAdmin: role === 'ADMIN',
    role: role as UserRole,
  };
};