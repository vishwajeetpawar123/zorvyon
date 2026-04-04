import { useMemo } from 'react';
import { useTransactionStore } from '../../store/useTransactionStore';
import { useUIStore } from '../../store/useUIStore';
import { getAiInsights } from '../../utils/insightEngine';
import { InsightCard } from './InsightCard';
import { MonthlyComparison } from './MonthlyComparison';
import { Button } from '../../components/ui/Button';
import { FileText } from 'lucide-react';

export function InsightsPage() {
  const { transactions } = useTransactionStore();
  const { role, currency } = useUIStore();

  const insights = useMemo(() => getAiInsights(transactions, currency), [transactions, currency]);

  return (
    <div className="space-y-6 pb-12">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500 fill-mode-both">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Financial Insights</h1>
          <p className="text-text-secondary mt-1">Smart analysis of your spending patterns and cash flow.</p>
        </div>
        
        {role === 'admin' && (
          <Button variant="secondary" className="animate-in fade-in duration-700" icon={<FileText className="h-4 w-4" />}>
            Generate Report
          </Button>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {insights.map((insight, idx) => (
          <InsightCard key={insight.id} insight={insight} index={idx} />
        ))}
      </div>

      <div className="grid grid-cols-1 mt-6">
        <MonthlyComparison />
      </div>
    </div>
  );
}
