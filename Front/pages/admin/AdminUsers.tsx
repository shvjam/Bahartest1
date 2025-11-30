import { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Users,
  UserCheck,
  UserX,
  Shield,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
  UserCog,
  Download,
  Upload,
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
import { Switch } from '../../components/ui/switch';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Skeleton } from '../../components/ui/skeleton';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { toast } from 'sonner';
import { UserRole } from '../../types';
import { useCustomers, useDrivers } from '../../lib/hooks';

// ============================================
// TYPES
// ============================================

interface User {
  id: string;
  phoneNumber: string;
  fullName: string;
  email?: string;
  role: UserRole;
  
  // اطلاعات تکمیلی
  nationalId?: string;
  address?: string;
  city?: string;
  
  // وضعیت
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isBanned: boolean;
  
  // آمار
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalSpent: number; // برای مشتری
  totalEarnings: number; // برای راننده
  
  // تاریخ‌ها
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
  bannedAt?: Date;
  
  // یادداشت ادمین
  adminNote?: string;
  banReason?: string;
}

// Role Labels
const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.GUEST]: 'مهمان',
  [UserRole.CUSTOMER]: 'مشتری',
  [UserRole.DRIVER]: 'راننده',
  [UserRole.ADMIN]: 'ادمین',
};

// Role Colors
const ROLE_COLORS: Record<UserRole, string> = {
  [UserRole.GUEST]: 'gray',
  [UserRole.CUSTOMER]: 'blue',
  [UserRole.DRIVER]: 'green',
  [UserRole.ADMIN]: 'red',
};

// Mock Data
const mockUsers: User[] = [
  {
    id: '1',
    phoneNumber: '09121234567',
    fullName: 'علی احمدی',
    email: 'ali.ahmadi@example.com',
    role: UserRole.CUSTOMER,
    nationalId: '0012345678',
    address: 'تهران، سعادت‌آباد، خیابان شهید اسدی',
    city: 'تهران',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    isBanned: false,
    totalOrders: 15,
    completedOrders: 14,
    cancelledOrders: 1,
    totalSpent: 25000000,
    totalEarnings: 0,
    lastLoginAt: new Date('2025-11-08T10:30:00'),
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2025-11-08'),
  },
  {
    id: '2',
    phoneNumber: '09129876543',
    fullName: 'محمد رضایی',
    email: 'mohammad.rezaei@example.com',
    role: UserRole.DRIVER,
    nationalId: '0012345679',
    address: 'تهران، پونک',
    city: 'تهران',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    isBanned: false,
    totalOrders: 120,
    completedOrders: 115,
    cancelledOrders: 5,
    totalSpent: 0,
    totalEarnings: 85000000,
    lastLoginAt: new Date('2025-11-08T14:15:00'),
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2025-11-08'),
  },
  {
    id: '3',
    phoneNumber: '09123456789',
    fullName: 'فاطمه کریمی',
    email: 'fatemeh.karimi@example.com',
    role: UserRole.CUSTOMER,
    nationalId: '0012345680',
    address: 'تهران، ونک',
    city: 'تهران',
    isActive: true,
    isEmailVerified: false,
    isPhoneVerified: true,
    isBanned: false,
    totalOrders: 8,
    completedOrders: 7,
    cancelledOrders: 1,
    totalSpent: 12000000,
    totalEarnings: 0,
    lastLoginAt: new Date('2025-11-07T16:20:00'),
    createdAt: new Date('2024-08-20'),
    updatedAt: new Date('2025-11-07'),
  },
  {
    id: '4',
    phoneNumber: '09121111111',
    fullName: 'مدیر سیستم',
    email: 'admin@baharbarari.com',
    role: UserRole.ADMIN,
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    isBanned: false,
    totalOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalSpent: 0,
    totalEarnings: 0,
    lastLoginAt: new Date('2025-11-08T15:00:00'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-11-08'),
  },
  {
    id: '5',
    phoneNumber: '09125555555',
    fullName: 'حسین موسوی',
    email: 'hossein.mousavi@example.com',
    role: UserRole.DRIVER,
    nationalId: '0012345681',
    address: 'تهران، شهرک غرب',
    city: 'تهران',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    isBanned: false,
    totalOrders: 95,
    completedOrders: 90,
    cancelledOrders: 5,
    totalSpent: 0,
    totalEarnings: 65000000,
    lastLoginAt: new Date('2025-11-08T12:00:00'),
    createdAt: new Date('2024-04-15'),
    updatedAt: new Date('2025-11-08'),
  },
  {
    id: '6',
    phoneNumber: '09126666666',
    fullName: 'زهرا محمدی',
    email: 'zahra.mohammadi@example.com',
    role: UserRole.CUSTOMER,
    nationalId: '0012345682',
    address: 'تهران، نیاوران',
    city: 'تهران',
    isActive: false,
    isEmailVerified: true,
    isPhoneVerified: true,
    isBanned: true,
    totalOrders: 5,
    completedOrders: 2,
    cancelledOrders: 3,
    totalSpent: 3000000,
    totalEarnings: 0,
    lastLoginAt: new Date('2025-10-20T10:00:00'),
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2025-10-25'),
    bannedAt: new Date('2025-10-25'),
    banReason: 'لغو مکرر سفارشات',
    adminNote: 'کاربر سه بار سفارش را لغو کرده است.',
  },
  {
    id: '7',
    phoneNumber: '09127777777',
    fullName: 'رضا اکبری',
    role: UserRole.CUSTOMER,
    isActive: true,
    isEmailVerified: false,
    isPhoneVerified: true,
    isBanned: false,
    totalOrders: 3,
    completedOrders: 3,
    cancelledOrders: 0,
    totalSpent: 5000000,
    totalEarnings: 0,
    lastLoginAt: new Date('2025-11-06T09:00:00'),
    createdAt: new Date('2024-10-10'),
    updatedAt: new Date('2025-11-06'),
  },
  {
    id: '8',
    phoneNumber: '09128888888',
    fullName: 'مهدی حسینی',
    email: 'mehdi.hosseini@example.com',
    role: UserRole.DRIVER,
    nationalId: '0012345683',
    address: 'تهران، تجریش',
    city: 'تهران',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    isBanned: false,
    totalOrders: 75,
    completedOrders: 72,
    cancelledOrders: 3,
    totalSpent: 0,
    totalEarnings: 52000000,
    lastLoginAt: new Date('2025-11-08T11:30:00'),
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2025-11-08'),
  },
];

export const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'banned'>('all');
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // فرم کاربر
  const [userForm, setUserForm] = useState({
    phoneNumber: '',
    fullName: '',
    email: '',
    role: UserRole.CUSTOMER,
    nationalId: '',
    address: '',
    city: '',
    isActive: true,
    adminNote: '',
  });
  
  const [banReason, setBanReason] = useState('');

  // فیلتر کاربران
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phoneNumber.includes(searchQuery) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.isActive && !user.isBanned) ||
      (statusFilter === 'inactive' && !user.isActive && !user.isBanned) ||
      (statusFilter === 'banned' && user.isBanned);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // محاسبه آمار
  const stats = {
    total: users.length,
    customers: users.filter((u) => u.role === UserRole.CUSTOMER).length,
    drivers: users.filter((u) => u.role === UserRole.DRIVER).length,
    admins: users.filter((u) => u.role === UserRole.ADMIN).length,
    active: users.filter((u) => u.isActive && !u.isBanned).length,
    banned: users.filter((u) => u.isBanned).length,
    newToday: users.filter((u) => {
      const today = new Date();
      const userDate = new Date(u.createdAt);
      return (
        userDate.getDate() === today.getDate() &&
        userDate.getMonth() === today.getMonth() &&
        userDate.getFullYear() === today.getFullYear()
      );
    }).length,
    newThisMonth: users.filter((u) => {
      const today = new Date();
      const userDate = new Date(u.createdAt);
      return (
        userDate.getMonth() === today.getMonth() &&
        userDate.getFullYear() === today.getFullYear()
      );
    }).length,
  };

  // Handlers
  const handleAddUser = () => {
    setUserForm({
      phoneNumber: '',
      fullName: '',
      email: '',
      role: UserRole.CUSTOMER,
      nationalId: '',
      address: '',
      city: '',
      isActive: true,
      adminNote: '',
    });
    setIsAddDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setUserForm({
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
      email: user.email || '',
      role: user.role,
      nationalId: user.nationalId || '',
      address: user.address || '',
      city: user.city || '',
      isActive: user.isActive,
      adminNote: user.adminNote || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsDialogOpen(true);
  };

  const handleBanUser = (user: User) => {
    setSelectedUser(user);
    setBanReason('');
    setIsBanDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (isEditDialogOpen && selectedUser) {
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                phoneNumber: userForm.phoneNumber,
                fullName: userForm.fullName,
                email: userForm.email,
                role: userForm.role,
                nationalId: userForm.nationalId,
                address: userForm.address,
                city: userForm.city,
                isActive: userForm.isActive,
                adminNote: userForm.adminNote,
                updatedAt: new Date(),
              }
            : u
        )
      );
      toast.success('کاربر با موفقیت ویرایش شد');
      setIsEditDialogOpen(false);
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        phoneNumber: userForm.phoneNumber,
        fullName: userForm.fullName,
        email: userForm.email,
        role: userForm.role,
        nationalId: userForm.nationalId,
        address: userForm.address,
        city: userForm.city,
        isActive: userForm.isActive,
        isEmailVerified: false,
        isPhoneVerified: true,
        isBanned: false,
        totalOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        totalSpent: 0,
        totalEarnings: 0,
        createdAt: new Date(),
        adminNote: userForm.adminNote,
      };
      setUsers([...users, newUser]);
      toast.success('کاربر جدید با موفقیت افزوده شد');
      setIsAddDialogOpen(false);
    }
  };

  const confirmDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      toast.success('کاربر با موفقیت حذف شد');
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const confirmBanUser = () => {
    if (selectedUser) {
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                isBanned: !u.isBanned,
                bannedAt: !u.isBanned ? new Date() : undefined,
                banReason: !u.isBanned ? banReason : undefined,
                updatedAt: new Date(),
              }
            : u
        )
      );
      toast.success(
        selectedUser.isBanned ? 'کاربر با موفقیت رفع مسدودیت شد' : 'کاربر با موفقیت مسدود شد'
      );
      setIsBanDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, isActive: !u.isActive, updatedAt: new Date() } : u
      )
    );
    toast.success('وضعیت کاربر تغییر یافت');
  };

  const changeUserRole = (userId: string, newRole: UserRole) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, role: newRole, updatedAt: new Date() } : u))
    );
    toast.success('نقش کاربر تغییر یافت');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">مدیریت کاربران</h1>
          <p className="text-muted-foreground mt-1">مدیریت کامل کاربران سیستم</p>
        </div>
        <Button onClick={handleAddUser}>
          <Plus className="ml-2 h-4 w-4" />
          افزودن کاربر جدید
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">کل کاربران</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} فعال، {stats.banned} مسدود
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">مشتریان</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.customers}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.customers / stats.total) * 100).toFixed(0)}% از کل
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">رانندگان</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.drivers}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.drivers / stats.total) * 100).toFixed(0)}% از کل
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">کاربران جدید</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.newToday}</div>
            <p className="text-xs text-muted-foreground">{stats.newThisMonth} این ماه</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>فیلتر و جستجو</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="جستجو بر اساس نام، شماره تلفن، ایمیل یا شناسه..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-9"
                />
              </div>
            </div>

            <Select value={roleFilter} onValueChange={(value: any) => setRoleFilter(value)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه نقش‌ها</SelectItem>
                <SelectItem value={UserRole.CUSTOMER}>مشتریان</SelectItem>
                <SelectItem value={UserRole.DRIVER}>رانندگان</SelectItem>
                <SelectItem value={UserRole.ADMIN}>ادمین‌ها</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="active">فعال</SelectItem>
                <SelectItem value="inactive">غیرفعال</SelectItem>
                <SelectItem value="banned">مسدود</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>لیست کاربران ({filteredUsers.length})</CardTitle>
          <CardDescription>مدیریت و ویرایش کاربران موجود</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">کاربر</TableHead>
                  <TableHead className="text-right">نقش</TableHead>
                  <TableHead className="text-right">تماس</TableHead>
                  <TableHead className="text-right">آمار</TableHead>
                  <TableHead className="text-right">آخرین ورود</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      کاربری یافت نشد
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="" />
                            <AvatarFallback>
                              {user.fullName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div>{user.fullName}</div>
                            <div className="text-xs text-muted-foreground">ID: {user.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === UserRole.ADMIN
                              ? 'destructive'
                              : user.role === UserRole.DRIVER
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {ROLE_LABELS[user.role]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {user.phoneNumber}
                          </div>
                          {user.email && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div>{user.totalOrders} سفارش</div>
                          {user.role === UserRole.CUSTOMER && user.totalSpent > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {(user.totalSpent / 1000000).toFixed(1)} م خرج
                            </div>
                          )}
                          {user.role === UserRole.DRIVER && user.totalEarnings > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {(user.totalEarnings / 1000000).toFixed(1)} م درآمد
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {user.lastLoginAt && (
                            <>
                              <div className="text-sm">
                                {new Date(user.lastLoginAt).toLocaleDateString('fa-IR')}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(user.lastLoginAt).toLocaleTimeString('fa-IR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {user.isBanned ? (
                            <Badge variant="destructive">
                              <Ban className="ml-1 h-3 w-3" />
                              مسدود
                            </Badge>
                          ) : (
                            <Badge variant={user.isActive ? 'default' : 'secondary'}>
                              {user.isActive ? 'فعال' : 'غیرفعال'}
                            </Badge>
                          )}
                          <div className="flex gap-1">
                            {user.isPhoneVerified && (
                              <Badge variant="outline" className="text-xs">
                                تلفن تأیید
                              </Badge>
                            )}
                            {user.isEmailVerified && (
                              <Badge variant="outline" className="text-xs">
                                ایمیل تأیید
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                              <Eye className="ml-2 h-4 w-4" />
                              مشاهده جزئیات
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Edit className="ml-2 h-4 w-4" />
                              ویرایش
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                              {user.isActive ? (
                                <>
                                  <XCircle className="ml-2 h-4 w-4" />
                                  غیرفعال کردن
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="ml-2 h-4 w-4" />
                                  فعال کردن
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleBanUser(user)}>
                              <Ban className="ml-2 h-4 w-4" />
                              {user.isBanned ? 'رفع مسدودیت' : 'مسدود کردن'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteUser(user)}
                              className="text-red-600"
                            >
                              <Trash2 className="ml-2 h-4 w-4" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{isEditDialogOpen ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}</DialogTitle>
            <DialogDescription>
              {isEditDialogOpen ? 'اطلاعات کاربر را ویرایش کنید' : 'اطلاعات کاربر جدید را وارد کنید'}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" dir="rtl">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">اطلاعات پایه</TabsTrigger>
              <TabsTrigger value="settings">تنظیمات</TabsTrigger>
            </TabsList>

            {/* اطلاعات پایه */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">نام و نام خانوادگی *</Label>
                  <Input
                    id="fullName"
                    value={userForm.fullName}
                    onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                    placeholder="علی احمدی"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">شماره تلفن *</Label>
                  <Input
                    id="phoneNumber"
                    value={userForm.phoneNumber}
                    onChange={(e) => setUserForm({ ...userForm, phoneNumber: e.target.value })}
                    placeholder="09121234567"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">ایمیل</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="user@example.com"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">نقش کاربری *</Label>
                  <Select
                    value={userForm.role}
                    onValueChange={(value: UserRole) => setUserForm({ ...userForm, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.CUSTOMER}>مشتری</SelectItem>
                      <SelectItem value={UserRole.DRIVER}>راننده</SelectItem>
                      <SelectItem value={UserRole.ADMIN}>ادمین</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationalId">کد ملی</Label>
                  <Input
                    id="nationalId"
                    value={userForm.nationalId}
                    onChange={(e) => setUserForm({ ...userForm, nationalId: e.target.value })}
                    placeholder="0012345678"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">شهر</Label>
                  <Input
                    id="city"
                    value={userForm.city}
                    onChange={(e) => setUserForm({ ...userForm, city: e.target.value })}
                    placeholder="تهران"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">آدرس</Label>
                  <Textarea
                    id="address"
                    value={userForm.address}
                    onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
                    placeholder="آدرس کامل..."
                    rows={2}
                  />
                </div>
              </div>
            </TabsContent>

            {/* تنظیمات */}
            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>وضعیت فعال/غیرفعال</Label>
                    <p className="text-sm text-muted-foreground">
                      کاربر بتواند وارد سیستم شود
                    </p>
                  </div>
                  <Switch
                    checked={userForm.isActive}
                    onCheckedChange={(checked) => setUserForm({ ...userForm, isActive: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminNote">یادداشت ادمین</Label>
                  <Textarea
                    id="adminNote"
                    value={userForm.adminNote}
                    onChange={(e) => setUserForm({ ...userForm, adminNote: e.target.value })}
                    placeholder="یادداشت‌های داخلی درباره کاربر..."
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
              }}
            >
              انصراف
            </Button>
            <Button onClick={handleSaveUser}>
              {isEditDialogOpen ? 'ذخیره تغییرات' : 'افزودن کاربر'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>حذف کاربر</DialogTitle>
            <DialogDescription>
              آیا مطمئن هستید که می‌خواهید کاربر "{selectedUser?.fullName}" را حذف کنید؟ این عمل
              قابل بازگشت نیست.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              انصراف
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban Dialog */}
      <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.isBanned ? 'رفع مسدودیت کاربر' : 'مسدود کردن کاربر'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.isBanned
                ? `آیا مطمئن هستید که می‌خواهید مسدودیت کاربر "${selectedUser?.fullName}" را رفع کنید؟`
                : `آیا مطمئن هستید که می‌خواهید کاربر "${selectedUser?.fullName}" را مسدود کنید؟`}
            </DialogDescription>
          </DialogHeader>

          {!selectedUser?.isBanned && (
            <div className="space-y-2">
              <Label htmlFor="banReason">دلیل مسدودیت *</Label>
              <Textarea
                id="banReason"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="دلیل مسدودیت را وارد کنید..."
                rows={3}
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBanDialogOpen(false)}>
              انصراف
            </Button>
            <Button
              variant={selectedUser?.isBanned ? 'default' : 'destructive'}
              onClick={confirmBanUser}
            >
              {selectedUser?.isBanned ? 'رفع مسدودیت' : 'مسدود کردن'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>جزئیات کاربر</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl">
                    {selectedUser.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <h3>{selectedUser.fullName}</h3>
                  <p className="text-sm text-muted-foreground">شناسه: {selectedUser.id}</p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        selectedUser.role === UserRole.ADMIN
                          ? 'destructive'
                          : selectedUser.role === UserRole.DRIVER
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {ROLE_LABELS[selectedUser.role]}
                    </Badge>
                    {selectedUser.isBanned ? (
                      <Badge variant="destructive">
                        <Ban className="ml-1 h-3 w-3" />
                        مسدود
                      </Badge>
                    ) : (
                      <Badge variant={selectedUser.isActive ? 'default' : 'secondary'}>
                        {selectedUser.isActive ? 'فعال' : 'غیرفعال'}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* اطلاعات تماس */}
              <div>
                <h4 className="mb-4">اطلاعات تماس</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      شماره تلفن
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{selectedUser.phoneNumber}</span>
                      {selectedUser.isPhoneVerified && (
                        <Badge variant="outline" className="text-xs">
                          تأیید شده
                        </Badge>
                      )}
                    </div>
                  </div>

                  {selectedUser.email && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        ایمیل
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{selectedUser.email}</span>
                        {selectedUser.isEmailVerified && (
                          <Badge variant="outline" className="text-xs">
                            تأیید شده
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedUser.nationalId && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">کد ملی</div>
                      <div>{selectedUser.nationalId}</div>
                    </div>
                  )}

                  {selectedUser.city && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        شهر
                      </div>
                      <div>{selectedUser.city}</div>
                    </div>
                  )}

                  {selectedUser.address && (
                    <div className="space-y-1 md:col-span-2">
                      <div className="text-sm text-muted-foreground">آدرس</div>
                      <div>{selectedUser.address}</div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* آمار */}
              <div>
                <h4 className="mb-4">آمار عملکرد</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">کل سفارشات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl">{selectedUser.totalOrders}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">تکمیل شده</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl">{selectedUser.completedOrders}</div>
                      <p className="text-xs text-muted-foreground">
                        {selectedUser.totalOrders > 0
                          ? ((selectedUser.completedOrders / selectedUser.totalOrders) * 100).toFixed(1)
                          : 0}
                        % نرخ تکمیل
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">لغو شده</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl">{selectedUser.cancelledOrders}</div>
                      <p className="text-xs text-muted-foreground">
                        {selectedUser.totalOrders > 0
                          ? ((selectedUser.cancelledOrders / selectedUser.totalOrders) * 100).toFixed(1)
                          : 0}
                        % نرخ لغو
                      </p>
                    </CardContent>
                  </Card>

                  {selectedUser.role === UserRole.CUSTOMER && selectedUser.totalSpent > 0 && (
                    <Card className="md:col-span-3">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">کل مبلغ خرج شده</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl">
                          {(selectedUser.totalSpent / 1000000).toFixed(1)} میلیون تومان
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {selectedUser.role === UserRole.DRIVER && selectedUser.totalEarnings > 0 && (
                    <Card className="md:col-span-3">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">کل درآمد</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl">
                          {(selectedUser.totalEarnings / 1000000).toFixed(1)} میلیون تومان
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              <Separator />

              {/* مسدودیت */}
              {selectedUser.isBanned && (
                <>
                  <div>
                    <h4 className="mb-4 text-red-600">اطلاعات مسدودیت</h4>
                    <div className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-4">
                      {selectedUser.bannedAt && (
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">تاریخ مسدودیت</div>
                          <div>{new Date(selectedUser.bannedAt).toLocaleDateString('fa-IR')}</div>
                        </div>
                      )}
                      {selectedUser.banReason && (
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">دلیل مسدودیت</div>
                          <div>{selectedUser.banReason}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* یادداشت ادمین */}
              {selectedUser.adminNote && (
                <>
                  <div>
                    <h4 className="mb-2">یادداشت ادمین</h4>
                    <p className="rounded-lg bg-muted p-3 text-sm">{selectedUser.adminNote}</p>
                  </div>
                  <Separator />
                </>
              )}

              {/* تاریخ‌ها */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    تاریخ عضویت
                  </div>
                  <div>{new Date(selectedUser.createdAt).toLocaleDateString('fa-IR')}</div>
                </div>

                {selectedUser.lastLoginAt && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      آخرین ورود
                    </div>
                    <div>
                      {new Date(selectedUser.lastLoginAt).toLocaleDateString('fa-IR')}{' '}
                      {new Date(selectedUser.lastLoginAt).toLocaleTimeString('fa-IR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                )}

                {selectedUser.updatedAt && (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">آخرین بروزرسانی</div>
                    <div>{new Date(selectedUser.updatedAt).toLocaleDateString('fa-IR')}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};