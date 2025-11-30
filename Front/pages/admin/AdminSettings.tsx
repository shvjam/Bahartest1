import { useState } from 'react';
import {
  Settings,
  Globe,
  Bell,
  Shield,
  Upload,
  Save,
  RefreshCw,
  Info,
  AlertCircle,
  MessageSquare,
  Image,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Separator } from '../../components/ui/separator';
import { Switch } from '../../components/ui/switch';
import { Textarea } from '../../components/ui/textarea';
import {
  Alert,
  AlertDescription,
} from '../../components/ui/alert';
import { ScrollArea } from '../../components/ui/scroll-area';
import { toast } from 'sonner';

interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  workingHours: string;
  logoUrl: string;
  faviconUrl: string;
  instagram: string;
  telegram: string;
  whatsapp: string;
  supportPhone: string;
}

interface NotificationSettings {
  smsEnabled: boolean;
  pushEnabled: boolean;
  orderNotificationsEnabled: boolean;
}

interface SecuritySettings {
  sessionTimeout: number;
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // تنظیمات عمومی
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    siteName: 'باربری بهار',
    siteDescription: 'سیستم هوشمند مدیریت باربری و اسباب‌کشی',
    contactPhone: '021-88776655',
    contactEmail: 'info@baharbarbari.ir',
    address: 'تهران، خیابان آزادی، پلاک 123',
    workingHours: 'شنبه تا پنجشنبه: 8 صبح تا 8 شب',
    logoUrl: '',
    faviconUrl: '',
    instagram: '@baharbarbari',
    telegram: '@baharbarbari',
    whatsapp: '09121234567',
    supportPhone: '021-88776655',
  });

  // تنظیمات اعلانات
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    smsEnabled: true,
    pushEnabled: true,
    orderNotificationsEnabled: true,
  });

  // تنظیمات امنیتی
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    sessionTimeout: 60,
  });

  const handleSaveSettings = (section: string) => {
    toast.success(`تنظیمات ${section} با موفقیت ذخیره شد`);
    setHasUnsavedChanges(false);
  };

  const handleResetSettings = (section: string) => {
    toast.info(`تنظیمات ${section} بازنشانی شد`);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* هدر */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <Settings className="h-8 w-8" />
            تنظیمات سیستم
          </h1>
          <p className="text-muted-foreground">مدیریت تنظیمات عمومی و پیکربندی سیستم</p>
        </div>
        {hasUnsavedChanges && (
          <Alert className="w-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>تغییرات ذخیره نشده دارید</AlertDescription>
          </Alert>
        )}
      </div>

      {/* تب‌ها */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <ScrollArea className="w-full">
          <TabsList className="inline-flex h-auto flex-wrap">
            <TabsTrigger value="general" className="gap-2">
              <Globe className="h-4 w-4" />
              عمومی
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              اعلانات
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              امنیت
            </TabsTrigger>
          </TabsList>
        </ScrollArea>

        {/* تنظیمات عمومی */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                اطلاعات عمومی سایت
              </CardTitle>
              <CardDescription>
                تنظیمات پایه و اطلاعات تماس سایت
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">نام سایت</Label>
                  <Input
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) => {
                      setGeneralSettings({ ...generalSettings, siteName: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">تلفن تماس</Label>
                  <Input
                    id="contactPhone"
                    value={generalSettings.contactPhone}
                    onChange={(e) => {
                      setGeneralSettings({ ...generalSettings, contactPhone: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">ایمیل تماس</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) => {
                      setGeneralSettings({ ...generalSettings, contactEmail: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supportPhone">تلفن پشتیبانی</Label>
                  <Input
                    id="supportPhone"
                    value={generalSettings.supportPhone}
                    onChange={(e) => {
                      setGeneralSettings({ ...generalSettings, supportPhone: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">توضیحات سایت</Label>
                <Textarea
                  id="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={(e) => {
                    setGeneralSettings({ ...generalSettings, siteDescription: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">آدرس</Label>
                <Textarea
                  id="address"
                  value={generalSettings.address}
                  onChange={(e) => {
                    setGeneralSettings({ ...generalSettings, address: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workingHours">ساعات کاری</Label>
                <Input
                  id="workingHours"
                  value={generalSettings.workingHours}
                  onChange={(e) => {
                    setGeneralSettings({ ...generalSettings, workingHours: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>

              <Separator />

              <div>
                <h4 className="mb-4 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  شبکه‌های اجتماعی
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="instagram">اینستاگرام</Label>
                    <Input
                      id="instagram"
                      placeholder="@username"
                      value={generalSettings.instagram}
                      onChange={(e) => {
                        setGeneralSettings({ ...generalSettings, instagram: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telegram">تلگرام</Label>
                    <Input
                      id="telegram"
                      placeholder="@username"
                      value={generalSettings.telegram}
                      onChange={(e) => {
                        setGeneralSettings({ ...generalSettings, telegram: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">واتساپ</Label>
                    <Input
                      id="whatsapp"
                      placeholder="09121234567"
                      value={generalSettings.whatsapp}
                      onChange={(e) => {
                        setGeneralSettings({ ...generalSettings, whatsapp: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="mb-4 flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  لوگو و آیکون
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">لوگوی سایت</Label>
                    <div className="flex gap-2">
                      <Input
                        id="logoUrl"
                        placeholder="URL لوگو"
                        value={generalSettings.logoUrl}
                        onChange={(e) => {
                          setGeneralSettings({ ...generalSettings, logoUrl: e.target.value });
                          setHasUnsavedChanges(true);
                        }}
                      />
                      <Button variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="faviconUrl">فاویکون</Label>
                    <div className="flex gap-2">
                      <Input
                        id="faviconUrl"
                        placeholder="URL فاویکون"
                        value={generalSettings.faviconUrl}
                        onChange={(e) => {
                          setGeneralSettings({ ...generalSettings, faviconUrl: e.target.value });
                          setHasUnsavedChanges(true);
                        }}
                      />
                      <Button variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleResetSettings('عمومی')}>
              <RefreshCw className="ml-2 h-4 w-4" />
              بازنشانی
            </Button>
            <Button onClick={() => handleSaveSettings('عمومی')}>
              <Save className="ml-2 h-4 w-4" />
              ذخیره تغییرات
            </Button>
          </div>
        </TabsContent>

        {/* تنظیمات اعلانات */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                تنظیمات اعلانات
              </CardTitle>
              <CardDescription>
                فعال‌سازی یا غیرفعال‌سازی اعلان‌های سیستم
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="smsEnabled">پیامک (SMS)</Label>
                  <p className="text-sm text-muted-foreground">
                    ارسال پیامک برای اعلان‌های مهم به مشتریان و رانندگان
                  </p>
                </div>
                <Switch
                  id="smsEnabled"
                  checked={notificationSettings.smsEnabled}
                  onCheckedChange={(checked) => {
                    setNotificationSettings({ ...notificationSettings, smsEnabled: checked });
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="pushEnabled">اعلان‌های داخل برنامه</Label>
                  <p className="text-sm text-muted-foreground">
                    نمایش اعلان‌ها در داشبورد مشتری و راننده
                  </p>
                </div>
                <Switch
                  id="pushEnabled"
                  checked={notificationSettings.pushEnabled}
                  onCheckedChange={(checked) => {
                    setNotificationSettings({ ...notificationSettings, pushEnabled: checked });
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="orderNotificationsEnabled">اعلان‌های سفارش</Label>
                  <p className="text-sm text-muted-foreground">
                    اطلاع‌رسانی تغییر وضعیت سفارشات (ثبت، تخصیص راننده، تکمیل، لغو)
                  </p>
                </div>
                <Switch
                  id="orderNotificationsEnabled"
                  checked={notificationSettings.orderNotificationsEnabled}
                  onCheckedChange={(checked) => {
                    setNotificationSettings({ ...notificationSettings, orderNotificationsEnabled: checked });
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  با غیرفعال کردن اعلانات، کاربران از تغییرات مهم سفارشات مطلع نخواهند شد
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleResetSettings('اعلانات')}>
              <RefreshCw className="ml-2 h-4 w-4" />
              بازنشانی
            </Button>
            <Button onClick={() => handleSaveSettings('اعلانات')}>
              <Save className="ml-2 h-4 w-4" />
              ذخیره تغییرات
            </Button>
          </div>
        </TabsContent>

        {/* تنظیمات امنیتی */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                تنظیمات امنیتی
              </CardTitle>
              <CardDescription>
                مدیریت امنیت و زمان نشست کاربران
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">مدت زمان نشست (دقیقه)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="15"
                  max="1440"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => {
                    setSecuritySettings({ ...securitySettings, sessionTimeout: Number(e.target.value) });
                    setHasUnsavedChanges(true);
                  }}
                />
                <p className="text-sm text-muted-foreground">
                  کاربران پس از این مدت زمان عدم فعالیت، به صورت خودکار از سیستم خارج می‌شوند
                </p>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  توصیه می‌شود زمان نشست بین ۳۰ تا ۱۲۰ دقیقه باشد
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleResetSettings('امنیتی')}>
              <RefreshCw className="ml-2 h-4 w-4" />
              بازنشانی
            </Button>
            <Button onClick={() => handleSaveSettings('امنیتی')}>
              <Save className="ml-2 h-4 w-4" />
              ذخیره تغییرات
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export { AdminSettings };
