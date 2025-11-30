import { Link, useNavigate } from 'react-router-dom';
import { Menu, User, Phone, LogIn, LayoutDashboard, Package, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth, useRole } from '../../contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet';

export const PublicHeader = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { isCustomer, isDriver, isAdmin } = useRole();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin';
    if (isDriver) return '/driver';
    if (isCustomer) return '/customer';
    return '/';
  };

  const handleNavigateToDashboard = () => {
    navigate(getDashboardLink());
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px]">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl">باربری بهار</span>
            <div className="text-2xl">🚚</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm transition-colors hover:text-primary">
              صفحه اصلی
            </Link>
            <Link to="/services" className="text-sm transition-colors hover:text-primary">
              خدمات
            </Link>
            <a href="tel:02191005100" className="text-sm transition-colors hover:text-primary flex items-center gap-1">
              <span>021-91005100</span>
              <Phone className="w-4 h-4" />
            </a>
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <span>{user.fullName || user.phoneNumber}</span>
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={handleNavigateToDashboard} className="cursor-pointer justify-end">
                    <span>پنل کاربری</span>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                  </DropdownMenuItem>
                  {isCustomer && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/customer/orders')} className="cursor-pointer justify-end">
                        <span>سفارشات من</span>
                        <Package className="w-4 h-4 mr-2" />
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} variant="destructive" className="cursor-pointer justify-end">
                    <span>خروج از حساب</span>
                    <LogOut className="w-4 h-4 mr-2" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate('/login')} size="sm" className="gap-2">
                <span>ورود / ثبت نام</span>
                <LogIn className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-4 mt-8 px-4" dir="rtl">
                <Link to="/" className="text-lg hover:text-primary transition-colors text-right">
                  صفحه اصلی
                </Link>
                <Link to="/services" className="text-lg hover:text-primary transition-colors text-right">
                  خدمات
                </Link>
                <a href="tel:02191005100" className="text-lg hover:text-primary transition-colors flex items-center gap-2 justify-end">
                  <span>021-91005100</span>
                  <Phone className="w-5 h-5" />
                </a>
                
                <div className="h-px bg-border my-2" />
                
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-2 py-2 px-3 bg-accent rounded-md justify-end">
                      <span className="text-sm">{user.fullName || user.phoneNumber}</span>
                      <User className="w-5 h-5" />
                    </div>
                    <Link to={getDashboardLink()} className="text-lg hover:text-primary transition-colors flex items-center gap-2 justify-end">
                      <span>پنل کاربری</span>
                      <LayoutDashboard className="w-5 h-5" />
                    </Link>
                    {isCustomer && (
                      <>
                        <Link to="/customer/orders" className="text-lg hover:text-primary transition-colors flex items-center gap-2 justify-end">
                          <span>سفارشات من</span>
                          <Package className="w-5 h-5" />
                        </Link>
                      </>
                    )}
                    <button onClick={handleLogout} className="text-lg hover:text-destructive transition-colors text-right flex items-center gap-2 justify-end">
                      <span>خروج از حساب</span>
                      <LogOut className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <SheetClose asChild>
                    <Button onClick={() => navigate('/login')} className="gap-2 mx-auto w-full">
                      <span>ورود / ثبت نام</span>
                      <LogIn className="w-4 h-4" />
                    </Button>
                  </SheetClose>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};