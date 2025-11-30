import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertCircle, CheckCircle2, RefreshCw, Server, XCircle } from 'lucide-react';
import { API_CONFIG } from '../services/api/config';

interface BackendStatus {
  isAvailable: boolean;
  message: string;
  apiUrl: string;
  useMock: boolean;
  lastChecked: Date;
}

export const DevBackendStatus = () => {
  const [status, setStatus] = useState<BackendStatus>({
    isAvailable: false,
    message: 'در حال بررسی...',
    apiUrl: API_CONFIG.BASE_URL,
    useMock: API_CONFIG.USE_MOCK,
    lastChecked: new Date(),
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkBackend = async () => {
    setIsChecking(true);
    try {
      const response = await fetch(API_CONFIG.BASE_URL.replace('/api', '/health'), {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        setStatus({
          isAvailable: true,
          message: 'Backend در حال اجرا است',
          apiUrl: API_CONFIG.BASE_URL,
          useMock: API_CONFIG.USE_MOCK,
          lastChecked: new Date(),
        });
      } else {
        throw new Error('Backend response not ok');
      }
    } catch (error: any) {
      setStatus({
        isAvailable: false,
        message: error.name === 'TimeoutError' 
          ? 'زمان اتصال به Backend به پایان رسید' 
          : 'Backend در دسترس نیست',
        apiUrl: API_CONFIG.BASE_URL,
        useMock: API_CONFIG.USE_MOCK,
        lastChecked: new Date(),
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkBackend();
    // Check every 30 seconds
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  // Only show in development mode
  if (typeof import.meta !== 'undefined' && typeof (import.meta as any).env !== 'undefined' && (import.meta as any).env.MODE === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Alert variant={status.isAvailable ? 'default' : 'destructive'} className="shadow-lg">
        <div className="flex items-start gap-3 border-4 border-blue-500 bg-white dark:bg-slate-900 p-6 rounded-lg w-[400px]" dir="rtl">
          <div className="mt-0.5">
            {status.isAvailable ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4" />
                <span className="font-medium">وضعیت Backend</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={checkBackend}
                disabled={isChecking}
                className="h-6 px-2"
              >
                <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
              </Button>
            </div>

            <AlertDescription className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={status.isAvailable ? 'default' : 'destructive'}>
                  {status.message}
                </Badge>
                <Badge variant={status.useMock ? 'outline' : 'secondary'}>
                  {status.useMock ? '🧪 Mock Mode' : '🔌 API Mode'}
                </Badge>
              </div>

              <div className="text-xs text-muted-foreground">
                <div>URL: {status.apiUrl}</div>
                <div>آخرین بررسی: {status.lastChecked.toLocaleTimeString('fa-IR')}</div>
              </div>

              {status.useMock && (
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950 rounded-md text-xs space-y-1">
                  <div className="font-medium flex items-center gap-1 text-blue-700 dark:text-blue-300">
                    <AlertCircle className="w-3 h-3" />
                    Mock Mode فعال است
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-blue-600 dark:text-blue-400">
                    <li>از داده‌های آزمایشی استفاده می‌شود</li>
                    <li>ورود با کد: 1234</li>
                    <li>Backend نیاز نیست</li>
                  </ul>
                  
                  <div className="mt-3 pt-2 border-t border-blue-200 dark:border-blue-800">
                    <div className="font-medium text-blue-700 dark:text-blue-300 mb-1">شماره تلفن‌های تست:</div>
                    <div className="space-y-1 text-blue-600 dark:text-blue-400">
                      <div className="flex justify-between">
                        <span>👤 مشتری:</span>
                        <span className="font-mono">09121234567</span>
                      </div>
                      <div className="flex justify-between">
                        <span>🚚 راننده:</span>
                        <span className="font-mono">09121234568</span>
                      </div>
                      <div className="flex justify-between">
                        <span>👨‍💼 ادمین:</span>
                        <span className="font-mono">09121234569</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!status.isAvailable && !status.useMock && (
                <div className="mt-2 p-2 bg-muted rounded-md text-xs space-y-1">
                  <div className="font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    راهنمای رفع مشکل:
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                    <li>مطمئن شوید Backend ASP.NET Core در حال اجرا است</li>
                    <li>بررسی کنید که Backend روی پورت 7021 اجرا شود</li>
                    <li>CORS را در Backend فعال کرده‌اید؟</li>
                    <li>فایل .env را ویرایش کنید و VITE_USE_MOCK=true قرار دهید</li>
                  </ul>
                </div>
              )}
            </AlertDescription>
          </div>
        </div>
      </Alert>
    </div>
  );
};