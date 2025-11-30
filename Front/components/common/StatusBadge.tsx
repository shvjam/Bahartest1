import { Badge } from '../ui/badge';
import { OrderStatus, PaymentStatus, UserRole } from '../../types';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Truck, 
  Package, 
  MapPin,
  Activity,
  DollarSign,
  User,
  Shield,
  UserCog
} from 'lucide-react';

// Order Status Badge
interface OrderStatusBadgeProps {
  status: OrderStatus;
  showIcon?: boolean;
}

export function OrderStatusBadge({ status, showIcon = true }: OrderStatusBadgeProps) {
  const config = {
    [OrderStatus.DRAFT]: { 
      label: 'پیش‌نویس', 
      variant: 'secondary' as const, 
      icon: Clock,
      color: 'bg-gray-100 text-gray-800'
    },
    [OrderStatus.PENDING]: { 
      label: 'در انتظار', 
      variant: 'secondary' as const, 
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-800'
    },
    [OrderStatus.REVIEWING]: { 
      label: 'در حال بررسی', 
      variant: 'default' as const, 
      icon: Activity,
      color: 'bg-blue-100 text-blue-800'
    },
    [OrderStatus.CONFIRMED]: { 
      label: 'تایید شده', 
      variant: 'default' as const, 
      icon: CheckCircle2,
      color: 'bg-green-100 text-green-800'
    },
    [OrderStatus.DRIVER_ASSIGNED]: { 
      label: 'راننده تخصیص داده شده', 
      variant: 'default' as const, 
      icon: Truck,
      color: 'bg-purple-100 text-purple-800'
    },
    [OrderStatus.DRIVER_EN_ROUTE_TO_ORIGIN]: { 
      label: 'راننده در راه', 
      variant: 'default' as const, 
      icon: MapPin,
      color: 'bg-blue-100 text-blue-800'
    },
    [OrderStatus.PACKING_IN_PROGRESS]: { 
      label: 'بسته‌بندی', 
      variant: 'default' as const, 
      icon: Package,
      color: 'bg-purple-100 text-purple-800'
    },
    [OrderStatus.LOADING_IN_PROGRESS]: { 
      label: 'بارگیری', 
      variant: 'default' as const, 
      icon: Activity,
      color: 'bg-indigo-100 text-indigo-800'
    },
    [OrderStatus.IN_TRANSIT]: { 
      label: 'در حال حمل', 
      variant: 'default' as const, 
      icon: Truck,
      color: 'bg-orange-100 text-orange-800'
    },
    [OrderStatus.ARRIVED_AT_DESTINATION]: { 
      label: 'رسیده به مقصد', 
      variant: 'default' as const, 
      icon: MapPin,
      color: 'bg-teal-100 text-teal-800'
    },
    [OrderStatus.COMPLETED]: { 
      label: 'تکمیل شده', 
      variant: 'default' as const, 
      icon: CheckCircle2,
      color: 'bg-green-100 text-green-800'
    },
    [OrderStatus.CANCELLED]: { 
      label: 'لغو شده', 
      variant: 'destructive' as const, 
      icon: XCircle,
      color: 'bg-red-100 text-red-800'
    },
  };

  const statusConfig = config[status];
  if (!statusConfig) {
    return (
      <Badge variant="secondary" className="gap-1">
        <AlertCircle className="w-3 h-3" />
        نامشخص
      </Badge>
    );
  }

  const Icon = statusConfig.icon;

  return (
    <Badge variant={statusConfig.variant} className={`gap-1 ${statusConfig.color}`}>
      {showIcon && <Icon className="w-3 h-3" />}
      {statusConfig.label}
    </Badge>
  );
}

// Payment Status Badge
interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  showIcon?: boolean;
}

export function PaymentStatusBadge({ status, showIcon = true }: PaymentStatusBadgeProps) {
  const config = {
    [PaymentStatus.PENDING]: {
      label: 'در انتظار پرداخت',
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-800',
    },
    [PaymentStatus.PAID]: {
      label: 'پرداخت شده',
      icon: CheckCircle2,
      color: 'bg-green-100 text-green-800',
    },
    [PaymentStatus.FAILED]: {
      label: 'پرداخت ناموفق',
      icon: XCircle,
      color: 'bg-red-100 text-red-800',
    },
    [PaymentStatus.REFUNDED]: {
      label: 'بازگشت داده شده',
      icon: DollarSign,
      color: 'bg-blue-100 text-blue-800',
    },
  };

  const statusConfig = config[status];
  const Icon = statusConfig.icon;

  return (
    <Badge variant="outline" className={`gap-1 ${statusConfig.color}`}>
      {showIcon && <Icon className="w-3 h-3" />}
      {statusConfig.label}
    </Badge>
  );
}

// User Role Badge
interface UserRoleBadgeProps {
  role: UserRole;
  showIcon?: boolean;
}

export function UserRoleBadge({ role, showIcon = true }: UserRoleBadgeProps) {
  const config = {
    [UserRole.GUEST]: {
      label: 'مهمان',
      icon: User,
      color: 'bg-gray-100 text-gray-800',
    },
    [UserRole.CUSTOMER]: {
      label: 'مشتری',
      icon: User,
      color: 'bg-blue-100 text-blue-800',
    },
    [UserRole.DRIVER]: {
      label: 'راننده',
      icon: Truck,
      color: 'bg-purple-100 text-purple-800',
    },
    [UserRole.ADMIN]: {
      label: 'مدیر',
      icon: Shield,
      color: 'bg-red-100 text-red-800',
    },
  };

  const roleConfig = config[role];
  const Icon = roleConfig.icon;

  return (
    <Badge variant="outline" className={`gap-1 ${roleConfig.color}`}>
      {showIcon && <Icon className="w-3 h-3" />}
      {roleConfig.label}
    </Badge>
  );
}

// Boolean Status Badge (فعال/غیرفعال)
interface BooleanStatusBadgeProps {
  status: boolean;
  trueLabel?: string;
  falseLabel?: string;
  showIcon?: boolean;
}

export function BooleanStatusBadge({ 
  status, 
  trueLabel = 'فعال', 
  falseLabel = 'غیرفعال',
  showIcon = true 
}: BooleanStatusBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={`gap-1 ${status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
    >
      {showIcon && (status ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />)}
      {status ? trueLabel : falseLabel}
    </Badge>
  );
}
