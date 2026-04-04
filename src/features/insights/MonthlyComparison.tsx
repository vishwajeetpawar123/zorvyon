import { useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTransactionStore } from '../../store/useTransactionStore';
import { useUIStore } from '../../store/useUIStore';
import { getMonthlyComparison } from '../../utils/insightEngine';
import { formatCurrency, getCurrencySymbol } from '../../utils/formatters';

export function MonthlyComparison() {
  const { transactions } = useTransactionStore();
  const { currency } = useUIStore();
  const sym = getCurrencySymbol(currency);

  const data = useMemo(() => {
    const raw = getMonthlyComparison(transactions);
    return raw.map(m => {
      const [year, mo] = m.month.split('-');
      const date = new Date(Number(year), Number(mo) - 1, 1);
      return {
        ...m,
        displayMonth: date.toLocaleDateString('default', { month: 'short', year: '2-digit' })
      };
    });
  }, [transactions]);

  return (
    <Card 
      title="Income vs Expenses" 
      subtitle="Monthly cash flow overview"
      glass
      className="col-span-1 lg:col-span-2 h-[420px] animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
      contentClassName="flex flex-col"
      style={{ animationDelay: '300ms' }}
    >
      <div className="flex-1 w-full mt-4 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-default)" />
            <XAxis 
              dataKey="displayMonth" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              tickFormatter={(value) => `${sym}${value / 1000}k`}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-bg-elevated)', 
                borderColor: 'var(--color-border-default)',
                borderRadius: '8px',
                color: 'var(--color-text-primary)'
              }}
              formatter={(value: any) => formatCurrency(value as number, currency)}
              cursor={{ fill: 'var(--color-bg-elevated)', opacity: 0.4 }}
            />
            <Legend 
              iconType="circle" 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Bar dataKey="income" name="Income" fill="var(--color-success)" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="expenses" name="Expenses" fill="var(--color-error)" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
