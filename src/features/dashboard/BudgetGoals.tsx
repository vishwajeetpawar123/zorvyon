import { useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { useTransactionStore } from '../../store/useTransactionStore';
import { useUIStore } from '../../store/useUIStore';
import { formatCurrency, capitalize } from '../../utils/formatters';
import { Target } from 'lucide-react';

export function BudgetGoals() {
  const { transactions } = useTransactionStore();
  const { budgetGoals, currency } = useUIStore();

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    transactions.forEach(t => {
      if (t.type === 'expense') {
        totals[t.category] = (totals[t.category] || 0) + t.amount;
      }
    });
    return totals;
  }, [transactions]);

  if (budgetGoals.length === 0) return null;

  return (
    <Card className="col-span-1 lg:col-span-2">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-info/10 rounded-xl text-info">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-text-primary">Budget Goals</h2>
          <p className="text-sm text-text-secondary">Monitor your spending limits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {budgetGoals.map(goal => {
          const spent = categoryTotals[goal.category] || 0;
          const percentage = Math.min((spent / goal.limit) * 100, 100);
          const isOver = spent > goal.limit;
          
          const strokeColor = isOver ? 'var(--color-error)' : 'var(--accent-primary)';
          const circumference = 2 * Math.PI * 40;
          const strokeDashoffset = circumference - (percentage / 100) * circumference;

          return (
            <div key={goal.category} className="flex flex-col items-center justify-center p-5 bg-bg-surface/50 rounded-3xl border border-border-default">
              <div className="relative w-24 h-24 mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-border-default stroke-current"
                    strokeWidth="8"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  />
                  <circle
                    className="stroke-current transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ stroke: strokeColor }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-sm font-bold ${isOver ? 'text-error' : 'text-text-primary'}`}>
                    {Math.round(percentage)}%
                  </span>
                </div>
              </div>
              <h3 className="font-medium text-text-primary mb-1">{capitalize(goal.category)}</h3>
              <p className="text-xs text-text-muted">
                <span className={isOver ? 'text-error font-medium' : ''}>{formatCurrency(spent, currency)}</span>
                {' / '}
                {formatCurrency(goal.limit, currency)}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
