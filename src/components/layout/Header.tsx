import { useUIStore } from '../../store/useUIStore';
import { Menu, Search, Shield } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Role } from '../../types';

export function Header() {
  const { toggleSidebar, role, setRole } = useUIStore();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as Role);
  };

  return (
    <header className="h-16 bg-bg-surface/80 backdrop-blur-md border-b border-border-default sticky top-0 z-20 transition-all duration-300 flex justify-between items-center px-4 sm:px-6">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors hidden lg:block"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden md:block w-full max-w-md">
          <Input 
            placeholder="Search transactions..." 
            icon={<Search className="h-4 w-4" />}
            className="bg-bg-base border-transparent focus:bg-bg-surface h-9"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <ThemeToggle />
        
        <div className="flex items-center gap-2">
          <Shield className={`h-4 w-4 hidden sm:block ${role === 'admin' ? 'text-amber-500' : 'text-blue-500'}`} />
          <Select 
            value={role} 
            onChange={handleRoleChange}
            options={[
              { label: 'Admin View', value: 'admin' },
              { label: 'Viewer View', value: 'viewer' },
            ]}
            className="w-28 sm:w-36 h-9 py-1 px-3 bg-transparent border-transparent cursor-pointer font-medium hover:bg-bg-elevated text-text-primary text-xs sm:text-sm"
          />
        </div>
      </div>
    </header>
  );
}
