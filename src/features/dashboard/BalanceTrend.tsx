import { useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTransactionStore } from '../../store/useTransactionStore';
import { useUIStore } from '../../store/useUIStore';
import { formatCurrency, formatDateShort, getCurrencySymbol } from '../../utils/formatters';
import { format, subDays, parseISO, isAfter } from 'date-fns';

export function BalanceTrend() {
  const { transactions } = useTransactionStore();
  const { currency } = useUIStore();
  const [timeRange, setTimeRange] = useState<30 | 90 | 180>(30);

  const data = useMemo(() => {
    const daysToShow = timeRange;
    const result = [];
    const today = new Date();
    
    let currentBalance = transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0);
    
    const sortedTxns = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let txnIdx = 0;
    
    for (let i = 0; i < daysToShow; i++) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      while (txnIdx < sortedTxns.length) {
        const tDate = parseISO(sortedTxns[txnIdx].date);
        if (isAfter(tDate, date)) {
          const t = sortedTxns[txnIdx];
          currentBalance += (t.type === 'income' ? -t.amount : t.amount);
          txnIdx++;
        } else {
          break;
        }
      }
      
      result.unshift({
        date: dateStr,
        displayDate: formatDateShort(dateStr),
        balance: currentBalance
      });
    }
    
    return result;
  }, [transactions, timeRange]);

  const sym = getCurrencySymbol(currency);

  return (
    <Card 
      glass
      className="col-span-1 lg:col-span-2 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
      contentClassName="flex flex-col"
      style={{ animationDelay: '200ms' }}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Balance Trend</h3>
          <p className="text-sm text-text-secondary mt-1">Your account balance over the last {timeRange} days</p>
        </div>
        <div className="flex bg-bg-elevated rounded-lg p-1">
          <button 
            onClick={() => setTimeRange(30)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeRange === 30 ? 'bg-bg-surface text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
          >
            1M
          </button>
          <button 
            onClick={() => setTimeRange(90)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeRange === 90 ? 'bg-bg-surface text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
          >
            3M
          </button>
          <button 
            onClick={() => setTimeRange(180)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeRange === 180 ? 'bg-bg-surface text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
          >
            6M
          </button>
        </div>
      </div>

      <div className="flex-1 w-full mt-4 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent-primary)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="var(--color-accent-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-default)" />
            <XAxis 
              dataKey="displayDate" 
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
              itemStyle={{ color: 'var(--color-accent-primary)' }}
              formatter={(value) => [formatCurrency(Number(value), currency), 'Balance']}
              labelStyle={{ color: 'var(--color-text-secondary)', marginBottom: '8px' }}
            />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="var(--color-accent-primary)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorBalance)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
