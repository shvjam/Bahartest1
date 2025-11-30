import { useState } from 'react';
import {
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Save,
  Edit,
  Check,
  X,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/api/user.service.real';

export const CustomerProfile = () => {
  const { user, refreshUser } = useAuth();
  
  // Personal Info State
  const [editingInfo, setEditingInfo] = useState(false);
  const [firstName, setFirstName] = useState(user?.fullName?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.fullName?.split(' ').slice(1).join(' ') || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);

  // Password Change State
  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleSaveInfo = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('لطفاً نام و نام خانوادگی را وارد کنید');
      return;
    }

    setIsUpdatingInfo(true);
    try {
      await userService.updateProfile({
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        email: email,
      });
      
      await refreshUser();
      toast.success('اطلاعات شما با موفقیت به‌روزرسانی شد');
      setEditingInfo(false);
    } catch (error) {
      toast.error('خطا در به‌روزرسانی اطلاعات');
    } finally {
      setIsUpdatingInfo(false);
    }
  };

  const handleCancelInfo = () => {
    setFirstName(user?.fullName?.split(' ')[0] || '');
    setLastName(user?.fullName?.split(' ').slice(1).join(' ') || '');
    setEmail(user?.email || '');
    setEditingInfo(false);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('لطفاً تمام فیلدها را پر کنید');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('رمز عبور جدید و تکرار آن مطابقت ندارند');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('رمز عبور جدید باید حداقل 6 کاراکتر باشد');
      return;
    }

    setIsChangingPassword(true);
    try {
      await userService.changePassword({
        currentPassword,
        newPassword,
      });
      
      toast.success('رمز عبور شما با موفقیت تغییر کرد');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setEditingPassword(false);
    } catch (error) {
      toast.error('خطا در تغییر رمز عبور. رمز عبور فعلی اشتباه است');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCancelPassword = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setEditingPassword(false);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="mb-2">پروفایل کاربری</h1>
        <p className="text-muted-foreground">
          مشاهده و ویرایش اطلاعات حساب کاربری شما
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  اطلاعات شخصی
                </CardTitle>
                <CardDescription>نام، نام خانوادگی و شماره تماس شما</CardDescription>
              </div>
              {!editingInfo && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingInfo(true)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  ویرایش
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">نام</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!editingInfo}
                placeholder="نام خود را وارد کنید"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">نام خانوادگی</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={!editingInfo}
                placeholder="نام خانوادگی خود را وارد کنید"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!editingInfo}
                placeholder="ایمیل خود را وارد کنید"
              />
            </div>

            {editingInfo && (
              <>
                <Separator />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={handleCancelInfo}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    انصراف
                  </Button>
                  <Button
                    onClick={handleSaveInfo}
                    className="gap-2"
                    disabled={isUpdatingInfo}
                  >
                    <Check className="h-4 w-4" />
                    ذخیره تغییرات
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  تغییر رمز عبور
                </CardTitle>
                <CardDescription>رمز عبور جدید برای حساب کاربری شما</CardDescription>
              </div>
              {!editingPassword && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingPassword(true)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  تغییر
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!editingPassword ? (
              <div className="py-8 text-center text-muted-foreground">
                <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>برای تغییر رمز عبور، روی دکمه "تغییر" کلیک کنید</p>
                <p className="text-xs mt-2">
                  توجه: معمولاً با کد یکبار مصرف وارد سیستم می‌شوید
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">رمز عبور فعلی</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="رمز عبور فعلی"
                      dir="ltr"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">رمز عبور جدید</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="رمز عبور جدید (حداقل 6 کاراکتر)"
                      dir="ltr"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">تکرار رمز عبور جدید</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="تکرار رمز عبور جدید"
                      dir="ltr"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Separator />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={handleCancelPassword}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    انصراف
                  </Button>
                  <Button
                    onClick={handleChangePassword}
                    className="gap-2"
                    disabled={isChangingPassword}
                  >
                    <Save className="h-4 w-4" />
                    تغییر رمز عبور
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            راهنمای ورود به سیستم
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>✅ <strong>ورود با کد یکبار مصرف (OTP):</strong> سریع‌ترین و آسان‌ترین روش ورود به سیستم</p>
            <p>✅ <strong>ورود با رمز عبور:</strong> در صورت تنظیم رمز عبور، می‌توانید با آن وارد شوید</p>
            <p>⚠️ توجه: اگر رمز عبور خود را فراموش کردید، از گزینه "ورود با کد یکبار مصرف" استفاده کنید</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};