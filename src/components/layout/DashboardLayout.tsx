import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { ToastContainer } from '../ui/Toast';
import { WelcomeTour } from '../ui/WelcomeTour';
import { useUIStore } from '../../store/useUIStore';

export function DashboardLayout() {
  const { sidebarCollapsed } = useUIStore();
  
  return (
    <>
      <div className="min-h-screen bg-bg-base flex">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
          <Header />
          
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-8">
            <div className="animate-in fade-in duration-300">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <MobileNav />
      <ToastContainer />
      <WelcomeTour />
    </>
  );
}
