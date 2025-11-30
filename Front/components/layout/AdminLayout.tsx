import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { Home, Package, Users, Truck, UserCog, Grid, DollarSign, Wallet, Settings } from 'lucide-react';

const adminMenuItems = [
  { icon: Home, label: 'داشبورد', path: '/admin' },
  { icon: Package, label: 'مدیریت سفارشات', path: '/admin/orders' },
  { icon: Users, label: 'مدیریت کاربران', path: '/admin/users' },
  { icon: UserCog, label: 'مدیریت رانندگان', path: '/admin/drivers' },
  { icon: Truck, label: 'مدیریت خدمات', path: '/admin/services' },
  { icon: Grid, label: 'مدیریت کاتالوگ', path: '/admin/catalog' },
  { icon: DollarSign, label: 'تعرفه و قیمت‌گذاری', path: '/admin/pricing' },
  { icon: Wallet, label: 'مدیریت مالی', path: '/admin/financial' },
  { icon: Settings, label: 'تنظیمات', path: '/admin/settings' },
];

export const AdminLayout = () => {
  return (
    <div className="flex min-h-screen" dir="rtl">
      <DashboardSidebar menuItems={adminMenuItems} />
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};
