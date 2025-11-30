import { useState } from 'react';
import { Copy, Eye, EyeOff, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { toast } from 'sonner';

interface TestAccount {
  role: string;
  roleLabel: string;
  phone: string;
  name: string;
  description: string;
  color: string;
}

const TEST_ACCOUNTS: TestAccount[] = [
  {
    role: 'admin',
    roleLabel: 'ادمین',
    phone: '09100000000',
    name: 'مدیر سیستم',
    description: 'دسترسی کامل به سیستم',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    role: 'driver',
    roleLabel: 'راننده 1',
    phone: '09131111111',
    name: 'محمد رضایی (خاور)',
    description: '6 کارگر - امتیاز 4.8',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    role: 'driver',
    roleLabel: 'راننده 2',
    phone: '09132222222',
    name: 'حسین کریمی (کامیون)',
    description: '5 کارگر - امتیاز 4.9',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    role: 'driver',
    roleLabel: 'راننده 3',
    phone: '09133333333',
    name: 'رضا موسوی (نیسان)',
    description: '4 کارگر - امتیاز 4.7',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    role: 'customer',
    roleLabel: 'مشتری 1',
    phone: '09121234567',
    name: 'علی احمدی',
    description: 'مشتری نمونه',
    color: 'bg-green-100 text-green-800 border-green-200',
  },
  {
    role: 'customer',
    roleLabel: 'مشتری 2',
    phone: '09129876543',
    name: 'سارا محمدی',
    description: 'مشتری نمونه',
    color: 'bg-green-100 text-green-800 border-green-200',
  },
];

export const DevLoginHelper = () => {
  const [isVisible, setIsVisible] = useState(false);
  const OTP_CODE = '1234';

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} کپی شد`);
  };

  // Only show in development - check if running on localhost or in dev mode
  const isDev = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' ||
     window.location.port === '5173');
  
  if (!isDev) return null;

  return (
    <Dialog open={isVisible} onOpenChange={setIsVisible}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 left-4 z-50 gap-2 shadow-lg"
        >
          <Info className="h-4 w-4" />
          راهنمای ورود
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            راهنمای سریع ورود به سیستم
          </DialogTitle>
          <DialogDescription>
            اکانت‌های تست برای ورود به پنل‌های مختلف
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* OTP Code */}
          <Card className="border-orange-200 bg-orange-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">کد OTP برای همه اکانت‌ها:</p>
                  <p className="text-sm text-muted-foreground">
                    پس از وارد کردن شماره تلفن، این کد را وارد کنید
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-2xl font-bold bg-white px-4 py-2 rounded border">
                    {OTP_CODE}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(OTP_CODE, 'کد OTP')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Test Accounts */}
          <div className="space-y-3">
            <p className="text-sm font-medium">اکانت‌های تست:</p>
            {TEST_ACCOUNTS.map((account, index) => (
              <Card key={index} className="border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-2 flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={account.color} variant="outline">
                          {account.roleLabel}
                        </Badge>
                        <span className="font-medium">{account.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {account.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-muted px-3 py-1 rounded border" dir="ltr">
                          {account.phone}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(account.phone, 'شماره تلفن')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground whitespace-nowrap">
                      پنل: /{account.role === 'driver' ? 'driver' : account.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator />

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">نحوه ورود:</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">
                  1
                </span>
                <p>شماره تلفن مورد نظر را کپی کنید</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">
                  2
                </span>
                <p>روی دکمه "ورود / ثبت‌نام" کلیک کنید</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">
                  3
                </span>
                <p>شماره را وارد کنید و "ارسال کد" بزنید</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">
                  4
                </span>
                <p>
                  کد OTP (<code className="bg-muted px-2 py-0.5 rounded">1234</code>) را وارد
                  کنید
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">
                  5
                </span>
                <p>به پنل مربوطه هدایت می‌شوید!</p>
              </div>
            </CardContent>
          </Card>

          {/* Mock Mode Info */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Mock Mode</Badge>
                  <span className="text-sm font-medium">حالت شبیه‌سازی فعال است</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  داده‌ها از Mock Data استفاده می‌کنند و به Backend واقعی متصل نیستند.
                  برای اتصال به Backend، در فایل <code>.env</code> مقدار{' '}
                  <code>VITE_USE_MOCK=false</code> تنظیم کنید.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};