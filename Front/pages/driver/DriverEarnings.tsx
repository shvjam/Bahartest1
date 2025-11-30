import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  FileText,
  CheckCircle2,
  Clock,
  CreditCard,
  Banknote,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Progress } from '../../components/ui/progress';

// Mock Data
const mockEarnings = {
  today: 2500000,
  week: 15600000,
  month: 58400000,
  total: 342500000,
  pending: 3200000,
  paid: 55200000,
  todayTrips: 3,
  weekTrips: 18,
  monthTrips: 76,
  avgPerTrip: 768000,
};

const mockTransactions = [
  {
    id: 't1',
    type: 'earning',
    orderNumber: 'BH-1234',
    amount: 1200000,
    commission: 180000,
    status: 'completed',
    date: new Date('2024-11-08T10:30:00'),
    customer: 'علی محمدی',
  },
  {
    id: 't2',
    type: 'earning',
    orderNumber: 'BH-1235',
    amount: 1800000,
    commission: 270000,
    status: 'completed',
    date: new Date('2024-11-08T14:15:00'),
    customer: 'سارا کریمی',
  },
  {
    id: 't3',
    type: 'withdrawal',
    amount: 10000000,
    status: 'paid',
    date: new Date('2024-11-07T09:00:00'),
    description: 'واریز به حساب بانکی',
  },
  {
    id: 't4',
    type: 'earning',
    orderNumber: 'BH-1220',
    amount: 3200000,
    commission: 480000,
    status: 'completed',
    date: new Date('2024-11-07T16:45:00'),
    customer: 'محمد رضایی',
  },
  {
    id: 't5',
    type: 'earning',
    orderNumber: 'BH-1210',
    amount: 950000,
    commission: 142500,
    status: 'pending',
    date: new Date('2024-11-06T11:20:00'),
    customer: 'فاطمه حسینی',
  },
];

const mockMonthlyStats = [
  { month: 'فروردین', earnings: 45000000, trips: 65 },
  { month: 'اردیبهشت', earnings: 52000000, trips: 72 },
  { month: 'خرداد', earnings: 48000000, trips: 68 },
  { month: 'تیر', earnings: 55000000, trips: 75 },
  { month: 'مرداد', earnings: 58000000, trips: 78 },
  { month: 'شهریور', earnings: 61000000, trips: 82 },
];

export const DriverEarnings = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  const getPeriodEarnings = () => {
    if (selectedPeriod === 'today') return mockEarnings.today;
    if (selectedPeriod === 'week') return mockEarnings.week;
    if (selectedPeriod === 'month') return mockEarnings.month;
    return mockEarnings.total;
  };

  const getPeriodTrips = () => {
    if (selectedPeriod === 'today') return mockEarnings.todayTrips;
    if (selectedPeriod === 'week') return mockEarnings.weekTrips;
    if (selectedPeriod === 'month') return mockEarnings.monthTrips;
    return 342;
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* هدر */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-primary" />
            درآمد و مالی
          </h1>
          <p className="text-muted-foreground">مدیریت درآمدها و برداشت‌ها</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">امروز</SelectItem>
              <SelectItem value="week">هفته جاری</SelectItem>
              <SelectItem value="month">ماه جاری</SelectItem>
              <SelectItem value="all">کل زمان</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            گزارش
          </Button>
        </div>
      </div>

      {/* کارت‌های آمار */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">درآمد کل</p>
                <p className="text-2xl font-bold">{getPeriodEarnings().toLocaleString('fa-IR')}</p>
                <p className="text-xs text-muted-foreground">تومان</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">قابل برداشت</p>
                <p className="text-2xl font-bold">{mockEarnings.paid.toLocaleString('fa-IR')}</p>
                <p className="text-xs text-muted-foreground">تومان</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">در انتظار</p>
                <p className="text-2xl font-bold">{mockEarnings.pending.toLocaleString('fa-IR')}</p>
                <p className="text-xs text-muted-foreground">تومان</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">میانگین هر سفر</p>
                <p className="text-2xl font-bold">{mockEarnings.avgPerTrip.toLocaleString('fa-IR')}</p>
                <p className="text-xs text-muted-foreground">تومان</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">نمای کلی</TabsTrigger>
          <TabsTrigger value="transactions">تراکنش‌ها</TabsTrigger>
          <TabsTrigger value="statistics">آمار</TabsTrigger>
        </TabsList>

        {/* Tab: نمای کلی */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* درآمد ماهانه */}
            <Card>
              <CardHeader>
                <CardTitle>درآمد ماهانه</CardTitle>
                <CardDescription>روند درآمد در 6 ماه اخیر</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockMonthlyStats.map((stat, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{stat.month}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{stat.earnings.toLocaleString('fa-IR')}</span>
                          <span className="text-xs text-muted-foreground">تومان</span>
                        </div>
                      </div>
                      <Progress
                        value={(stat.earnings / 70000000) * 100}
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground">{stat.trips} سفر</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* عملکرد */}
            <Card>
              <CardHeader>
                <CardTitle>عملکرد {selectedPeriod === 'today' ? 'امروز' : selectedPeriod === 'week' ? 'هفته' : 'ماه'}</CardTitle>
                <CardDescription>خلاصه فعالیت‌ها</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-sm">تعداد سفرها</span>
                  </div>
                  <span className="text-xl font-bold">{getPeriodTrips()}</span>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-sm">کل درآمد</span>
                  </div>
                  <span className="text-xl font-bold">{getPeriodEarnings().toLocaleString('fa-IR')}</span>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span className="text-sm">میانگین سفر</span>
                  </div>
                  <span className="text-xl font-bold">
                    {Math.round(getPeriodEarnings() / getPeriodTrips()).toLocaleString('fa-IR')}
                  </span>
                </div>

                <Separator />

                <div className="flex items-center gap-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>12% افزایش نسبت به دوره قبل</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* برداشت */}
          <Card>
            <CardHeader>
              <CardTitle>درخواست برداشت</CardTitle>
              <CardDescription>برداشت درآمدهای خود را انجام دهید</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">موجودی قابل برداشت</p>
                    <p className="text-2xl font-bold">{mockEarnings.paid.toLocaleString('fa-IR')} تومان</p>
                  </div>
                  <Button className="gap-2">
                    <CreditCard className="h-4 w-4" />
                    درخواست برداشت
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                * حداقل مبلغ برداشت: 1,000,000 تومان
                <br />* زمان واریز: 24 الی 48 ساعت کاری
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: تراکنش‌ها */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تاریخچه تراکنش‌ها</CardTitle>
              <CardDescription>لیست تمام تراکنش‌های مالی</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-3">
                  {mockTransactions.map((transaction) => (
                    <Card key={transaction.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                transaction.type === 'earning'
                                  ? 'bg-green-100'
                                  : 'bg-blue-100'
                              }`}
                            >
                              {transaction.type === 'earning' ? (
                                <ArrowUpRight className="h-5 w-5 text-green-600" />
                              ) : (
                                <ArrowDownRight className="h-5 w-5 text-blue-600" />
                              )}
                            </div>
                            <div>
                              {transaction.type === 'earning' ? (
                                <>
                                  <p className="font-medium">
                                    درآمد سفر {transaction.orderNumber}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {transaction.customer}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p className="font-medium">برداشت</p>
                                  <p className="text-sm text-muted-foreground">
                                    {transaction.description}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="text-left">
                            <p
                              className={`font-bold ${
                                transaction.type === 'earning'
                                  ? 'text-green-600'
                                  : 'text-blue-600'
                              }`}
                            >
                              {transaction.type === 'earning' ? '+' : '-'}
                              {transaction.type === 'earning'
                                ? transaction.commission?.toLocaleString('fa-IR')
                                : transaction.amount.toLocaleString('fa-IR')}{' '}
                              تومان
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(transaction.date).toLocaleDateString('fa-IR', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>
                        {transaction.type === 'earning' && (
                          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                            <span>کرایه کل: {transaction.amount.toLocaleString('fa-IR')} تومان</span>
                            <Badge
                              variant={
                                transaction.status === 'completed' ? 'default' : 'secondary'
                              }
                            >
                              {transaction.status === 'completed'
                                ? 'واریز شده'
                                : 'در انتظار'}
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: آمار */}
        <TabsContent value="statistics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">کل درآمد</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{mockEarnings.total.toLocaleString('fa-IR')}</p>
                <p className="text-sm text-muted-foreground">تومان</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>342 سفر تکمیل شده</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">درآمد امروز</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{mockEarnings.today.toLocaleString('fa-IR')}</p>
                <p className="text-sm text-muted-foreground">تومان</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>{mockEarnings.todayTrips} سفر</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">درآمد هفته</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{mockEarnings.week.toLocaleString('fa-IR')}</p>
                <p className="text-sm text-muted-foreground">تومان</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>{mockEarnings.weekTrips} سفر</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* نمودار روند */}
          <Card>
            <CardHeader>
              <CardTitle>روند درآمد 6 ماه اخیر</CardTitle>
              <CardDescription>نمودار میله‌ای درآمد ماهانه</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMonthlyStats.map((stat, index) => {
                  const maxEarnings = Math.max(...mockMonthlyStats.map((s) => s.earnings));
                  const percentage = (stat.earnings / maxEarnings) * 100;

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="w-20 font-medium">{stat.month}</span>
                        <div className="flex-1 px-4">
                          <div className="h-8 overflow-hidden rounded-lg bg-muted">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="w-32 text-left">
                          <p className="font-bold">{stat.earnings.toLocaleString('fa-IR')}</p>
                          <p className="text-xs text-muted-foreground">{stat.trips} سفر</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
