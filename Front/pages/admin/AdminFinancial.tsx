import { useState } from 'react';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Wallet,
  Download,
  Upload,
  Filter,
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  FileText,
  Banknote,
  Receipt,
  Users,
  Car,
  Building,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Separator } from '../../components/ui/separator';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Textarea } from '../../components/ui/textarea';

// ============================================
// TYPES
// ============================================

enum TransactionType {
  ORDER_PAYMENT = 'ORDER_PAYMENT',
  DRIVER_PAYOUT = 'DRIVER_PAYOUT',
  COMMISSION = 'COMMISSION',
  REFUND = 'REFUND',
  WITHDRAWAL = 'WITHDRAWAL',
  DEPOSIT = 'DEPOSIT',
}

enum TransactionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

enum SettlementStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  commission?: number;
  netAmount?: number;
  status: TransactionStatus;
  orderId?: string;
  driverId?: string;
  driverName?: string;
  customerId?: string;
  customerName?: string;
  description: string;
  paymentMethod?: string;
  referenceNumber?: string;
  createdAt: Date;
  completedAt?: Date;
}

interface DriverSettlement {
  id: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  period: string; // 'weekly' | 'monthly'
  fromDate: Date;
  toDate: Date;
  totalOrders: number;
  totalEarnings: number;
  totalCommission: number;
  netAmount: number;
  status: SettlementStatus;
  bankAccount?: string;
  cardNumber?: string;
  sheba?: string;
  requestedAt: Date;
  processedAt?: Date;
  paidAt?: Date;
  note?: string;
}

// Labels
const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  [TransactionType.ORDER_PAYMENT]: 'پرداخت سفارش',
  [TransactionType.DRIVER_PAYOUT]: 'تسویه راننده',
  [TransactionType.COMMISSION]: 'کمیسیون',
  [TransactionType.REFUND]: 'بازگشت وجه',
  [TransactionType.WITHDRAWAL]: 'برداشت',
  [TransactionType.DEPOSIT]: 'واریز',
};

const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  [TransactionStatus.PENDING]: 'در انتظار',
  [TransactionStatus.PROCESSING]: 'در حال پردازش',
  [TransactionStatus.COMPLETED]: 'تکمیل شده',
  [TransactionStatus.FAILED]: 'ناموفق',
  [TransactionStatus.CANCELLED]: 'لغو شده',
};

const SETTLEMENT_STATUS_LABELS: Record<SettlementStatus, string> = {
  [SettlementStatus.PENDING]: 'در انتظار',
  [SettlementStatus.PROCESSING]: 'در حال پردازش',
  [SettlementStatus.COMPLETED]: 'تسویه شده',
  [SettlementStatus.REJECTED]: 'رد شده',
};

// Mock Data
const mockTransactions: Transaction[] = [
  {
    id: 'TRX-001',
    type: TransactionType.ORDER_PAYMENT,
    amount: 2500000,
    commission: 375000,
    netAmount: 2125000,
    status: TransactionStatus.COMPLETED,
    orderId: 'ORD-1001',
    driverId: 'DRV-001',
    driverName: 'محمد رضایی',
    customerId: 'CUST-001',
    customerName: 'علی احمدی',
    description: 'پرداخت سفارش اسباب‌کشی منزل',
    paymentMethod: 'کارت به کارت',
    referenceNumber: '123456789',
    createdAt: new Date('2025-11-08T10:00:00'),
    completedAt: new Date('2025-11-08T10:05:00'),
  },
  {
    id: 'TRX-002',
    type: TransactionType.DRIVER_PAYOUT,
    amount: 5000000,
    status: TransactionStatus.COMPLETED,
    driverId: 'DRV-002',
    driverName: 'حسین موسوی',
    description: 'تسویه هفتگی - هفته اول آبان',
    paymentMethod: 'واریز کارت',
    referenceNumber: '987654321',
    createdAt: new Date('2025-11-07T14:00:00'),
    completedAt: new Date('2025-11-07T14:30:00'),
  },
  {
    id: 'TRX-003',
    type: TransactionType.ORDER_PAYMENT,
    amount: 1800000,
    commission: 270000,
    netAmount: 1530000,
    status: TransactionStatus.COMPLETED,
    orderId: 'ORD-1002',
    driverId: 'DRV-003',
    driverName: 'رضا کریمی',
    customerId: 'CUST-002',
    customerName: 'فاطمه محمدی',
    description: 'پرداخت سفارش حمل بار',
    paymentMethod: 'آنلاین',
    referenceNumber: '456789123',
    createdAt: new Date('2025-11-08T11:30:00'),
    completedAt: new Date('2025-11-08T11:35:00'),
  },
  {
    id: 'TRX-004',
    type: TransactionType.COMMISSION,
    amount: 645000,
    status: TransactionStatus.COMPLETED,
    description: 'کمیسیون سفارشات روز 7 آبان',
    createdAt: new Date('2025-11-07T23:59:00'),
    completedAt: new Date('2025-11-07T23:59:00'),
  },
  {
    id: 'TRX-005',
    type: TransactionType.REFUND,
    amount: 1500000,
    status: TransactionStatus.COMPLETED,
    orderId: 'ORD-1003',
    customerId: 'CUST-003',
    customerName: 'مهدی حسینی',
    description: 'بازگشت وجه - لغو سفارش',
    paymentMethod: 'بازگشت به کارت',
    referenceNumber: '789123456',
    createdAt: new Date('2025-11-06T16:00:00'),
    completedAt: new Date('2025-11-06T16:10:00'),
  },
  {
    id: 'TRX-006',
    type: TransactionType.ORDER_PAYMENT,
    amount: 3200000,
    commission: 480000,
    netAmount: 2720000,
    status: TransactionStatus.COMPLETED,
    orderId: 'ORD-1004',
    driverId: 'DRV-001',
    driverName: 'محمد رضایی',
    customerId: 'CUST-004',
    customerName: 'سارا امینی',
    description: 'پرداخت سفارش اسباب‌کشی اداری',
    paymentMethod: 'کارت به کارت',
    referenceNumber: '321654987',
    createdAt: new Date('2025-11-08T13:00:00'),
    completedAt: new Date('2025-11-08T13:05:00'),
  },
  {
    id: 'TRX-007',
    type: TransactionType.ORDER_PAYMENT,
    amount: 2200000,
    commission: 330000,
    netAmount: 1870000,
    status: TransactionStatus.PENDING,
    orderId: 'ORD-1005',
    driverId: 'DRV-004',
    driverName: 'علی اکبری',
    customerId: 'CUST-005',
    customerName: 'زهرا صادقی',
    description: 'پرداخت سفارش حمل اثاثیه',
    paymentMethod: 'آنلاین',
    createdAt: new Date('2025-11-08T15:00:00'),
  },
  {
    id: 'TRX-008',
    type: TransactionType.DRIVER_PAYOUT,
    amount: 7500000,
    status: TransactionStatus.PROCESSING,
    driverId: 'DRV-001',
    driverName: 'محمد رضایی',
    description: 'تسویه هفتگی - هفته دوم آبان',
    paymentMethod: 'واریز کارت',
    createdAt: new Date('2025-11-08T09:00:00'),
  },
];

const mockSettlements: DriverSettlement[] = [
  {
    id: 'STL-001',
    driverId: 'DRV-001',
    driverName: 'محمد رضایی',
    driverPhone: '09121234567',
    period: 'weekly',
    fromDate: new Date('2025-11-01'),
    toDate: new Date('2025-11-07'),
    totalOrders: 25,
    totalEarnings: 15000000,
    totalCommission: 2250000,
    netAmount: 12750000,
    status: SettlementStatus.COMPLETED,
    bankAccount: '1234567890123456',
    cardNumber: '6037-9977-****-1234',
    sheba: 'IR123456789012345678901234',
    requestedAt: new Date('2025-11-07T10:00:00'),
    processedAt: new Date('2025-11-07T11:00:00'),
    paidAt: new Date('2025-11-07T14:00:00'),
  },
  {
    id: 'STL-002',
    driverId: 'DRV-002',
    driverName: 'حسین موسوی',
    driverPhone: '09129876543',
    period: 'weekly',
    fromDate: new Date('2025-11-01'),
    toDate: new Date('2025-11-07'),
    totalOrders: 18,
    totalEarnings: 11000000,
    totalCommission: 1650000,
    netAmount: 9350000,
    status: SettlementStatus.COMPLETED,
    bankAccount: '6543210987654321',
    cardNumber: '6037-9977-****-5678',
    sheba: 'IR987654321098765432109876',
    requestedAt: new Date('2025-11-07T10:30:00'),
    processedAt: new Date('2025-11-07T11:30:00'),
    paidAt: new Date('2025-11-07T14:30:00'),
  },
  {
    id: 'STL-003',
    driverId: 'DRV-003',
    driverName: 'رضا کریمی',
    driverPhone: '09123456789',
    period: 'weekly',
    fromDate: new Date('2025-11-01'),
    toDate: new Date('2025-11-07'),
    totalOrders: 22,
    totalEarnings: 13500000,
    totalCommission: 2025000,
    netAmount: 11475000,
    status: SettlementStatus.PROCESSING,
    bankAccount: '9876543210123456',
    cardNumber: '6037-9977-****-9012',
    sheba: 'IR555666777888999000111222',
    requestedAt: new Date('2025-11-08T09:00:00'),
    processedAt: new Date('2025-11-08T10:00:00'),
  },
  {
    id: 'STL-004',
    driverId: 'DRV-004',
    driverName: 'علی اکبری',
    driverPhone: '09127777777',
    period: 'weekly',
    fromDate: new Date('2025-11-01'),
    toDate: new Date('2025-11-07'),
    totalOrders: 15,
    totalEarnings: 9000000,
    totalCommission: 1350000,
    netAmount: 7650000,
    status: SettlementStatus.PENDING,
    bankAccount: '1122334455667788',
    cardNumber: '6037-9977-****-3456',
    requestedAt: new Date('2025-11-08T08:00:00'),
  },
];

// Chart Data
const revenueChartData = [
  { name: '1 آبان', revenue: 12500000, commission: 1875000, payout: 10625000 },
  { name: '2 آبان', revenue: 15200000, commission: 2280000, payout: 12920000 },
  { name: '3 آبان', revenue: 18000000, commission: 2700000, payout: 15300000 },
  { name: '4 آبان', revenue: 14800000, commission: 2220000, payout: 12580000 },
  { name: '5 آبان', revenue: 16500000, commission: 2475000, payout: 14025000 },
  { name: '6 آبان', revenue: 19200000, commission: 2880000, payout: 16320000 },
  { name: '7 آبان', revenue: 22000000, commission: 3300000, payout: 18700000 },
];

const transactionTypePieData = [
  { name: 'پرداخت سفارش', value: 65, color: '#3b82f6' },
  { name: 'تسویه راننده', value: 20, color: '#10b981' },
  { name: 'کمیسیون', value: 10, color: '#f59e0b' },
  { name: 'بازگشت وجه', value: 5, color: '#ef4444' },
];

export const AdminFinancial = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [settlements, setSettlements] = useState<DriverSettlement[]>(mockSettlements);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | TransactionStatus>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [settlementStatusFilter, setSettlementStatusFilter] = useState<'all' | SettlementStatus>('all');

  const [isTransactionDetailsOpen, setIsTransactionDetailsOpen] = useState(false);
  const [isSettlementDetailsOpen, setIsSettlementDetailsOpen] = useState(false);
  const [isProcessSettlementOpen, setIsProcessSettlementOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedSettlement, setSelectedSettlement] = useState<DriverSettlement | null>(null);
  const [settlementNote, setSettlementNote] = useState('');

  // فیلتر تراکنش‌ها
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.driverName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.customerName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;

    let matchesDate = true;
    if (dateFrom || dateTo) {
      const transactionDate = new Date(transaction.createdAt);
      if (dateFrom) {
        matchesDate = matchesDate && transactionDate >= new Date(dateFrom);
      }
      if (dateTo) {
        matchesDate = matchesDate && transactionDate <= new Date(dateTo);
      }
    }

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  // فیلتر تسویه‌ها
  const filteredSettlements = settlements.filter((settlement) => {
    const matchesStatus =
      settlementStatusFilter === 'all' || settlement.status === settlementStatusFilter;
    return matchesStatus;
  });

  // محاسبه آمار
  const stats = {
    totalRevenue: transactions
      .filter((t) => t.type === TransactionType.ORDER_PAYMENT && t.status === TransactionStatus.COMPLETED)
      .reduce((sum, t) => sum + t.amount, 0),
    totalCommission: transactions
      .filter((t) => t.type === TransactionType.ORDER_PAYMENT && t.status === TransactionStatus.COMPLETED)
      .reduce((sum, t) => sum + (t.commission || 0), 0),
    totalPayout: transactions
      .filter((t) => t.type === TransactionType.DRIVER_PAYOUT && t.status === TransactionStatus.COMPLETED)
      .reduce((sum, t) => sum + t.amount, 0),
    pendingSettlements: settlements.filter((s) => s.status === SettlementStatus.PENDING).length,
    pendingSettlementsAmount: settlements
      .filter((s) => s.status === SettlementStatus.PENDING)
      .reduce((sum, s) => sum + s.netAmount, 0),
    todayTransactions: transactions.filter((t) => {
      const today = new Date();
      const transactionDate = new Date(t.createdAt);
      return (
        transactionDate.getDate() === today.getDate() &&
        transactionDate.getMonth() === today.getMonth() &&
        transactionDate.getFullYear() === today.getFullYear()
      );
    }).length,
    todayRevenue: transactions
      .filter((t) => {
        const today = new Date();
        const transactionDate = new Date(t.createdAt);
        return (
          t.type === TransactionType.ORDER_PAYMENT &&
          t.status === TransactionStatus.COMPLETED &&
          transactionDate.getDate() === today.getDate() &&
          transactionDate.getMonth() === today.getMonth() &&
          transactionDate.getFullYear() === today.getFullYear()
        );
      })
      .reduce((sum, t) => sum + t.amount, 0),
  };

  // Handlers
  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionDetailsOpen(true);
  };

  const handleViewSettlement = (settlement: DriverSettlement) => {
    setSelectedSettlement(settlement);
    setIsSettlementDetailsOpen(true);
  };

  const handleProcessSettlement = (settlement: DriverSettlement) => {
    setSelectedSettlement(settlement);
    setSettlementNote('');
    setIsProcessSettlementOpen(true);
  };

  const confirmProcessSettlement = (action: 'approve' | 'reject') => {
    if (selectedSettlement) {
      setSettlements(
        settlements.map((s) =>
          s.id === selectedSettlement.id
            ? {
                ...s,
                status: action === 'approve' ? SettlementStatus.PROCESSING : SettlementStatus.REJECTED,
                processedAt: new Date(),
                note: settlementNote,
              }
            : s
        )
      );
      toast.success(
        action === 'approve' ? 'تسویه‌حساب تأیید شد' : 'تسویه‌حساب رد شد'
      );
      setIsProcessSettlementOpen(false);
      setSelectedSettlement(null);
    }
  };

  const completeSettlement = (settlementId: string) => {
    setSettlements(
      settlements.map((s) =>
        s.id === settlementId
          ? { ...s, status: SettlementStatus.COMPLETED, paidAt: new Date() }
          : s
      )
    );
    toast.success('تسویه‌حساب با موفقیت تکمیل شد');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">مدیریت مالی</h1>
          <p className="text-muted-foreground mt-1">مدیریت تراکنش‌ها، تسویه‌حساب و گزارشات مالی</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="ml-2 h-4 w-4" />
            خروجی Excel
          </Button>
          <Button variant="outline">
            <FileText className="ml-2 h-4 w-4" />
            گزارش PDF
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">کل درآمد</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{formatCurrency(stats.totalRevenue / 1000000)} م</div>
            <p className="text-xs text-muted-foreground">
              امروز: {formatCurrency(stats.todayRevenue / 1000000)} میلیون
            </p>
            <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+12.5%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">کمیسیون</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{formatCurrency(stats.totalCommission / 1000000)} م</div>
            <p className="text-xs text-muted-foreground">
              {((stats.totalCommission / stats.totalRevenue) * 100).toFixed(1)}% از درآمد
            </p>
            <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+8.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">پرداخت به رانندگان</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{formatCurrency(stats.totalPayout / 1000000)} م</div>
            <p className="text-xs text-muted-foreground">
              {settlements.filter((s) => s.status === SettlementStatus.COMPLETED).length} تسویه
            </p>
            <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
              <ArrowDownRight className="h-3 w-3" />
              <span>{formatCurrency(stats.pendingSettlementsAmount / 1000000)} م در انتظار</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">تراکنش‌های امروز</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.todayTransactions}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingSettlements} تسویه در انتظار
            </p>
            <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
              <Clock className="h-3 w-3" />
              <span>نیاز به بررسی</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>روند درآمد و هزینه</CardTitle>
            <CardDescription>تحلیل هفت روز گذشته</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value / 1000000}م`} />
                <Tooltip
                  formatter={(value: number) => `${formatCurrency(value)} تومان`}
                  labelStyle={{ color: '#000' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="درآمد"
                />
                <Line
                  type="monotone"
                  dataKey="commission"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="کمیسیون"
                />
                <Line
                  type="monotone"
                  dataKey="payout"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="پرداخت"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>توزیع تراکنش‌ها</CardTitle>
            <CardDescription>بر اساس نوع</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={transactionTypePieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {transactionTypePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="transactions" dir="rtl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">تراکنش‌ها</TabsTrigger>
          <TabsTrigger value="settlements">
            تسویه‌حساب رانندگان
            {stats.pendingSettlements > 0 && (
              <Badge variant="destructive" className="mr-2">
                {stats.pendingSettlements}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* تراکنش‌ها */}
        <TabsContent value="transactions" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>فیلتر تراکنش‌ها</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                <div className="relative md:col-span-2">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="جستجو در تراکنش‌ها..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-9"
                  />
                </div>

                <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه انواع</SelectItem>
                    <SelectItem value={TransactionType.ORDER_PAYMENT}>پرداخت سفارش</SelectItem>
                    <SelectItem value={TransactionType.DRIVER_PAYOUT}>تسویه راننده</SelectItem>
                    <SelectItem value={TransactionType.COMMISSION}>کمیسیون</SelectItem>
                    <SelectItem value={TransactionType.REFUND}>بازگشت وجه</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                    <SelectItem value={TransactionStatus.COMPLETED}>تکمیل شده</SelectItem>
                    <SelectItem value={TransactionStatus.PENDING}>در انتظار</SelectItem>
                    <SelectItem value={TransactionStatus.FAILED}>ناموفق</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Filter className="ml-2 h-4 w-4" />
                  فیلتر پیشرفته
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>لیست تراکنش‌ها ({filteredTransactions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">شناسه</TableHead>
                      <TableHead className="text-right">نوع</TableHead>
                      <TableHead className="text-right">مبلغ</TableHead>
                      <TableHead className="text-right">طرفین</TableHead>
                      <TableHead className="text-right">تاریخ</TableHead>
                      <TableHead className="text-right">وضعیت</TableHead>
                      <TableHead className="text-right">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          تراکنشی یافت نشد
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <div>{transaction.id}</div>
                              {transaction.orderId && (
                                <div className="text-xs text-muted-foreground">
                                  سفارش: {transaction.orderId}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {TRANSACTION_TYPE_LABELS[transaction.type]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div>{formatCurrency(transaction.amount)} تومان</div>
                              {transaction.commission && (
                                <div className="text-xs text-muted-foreground">
                                  کمیسیون: {formatCurrency(transaction.commission)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              {transaction.driverName && (
                                <div className="flex items-center gap-1">
                                  <Car className="h-3 w-3" />
                                  {transaction.driverName}
                                </div>
                              )}
                              {transaction.customerName && (
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {transaction.customerName}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">
                                {new Date(transaction.createdAt).toLocaleDateString('fa-IR')}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(transaction.createdAt).toLocaleTimeString('fa-IR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {transaction.status === TransactionStatus.COMPLETED && (
                              <Badge className="bg-green-500">
                                <CheckCircle2 className="ml-1 h-3 w-3" />
                                {TRANSACTION_STATUS_LABELS[transaction.status]}
                              </Badge>
                            )}
                            {transaction.status === TransactionStatus.PENDING && (
                              <Badge variant="secondary">
                                <Clock className="ml-1 h-3 w-3" />
                                {TRANSACTION_STATUS_LABELS[transaction.status]}
                              </Badge>
                            )}
                            {transaction.status === TransactionStatus.FAILED && (
                              <Badge variant="destructive">
                                <XCircle className="ml-1 h-3 w-3" />
                                {TRANSACTION_STATUS_LABELS[transaction.status]}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewTransaction(transaction)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تسویه‌حساب */}
        <TabsContent value="settlements" className="space-y-4">
          {/* Filter */}
          <Card>
            <CardHeader>
              <CardTitle>فیلتر تسویه‌ها</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Select
                  value={settlementStatusFilter}
                  onValueChange={(value: any) => setSettlementStatusFilter(value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                    <SelectItem value={SettlementStatus.PENDING}>در انتظار</SelectItem>
                    <SelectItem value={SettlementStatus.PROCESSING}>در حال پردازش</SelectItem>
                    <SelectItem value={SettlementStatus.COMPLETED}>تسویه شده</SelectItem>
                    <SelectItem value={SettlementStatus.REJECTED}>رد شده</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Settlements List */}
          <div className="grid gap-4">
            {filteredSettlements.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">تسویه‌ای یافت نشد</CardContent>
              </Card>
            ) : (
              filteredSettlements.map((settlement) => (
                <Card key={settlement.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src="" />
                          <AvatarFallback>{settlement.driverName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{settlement.driverName}</CardTitle>
                          <CardDescription>{settlement.driverPhone}</CardDescription>
                        </div>
                      </div>
                      <div className="text-left">
                        {settlement.status === SettlementStatus.PENDING && (
                          <Badge variant="secondary">
                            <Clock className="ml-1 h-3 w-3" />
                            {SETTLEMENT_STATUS_LABELS[settlement.status]}
                          </Badge>
                        )}
                        {settlement.status === SettlementStatus.PROCESSING && (
                          <Badge variant="default">
                            <AlertCircle className="ml-1 h-3 w-3" />
                            {SETTLEMENT_STATUS_LABELS[settlement.status]}
                          </Badge>
                        )}
                        {settlement.status === SettlementStatus.COMPLETED && (
                          <Badge className="bg-green-500">
                            <CheckCircle2 className="ml-1 h-3 w-3" />
                            {SETTLEMENT_STATUS_LABELS[settlement.status]}
                          </Badge>
                        )}
                        {settlement.status === SettlementStatus.REJECTED && (
                          <Badge variant="destructive">
                            <XCircle className="ml-1 h-3 w-3" />
                            {SETTLEMENT_STATUS_LABELS[settlement.status]}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-6">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">دوره</div>
                        <div>
                          {new Date(settlement.fromDate).toLocaleDateString('fa-IR', {
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          تا{' '}
                          {new Date(settlement.toDate).toLocaleDateString('fa-IR', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">سفارشات</div>
                        <div>{settlement.totalOrders} سفارش</div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">درآمد</div>
                        <div>{formatCurrency(settlement.totalEarnings / 1000000)} م</div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">کمیسیون</div>
                        <div className="text-red-600">
                          -{formatCurrency(settlement.totalCommission / 1000000)} م
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">قابل پرداخت</div>
                        <div>{formatCurrency(settlement.netAmount / 1000000)} م</div>
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewSettlement(settlement)}
                        >
                          <Eye className="ml-2 h-4 w-4" />
                          جزئیات
                        </Button>
                        {settlement.status === SettlementStatus.PENDING && (
                          <Button size="sm" onClick={() => handleProcessSettlement(settlement)}>
                            بررسی
                          </Button>
                        )}
                        {settlement.status === SettlementStatus.PROCESSING && (
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => completeSettlement(settlement.id)}
                          >
                            <CheckCircle2 className="ml-2 h-4 w-4" />
                            تکمیل پرداخت
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Transaction Details Dialog */}
      <Dialog open={isTransactionDetailsOpen} onOpenChange={setIsTransactionDetailsOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>جزئیات تراکنش</DialogTitle>
            <DialogDescription>
              مشاهده اطلاعات کامل تراکنش مالی
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">شناسه تراکنش</div>
                  <div>{selectedTransaction.id}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">نوع</div>
                  <Badge variant="outline">{TRANSACTION_TYPE_LABELS[selectedTransaction.type]}</Badge>
                </div>

                {selectedTransaction.orderId && (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">شماره سفارش</div>
                    <div>{selectedTransaction.orderId}</div>
                  </div>
                )}

                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">وضعیت</div>
                  <Badge
                    variant={
                      selectedTransaction.status === TransactionStatus.COMPLETED
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {TRANSACTION_STATUS_LABELS[selectedTransaction.status]}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">مبلغ کل</span>
                  <span>{formatCurrency(selectedTransaction.amount)} تومان</span>
                </div>

                {selectedTransaction.commission && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">کمیسیون (15%)</span>
                    <span className="text-red-600">
                      -{formatCurrency(selectedTransaction.commission)} تومان
                    </span>
                  </div>
                )}

                {selectedTransaction.netAmount && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span>مبلغ خالص</span>
                      <span>{formatCurrency(selectedTransaction.netAmount)} تومان</span>
                    </div>
                  </>
                )}
              </div>

              <Separator />

              {selectedTransaction.driverName && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">راننده</div>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    {selectedTransaction.driverName}
                  </div>
                </div>
              )}

              {selectedTransaction.customerName && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">مشتری</div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {selectedTransaction.customerName}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">توضیحات</div>
                <div>{selectedTransaction.description}</div>
              </div>

              {selectedTransaction.paymentMethod && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">روش پرداخت</div>
                  <div>{selectedTransaction.paymentMethod}</div>
                </div>
              )}

              {selectedTransaction.referenceNumber && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">شماره پیگیری</div>
                  <div dir="ltr" className="text-left">
                    {selectedTransaction.referenceNumber}
                  </div>
                </div>
              )}

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">تاریخ ایجاد</div>
                  <div>
                    {new Date(selectedTransaction.createdAt).toLocaleDateString('fa-IR')}{' '}
                    {new Date(selectedTransaction.createdAt).toLocaleTimeString('fa-IR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                {selectedTransaction.completedAt && (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">تاریخ تکمیل</div>
                    <div>
                      {new Date(selectedTransaction.completedAt).toLocaleDateString('fa-IR')}{' '}
                      {new Date(selectedTransaction.completedAt).toLocaleTimeString('fa-IR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Settlement Details Dialog */}
      <Dialog open={isSettlementDetailsOpen} onOpenChange={setIsSettlementDetailsOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>جزئیات تسویه‌حساب</DialogTitle>
            <DialogDescription>
              مشاهده اطلاعات کامل درخواست تسویه‌حساب
            </DialogDescription>
          </DialogHeader>

          {selectedSettlement && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl">
                    {selectedSettlement.driverName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3>{selectedSettlement.driverName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedSettlement.driverPhone}</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">شناسه تسویه</div>
                  <div>{selectedSettlement.id}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">دوره</div>
                  <div>
                    {new Date(selectedSettlement.fromDate).toLocaleDateString('fa-IR')} تا{' '}
                    {new Date(selectedSettlement.toDate).toLocaleDateString('fa-IR')}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">تعداد سفارشات</div>
                  <div>{selectedSettlement.totalOrders} سفارش</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">وضعیت</div>
                  <Badge>{SETTLEMENT_STATUS_LABELS[selectedSettlement.status]}</Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">کل درآمد</span>
                  <span>{formatCurrency(selectedSettlement.totalEarnings)} تومان</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">کمیسیون (15%)</span>
                  <span className="text-red-600">
                    -{formatCurrency(selectedSettlement.totalCommission)} تومان
                  </span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span>مبلغ قابل پرداخت</span>
                  <span className="text-lg">
                    {formatCurrency(selectedSettlement.netAmount)} تومان
                  </span>
                </div>
              </div>

              <Separator />

              {selectedSettlement.cardNumber && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">شماره کارت</div>
                  <div dir="ltr" className="text-left">
                    {selectedSettlement.cardNumber}
                  </div>
                </div>
              )}

              {selectedSettlement.bankAccount && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">شماره حساب</div>
                  <div dir="ltr" className="text-left">
                    {selectedSettlement.bankAccount}
                  </div>
                </div>
              )}

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">تاریخ درخواست</div>
                  <div>
                    {new Date(selectedSettlement.requestedAt).toLocaleDateString('fa-IR')}{' '}
                    {new Date(selectedSettlement.requestedAt).toLocaleTimeString('fa-IR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                {selectedSettlement.processedAt && (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">تاریخ پردازش</div>
                    <div>
                      {new Date(selectedSettlement.processedAt).toLocaleDateString('fa-IR')}{' '}
                      {new Date(selectedSettlement.processedAt).toLocaleTimeString('fa-IR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                )}

                {selectedSettlement.paidAt && (
                  <div className="space-y-1 md:col-span-2">
                    <div className="text-sm text-muted-foreground">تاریخ پرداخت</div>
                    <div>
                      {new Date(selectedSettlement.paidAt).toLocaleDateString('fa-IR')}{' '}
                      {new Date(selectedSettlement.paidAt).toLocaleTimeString('fa-IR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                )}
              </div>

              {selectedSettlement.note && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">یادداشت</div>
                    <div className="rounded-lg bg-muted p-3 text-sm">{selectedSettlement.note}</div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Process Settlement Dialog */}
      <Dialog open={isProcessSettlementOpen} onOpenChange={setIsProcessSettlementOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>بررسی تسویه‌حساب</DialogTitle>
            <DialogDescription>
              بررسی و تأیید یا رد درخواست تسویه‌حساب راننده
            </DialogDescription>
          </DialogHeader>

          {selectedSettlement && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center justify-between">
                  <span>راننده:</span>
                  <span>{selectedSettlement.driverName}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span>مبلغ قابل پرداخت:</span>
                  <span className="text-lg">
                    {formatCurrency(selectedSettlement.netAmount)} تومان
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="settlementNote">یادداشت (اختیاری)</Label>
                <Textarea
                  id="settlementNote"
                  value={settlementNote}
                  onChange={(e) => setSettlementNote(e.target.value)}
                  placeholder="یادداشت مدیر درباره تسویه..."
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsProcessSettlementOpen(false)}
            >
              انصراف
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmProcessSettlement('reject')}
            >
              رد درخواست
            </Button>
            <Button onClick={() => confirmProcessSettlement('approve')}>
              تأیید و پردازش
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};