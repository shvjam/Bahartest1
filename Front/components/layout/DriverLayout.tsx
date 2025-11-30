import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { Home, Package, Navigation, DollarSign, User } from 'lucide-react';

const driverMenuItems = [
  { icon: Home, label: 'داشبورد', path: '/driver' },
  { icon: Package, label: 'سفارشات', path: '/driver/orders' },
  { icon: DollarSign, label: 'درآمد', path: '/driver/earnings' },
  { icon: User, label: 'پروفایل', path: '/driver/profile' },
];

export const DriverLayout = () => {
  return (
    <div className="flex min-h-screen" dir="rtl">
      <DashboardSidebar menuItems={driverMenuItems} />
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};
