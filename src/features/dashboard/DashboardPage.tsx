import { SummaryCards } from './SummaryCards';
import { BalanceTrend } from './BalanceTrend';
import { SpendingBreakdown } from './SpendingBreakdown';
import { RecentTransactions } from './RecentTransactions';
import { BudgetGoals } from './BudgetGoals';
import { useUIStore } from '../../store/useUIStore';
import { Button } from '../../components/ui/Button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function DashboardPage() {
  const { role, profileName } = useUIStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-12">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500 fill-mode-both">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {getGreeting()}, {profileName}
          </h1>
          <p className="text-text-secondary mt-1">Here is your financial summary for today.</p>
        </div>
        
        {role === 'admin' && (
          <Button onClick={() => navigate('/transactions?add=true')} className="animate-in fade-in duration-700">
            <Plus className="h-4 w-4" /> Add Transaction
          </Button>
        )}
      </header>
      
      <SummaryCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BalanceTrend />
        <div className="lg:row-span-2 flex flex-col">
          <SpendingBreakdown />
        </div>
        <BudgetGoals />
        <RecentTransactions />
      </div>
    </div>
  );
}
