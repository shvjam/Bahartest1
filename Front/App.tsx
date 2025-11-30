import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { OrderFormProvider } from './contexts/OrderFormContext';

// Components
import { ProtectedRoute } from './components/ProtectedRoute';
import { DevBackendStatus } from './components/DevBackendStatus';
import { DevLoginHelper } from './components/DevLoginHelper';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { CustomerLayout } from './components/layout/CustomerLayout';
import { DriverLayout } from './components/layout/DriverLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ServicesPage } from './pages/public/ServicesPage';
import { OrderFormPage } from './pages/public/OrderFormPage';
import { LoginPage } from './pages/public/LoginPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';

// Customer Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { CustomerOrders } from './pages/customer/CustomerOrders';
import { OrderTracking } from './pages/customer/OrderTracking';
import { CustomerProfile } from './pages/customer/CustomerProfile';
import { CustomerTickets } from './pages/customer/CustomerTickets';
import { CustomerTransactions } from './pages/customer/CustomerTransactions';

// Driver Pages
import { DriverDashboard } from './pages/driver/DriverDashboard';
import { DriverOrders } from './pages/driver/DriverOrders';
import { DriverNavigation } from './pages/driver/DriverNavigation';
import { ActiveTripNavigation } from './pages/driver/ActiveTripNavigation';
import { DriverEarnings } from './pages/driver/DriverEarnings';
import { DriverProfile } from './pages/driver/DriverProfile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminDrivers from './pages/admin/AdminDrivers';
import { AdminUsers } from './pages/admin/AdminUsers';
import AdminServices from './pages/admin/AdminServices';
import { AdminCatalog } from './pages/admin/AdminCatalog';
import { AdminPricing } from './pages/admin/AdminPricing';
import { PricingSettingsPage } from './pages/admin/PricingSettingsPage';
import { AdminFinancial } from './pages/admin/AdminFinancial';
import AdminSettings from './pages/admin/AdminSettings';

import './styles/globals.css';

export default function App() {
  // در این محیط import.meta ممکنه undefined باشه، پس DevTools رو همیشه نشون میدیم
  const isDev = true; // برای development

  return (
    <BrowserRouter>
      <AuthProvider>
        <OrderFormProvider>
          <Toaster position="top-center" richColors />
          
          {/* Dev Tools - Only show in development */}
          {isDev && (
            <>
              <DevBackendStatus />
              <DevLoginHelper />
            </>
          )}

          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/order/:serviceSlug" element={<OrderFormPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* Customer Routes */}
            <Route
              path="/customer"
              element={
                <ProtectedRoute allowedRoles={['Customer', 'Admin']}>
                  <CustomerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/customer/dashboard" replace />} />
              <Route path="dashboard" element={<CustomerDashboard />} />
              <Route path="orders" element={<CustomerOrders />} />
              <Route path="orders/:orderId/track" element={<OrderTracking />} />
              <Route path="profile" element={<CustomerProfile />} />
              <Route path="tickets" element={<CustomerTickets />} />
              <Route path="transactions" element={<CustomerTransactions />} />
            </Route>

            {/* Driver Routes */}
            <Route
              path="/driver"
              element={
                <ProtectedRoute allowedRoles={['Driver', 'Admin']}>
                  <DriverLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/driver/dashboard" replace />} />
              <Route path="dashboard" element={<DriverDashboard />} />
              <Route path="orders" element={<DriverOrders />} />
              <Route path="navigation" element={<DriverNavigation />} />
              <Route path="trip/:orderId" element={<ActiveTripNavigation />} />
              <Route path="earnings" element={<DriverEarnings />} />
              <Route path="profile" element={<DriverProfile />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="drivers" element={<AdminDrivers />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="catalog" element={<AdminCatalog />} />
              <Route path="pricing" element={<AdminPricing />} />
              <Route path="pricing-settings" element={<PricingSettingsPage />} />
              <Route path="financial" element={<AdminFinancial />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Error Routes */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </OrderFormProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}