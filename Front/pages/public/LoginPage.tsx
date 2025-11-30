import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types'; // اضافه شد
import { toast } from 'sonner';
import { Loader2, LogIn } from 'lucide-react';

export const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);

  const { sendOtp, verifyOtp, user } = useAuth(); // اضافه کردن user
  const navigate = useNavigate();
  const location = useLocation();

  // تابع تعیین مسیر پیش‌فرض بر اساس نقش کاربر
  const getDefaultRedirect = (userRole: string | undefined): string => {
    switch (userRole) {
      case UserRole.ADMIN:
        return '/admin';
      case UserRole.DRIVER:
        return '/driver';
      case UserRole.CUSTOMER:
        return '/customer';
      default:
        return '/customer'; // پیش‌فرض برای کاربران جدید
    }
  };

  const from = (location.state as any)?.from?.pathname || null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length !== 11) {
      toast.error('شماره موبایل را به درستی وارد کنید');
      return;
    }

    setIsLoading(true);
    
    try {
      await sendOtp(phoneNumber);
      setStep('otp');
    } catch (error) {
      // Error already handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 4) {
      toast.error('کد تایید را به درستی وارد کنید');
      return;
    }

    setIsLoading(true);
    
    try {
      const loggedInUser = await verifyOtp(phoneNumber, otp);
      
      // اگر from داشتیم (کاربر سعی کرده به صفحه خاصی دسترسی داشته باشه)
      // به همون صفحه هدایتش می‌کنیم، در غیر این صورت بر اساس نقش
      const redirectPath = from || getDefaultRedirect(loggedInUser?.role);
      
      navigate(redirectPath, { replace: true });
    } catch (error) {
      // Error already handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🚚</div>
          <h1 className="text-2xl mb-2">ورود به باربری بهار</h1>
          <p className="text-sm text-muted-foreground">
            {step === 'phone'
              ? 'شماره موبایل خود را وارد کنید'
              : 'کد تایید را وارد کنید'}
          </p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <Label htmlFor="phone">شماره موبایل</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="09121234567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                maxLength={11}
                dir="ltr"
                className="text-center"
              />
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  در حال ارسال...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  دریافت کد تایید
                </>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <Label htmlFor="otp">کد تایید</Label>
              <Input
                id="otp"
                type="text"
                placeholder="1234"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={4}
                dir="ltr"
                className="text-center text-2xl tracking-widest"
              />
              <p className="text-xs text-muted-foreground mt-2">
                کد تایید به شماره {phoneNumber} ارسال شد
              </p>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  در حال تایید...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  تایید و ورود
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setStep('phone');
                setOtp('');
              }}
            >
              ویرایش شماره موبایل
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};