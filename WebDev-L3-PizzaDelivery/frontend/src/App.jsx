import React, { useState } from 'react';
import ScreenPreviewSidebar from './components/ScreenPreviewSidebar.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import PizzaBuilderPage from './pages/PizzaBuilderPage.jsx';
import OrderSummaryPage from './pages/OrderSummaryPage.jsx';
import OrderTrackingPage from './pages/OrderTrackingPage.jsx';
import OrderHistoryPage from './pages/OrderHistoryPage.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';
import SearchSortPage from './pages/SearchSortPage.jsx';
import AdminInventoryPage from './pages/AdminInventoryPage.jsx';
import AdminOrderManagementPage from './pages/AdminOrderManagementPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import { useAuth } from './context/AuthContext.jsx';

export default function App() {
  const [resetToken, setResetToken] = useState('');
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined' && window.location.pathname.includes('/reset-password/')) {
      const parts = window.location.pathname.split('/reset-password/');
      if (parts[1]) {
        return 'reset-password';
      }
    }
    return 'landing';
  });

  const { user, isAdmin } = useAuth();

  const pages = [
    { id: 'landing', label: '🔥 Landing Page (Showcase)', component: LandingPage },
    { id: 'login', label: '1. Login / Register', component: LoginPage },
    { id: 'menu', label: '2. Dashboard (Browse)', component: DashboardPage },
    { id: 'builder', label: '3. Pizza Builder', component: PizzaBuilderPage },
    { id: 'summary', label: '4. Order Summary', component: OrderSummaryPage },
    { id: 'track', label: '5. Order Tracking', component: OrderTrackingPage },
    { id: 'history', label: '6. Order History', component: OrderHistoryPage },
    { id: 'profile', label: '7. User Profile', component: UserProfilePage },
    { id: 'search', label: '8. Search & Sort', component: SearchSortPage },
    { id: 'admin-inventory', label: '9. Admin Inventory', component: AdminInventoryPage },
    { id: 'admin-orders', label: '10. Kitchen HQ (Admin)', component: AdminOrderManagementPage },
    { id: 'reset-password', label: '11. Reset Password', component: ResetPasswordPage },
  ];

  const handleNavigate = (pageId) => {
    setActiveTab(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentPage = pages.find((p) => p.id === activeTab) || pages[1];
  const ComponentToRender = currentPage.component;

  return (
    <div className="min-h-screen w-full relative bg-[#FFF5F0]">
      {/* Side Drawer Page Navigator */}
      <ScreenPreviewSidebar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        pages={pages}
      />

      {/* Active Page Renderer */}
      <ComponentToRender
        onNavigate={handleNavigate}
        onLoginSuccess={() => handleNavigate('menu')}
        activeTab={activeTab}
        user={user}
        isAdmin={isAdmin}
      />
    </div>
  );
}
