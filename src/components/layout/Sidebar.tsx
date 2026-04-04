import { NavLink, useNavigate } from 'react-router-dom';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/authStore';
import { LayoutDashboard, Receipt, Lightbulb, Settings, LogOut } from 'lucide-react';
import { Badge } from '../ui/Badge';
import zorvynLogo from '../../assets/zorvynimg.png';

export function Sidebar() {
  const { sidebarCollapsed, role, profileName } = useUIStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Insights', path: '/insights', icon: Lightbulb },
  ];

  const wClass = sidebarCollapsed ? 'w-20' : 'w-64';
  const initial = profileName ? profileName.charAt(0).toUpperCase() : 'V';

  return (
    <aside className={`fixed left-0 top-0 h-screen ${wClass} bg-bg-surface border-r border-border-default transition-all duration-300 z-30 flex flex-col`}>
      <div className="h-16 flex items-center px-4 border-b border-border-default">
        <div className="flex items-center gap-2">
          <img src={zorvynLogo} alt="Zorvyn" className="h-8 w-auto object-contain" />
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                isActive
                  ? 'bg-accent-glow text-accent-primary font-medium'
                  : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
              }`
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
        
        <div className="pt-6 mt-6 border-t border-border-default">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                isActive
                  ? 'bg-accent-glow text-accent-primary font-medium'
                  : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
              }`
            }
          >
            <Settings className="h-5 w-5 flex-shrink-0 group-hover:rotate-45 transition-transform" />
            {!sidebarCollapsed && <span>Settings</span>}
          </NavLink>
        </div>
      </nav>

      <div className="p-4 border-t border-border-default">
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} p-2 rounded-lg bg-bg-elevated`}>
          <div className="h-8 w-8 rounded-full bg-accent-primary flex items-center justify-center text-white font-bold flex-shrink-0">
            {initial}
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{profileName}</p>
              <Badge variant={role === 'admin' ? 'admin' : 'viewer'} className="mt-0.5">
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Badge>
            </div>
          )}
          {!sidebarCollapsed && (
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
