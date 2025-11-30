import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ShieldAlert, Home } from 'lucide-react';
import { useRole } from '../contexts/AuthContext';
import { UserRole } from '../types';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { role } = useRole();

  const getDashboardPath = () => {
    switch (role) {
      case UserRole.ADMIN:
        return '/admin';
      case UserRole.DRIVER:
        return '/driver';
      case UserRole.CUSTOMER:
        return '/customer';
      default:
        return '/';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" dir="rtl">
      <Card className="w-full max-w-md p-8 text-center">
        <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl mb-2">دسترسی غیرمجاز</h1>
        <p className="text-muted-foreground mb-6">
          شما اجازه دسترسی به این صفحه را ندارید.
        </p>
        <div className="flex flex-col gap-2">
          <Button onClick={() => navigate(getDashboardPath())} className="gap-2">
            <Home className="w-4 h-4" />
            بازگشت به داشبورد
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            بازگشت به صفحه قبل
          </Button>
        </div>
      </Card>
    </div>
  );
};
