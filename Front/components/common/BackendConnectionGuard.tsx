/**
 * Backend Connection Guard
 * بررسی اتصال به Backend و نمایش پیام مناسب
 */

import { useEffect, useState } from 'react';
import { AlertCircle, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { API_CONFIG } from '../../services/api/config';

interface BackendConnectionGuardProps {
  children: React.ReactNode;
  showAlert?: boolean;
}

export const BackendConnectionGuard = ({
  children,
  showAlert = true,
}: BackendConnectionGuardProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(
        API_CONFIG.BASE_URL.replace('/api', '/health'),
        {
          method: 'GET',
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);
      setIsConnected(response.ok);
      setLastCheck(new Date());
    } catch (error) {
      console.error('Backend connection failed:', error);
      setIsConnected(false);
      setLastCheck(new Date());
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // اگر در حال بررسی است
  if (isChecking && !lastCheck) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">در حال بررسی اتصال به سرور...</p>
      </div>
    );
  }

  // اگر اتصال برقرار نیست
  if (!isConnected && showAlert) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <WifiOff className="w-20 h-20 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl mb-2">عدم اتصال به سرور</h2>
            <p className="text-muted-foreground mb-6">
              اتصال به سرور برقرار نیست. لطفاً مطمئن شوید که سرور اجرا شده است.
            </p>
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>
                  <strong>آدرس سرور:</strong> {API_CONFIG.BASE_URL}
                </p>
                <div className="mt-4">
                  <p className="text-sm mb-2">
                    <strong>راه حل:</strong>
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>مطمئن شوید Backend اجرا شده است</li>
                    <li>
                      دستور <code className="bg-muted px-1 rounded">cd backend_new && dotnet run</code> را اجرا کنید
                    </li>
                    <li>مطمئن شوید Backend روی پورت 5000 اجرا شده است</li>
                    <li>Firewall یا آنتی‌ویروس را بررسی کنید</li>
                  </ol>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <Button
              onClick={checkConnection}
              className="flex-1"
              disabled={isChecking}
            >
              {isChecking ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  در حال بررسی...
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 ml-2" />
                  تلاش مجدد
                </>
              )}
            </Button>
          </div>

          {lastCheck && (
            <p className="text-sm text-muted-foreground text-center">
              آخرین بررسی: {lastCheck.toLocaleTimeString('fa-IR')}
            </p>
          )}
        </div>
      </div>
    );
  }

  // اگر اتصال برقرار است، children را نمایش بده
  return <>{children}</>;
};
