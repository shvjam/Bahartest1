import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LucideIcon, LogOut, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { useState } from 'react';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface DashboardSidebarProps {
  menuItems: MenuItem[];
}

export const DashboardSidebar = ({ menuItems }: DashboardSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full" dir="rtl">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 p-6 border-b justify-end">
        <span className="font-bold">باربری بهار</span>
        <div className="text-2xl">🚚</div>
      </Link>

      {/* User Info */}
      <div className="p-6 border-b text-right">
        <p className="text-sm text-muted-foreground">خوش آمدید</p>
        <p className="font-medium">{user?.fullName || user?.phoneNumber}</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors justify-end ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <span>{item.label}</span>
                <Icon className="w-5 h-5" />
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-end gap-3"
          onClick={handleLogout}
        >
          <span>خروج</span>
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-l bg-card flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b px-4 py-3 flex items-center justify-between" dir="rtl">
        <div className="w-10" /> {/* Spacer */}

        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold">باربری بهار</span>
          <div className="text-xl">🚚</div>
        </Link>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile spacing */}
      <div className="md:hidden h-16" />
    </>
  );
};
