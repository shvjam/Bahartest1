import { useState } from 'react';
import {
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Calendar,
  Filter,
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';

enum TransactionType {
  PAYMENT = 'PAYMENT', // پرداخت برای سفارش
  REFUND = 'REFUND', // بازگشت وجه
  WALLET_DEPOSIT = 'WALLET_DEPOSIT', // شارژ کیف پول
  WALLET_WITHDRAW = 'WALLET_WITHDRAW', // برداشت از کیف پول
}

enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

enum PaymentMethod {
  ONLINE = 'ONLINE', // پرداخت آنلاین (درگاه)
  CARD_TO_CARD = 'CARD_TO_CARD', // کارت به کارت
  CASH = 'CASH', // نقدی
  WALLET = 'WALLET', // کیف پول
}

interface Transaction {
  id: string;
  orderId?: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  description: string;
  trackingCode?: string;
  createdAt: Date;
  completedAt?: Date;
}

// Mock Data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    orderId: '2',
    type: TransactionType.PAYMENT,
    amount: 1750000,
    status: TransactionStatus.COMPLETED,
    paymentMethod: PaymentMethod.ONLINE,
    description: 'پرداخت سفارش #2 - اسباب‌کشی از دفتر به انبار',
    trackingCode: '1234567890',
    createdAt: new Date('2024-11-05T14:00:00'),
    completedAt: new Date('2024-11-05T14:02:00'),
  },
  {
    id: '2',
    orderId: '1',
    type: TransactionType.PAYMENT,
    amount: 2500000,
    status: TransactionStatus.COMPLETED,
    paymentMethod: PaymentMethod.ONLINE,
    description: 'پرداخت سفارش #1 - اسباب‌کشی منزل',
    trackingCode: '0987654321',
    createdAt: new Date('2024-11-08T15:30:00'),
    completedAt: new Date('2024-11-08T15:32:00'),
  },
  {
    id: '3',
    orderId: '3',
    type: TransactionType.PAYMENT,
    amount: 3200000,
    status: TransactionStatus.PENDING,
    paymentMethod: PaymentMethod.ONLINE,
    description: 'پرداخت سفارش #3 - اسباب‌کشی فروشگاه',
    createdAt: new Date('2024-11-09T10:00:00'),
  },
  {
    id: '4',
    orderId: '123',
    type: TransactionType.REFUND,
    amount: 1500000,
    status: TransactionStatus.COMPLETED,
    paymentMethod: PaymentMethod.ONLINE,
    description: 'بازگشت وجه سفارش لغو شده #123',
    trackingCode: '5555555555',
    createdAt: new Date('2024-11-05T16:00:00'),
    completedAt: new Date('2024-11-06T10:00:00'),
  },
  {
    id: '5',
    type: TransactionType.WALLET_DEPOSIT,
    amount: 5000000,
    status: TransactionStatus.COMPLETED,
    paymentMethod: PaymentMethod.ONLINE,
    description: 'شارژ کیف پول',
    trackingCode: '4444444444',
    createdAt: new Date('2024-11-01T09:00:00'),
    completedAt: new Date('2024-11-01T09:02:00'),
  },
];

export const CustomerTransactions = () => {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const getTypeLabel = (type: TransactionType) => {
    const labels: Record<TransactionType, string> = {
      [TransactionType.PAYMENT]: 'پرداخت',
      [TransactionType.REFUND]: 'بازگشت وجه',
      [TransactionType.WALLET_DEPOSIT]: 'شارژ کیف پول',
      [TransactionType.WALLET_WITHDRAW]: 'برداشت',
    };
    return labels[type];
  };

  const getStatusLabel = (status: TransactionStatus) => {
    const labels: Record<TransactionStatus, string> = {
      [TransactionStatus.PENDING]: 'در انتظار',
      [TransactionStatus.COMPLETED]: 'موفق',
      [TransactionStatus.FAILED]: 'ناموفق',
      [TransactionStatus.CANCELLED]: 'لغو شده',
    };
    return labels[status];
  };

  const getStatusColor = (status: TransactionStatus) => {
    const colors: Record<TransactionStatus, string> = {
      [TransactionStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [TransactionStatus.COMPLETED]: 'bg-green-100 text-green-800',
      [TransactionStatus.FAILED]: 'bg-red-100 text-red-800',
      [TransactionStatus.CANCELLED]: 'bg-gray-100 text-gray-800',
    };
    return colors[status];
  };

  const getStatusIcon = (status: TransactionStatus) => {
    const icons: Record<TransactionStatus, any> = {
      [TransactionStatus.PENDING]: Clock,
      [TransactionStatus.COMPLETED]: CheckCircle,
      [TransactionStatus.FAILED]: XCircle,
      [TransactionStatus.CANCELLED]: XCircle,
    };
    return icons[status];
  };

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    const labels: Record<PaymentMethod, string> = {
      [PaymentMethod.ONLINE]: 'درگاه پرداخت',
      [PaymentMethod.CARD_TO_CARD]: 'کارت به کارت',
      [PaymentMethod.CASH]: 'نقدی',
      [PaymentMethod.WALLET]: 'کیف پول',
    };
    return labels[method];
  };

  const getTypeIcon = (type: TransactionType) => {
    return type === TransactionType.REFUND || type === TransactionType.WALLET_DEPOSIT
      ? ArrowDownLeft
      : ArrowUpRight;
  };

  const getTypeColor = (type: TransactionType) => {
    return type === TransactionType.REFUND || type === TransactionType.WALLET_DEPOSIT
      ? 'text-green-600'
      : 'text-red-600';
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (filterStatus !== 'all' && transaction.status !== filterStatus) return false;
    if (filterType !== 'all' && transaction.type !== filterType) return false;
    return true;
  });

  const totalPaid = transactions
    .filter((t) => t.status === TransactionStatus.COMPLETED && t.type === TransactionType.PAYMENT)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunded = transactions
    .filter((t) => t.status === TransactionStatus.COMPLETED && t.type === TransactionType.REFUND)
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = transactions
    .filter((t) => t.status === TransactionStatus.PENDING)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="mb-2">تراکنش‌های مالی</h1>
        <p className="text-muted-foreground">
          مشاهده تاریخچه پرداخت‌ها و تراکنش‌های مالی شما
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">کل پرداختی</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">{(totalPaid / 1000000).toFixed(1)}م</div>
            <p className="text-xs text-muted-foreground">میلیون تومان</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">بازگشت وجه</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">{(totalRefunded / 1000000).toFixed(1)}م</div>
            <p className="text-xs text-muted-foreground">میلیون تومان</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">در انتظار</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">{(pendingAmount / 1000000).toFixed(1)}م</div>
            <p className="text-xs text-muted-foreground">میلیون تومان</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                لیست تراکنش‌ها
              </CardTitle>
              <CardDescription>تاریخچه کامل تراکنش‌های مالی</CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="نوع تراکنش" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value={TransactionType.PAYMENT}>پرداخت</SelectItem>
                  <SelectItem value={TransactionType.REFUND}>بازگشت وجه</SelectItem>
                  <SelectItem value={TransactionType.WALLET_DEPOSIT}>شارژ کیف پول</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value={TransactionStatus.COMPLETED}>موفق</SelectItem>
                  <SelectItem value={TransactionStatus.PENDING}>در انتظار</SelectItem>
                  <SelectItem value={TransactionStatus.FAILED}>ناموفق</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                دریافت گزارش
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">شناسه</TableHead>
                  <TableHead className="text-right">نوع</TableHead>
                  <TableHead className="text-right">شرح</TableHead>
                  <TableHead className="text-right">مبلغ</TableHead>
                  <TableHead className="text-right">روش پرداخت</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                  <TableHead className="text-right">تاریخ</TableHead>
                  <TableHead className="text-right">کد پیگیری</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      تراکنشی یافت نشد
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => {
                    const StatusIcon = getStatusIcon(transaction.status);
                    const TypeIcon = getTypeIcon(transaction.type);
                    return (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">#{transaction.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <TypeIcon className={`h-4 w-4 ${getTypeColor(transaction.type)}`} />
                            <span>{getTypeLabel(transaction.type)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {transaction.description}
                        </TableCell>
                        <TableCell>
                          <span className={getTypeColor(transaction.type)}>
                            {transaction.amount.toLocaleString()} تومان
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{getPaymentMethodLabel(transaction.paymentMethod)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(transaction.status)} variant="outline">
                            <StatusIcon className="h-3 w-3 ml-1" />
                            {getStatusLabel(transaction.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {new Date(transaction.createdAt).toLocaleDateString('fa-IR', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          {transaction.trackingCode ? (
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {transaction.trackingCode}
                            </code>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
