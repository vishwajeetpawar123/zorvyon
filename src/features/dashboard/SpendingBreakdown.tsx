import { useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useTransactionStore } from '../../store/useTransactionStore';
import { useUIStore } from '../../store/useUIStore';
import { formatCurrency, capitalize } from '../../utils/formatters';
import { Home, ShoppingCart, Zap, Car, Tv, Utensils, ShoppingBag, Stethoscope, Mail, GraduationCap, Box } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  housing: '#6C5CE7',
  groceries: '#00D68F',
  utilities: '#54A0FF',
  transportation: '#FDCB6E',
  entertainment: '#FF6B6B',
  dining: '#FF9F43',
  shopping: '#E84393',
  healthcare: '#00CEC9',
  subscriptions: '#A29BFE',
  education: '#FDCB6E',
  other: '#B2BEC3',
};

const CATEGORY_ICONS: Record<string, any> = {
  housing: Home,
  groceries: ShoppingCart,
  utilities: Zap,
  transportation: Car,
  entertainment: Tv,
  dining: Utensils,
  shopping: ShoppingBag,
  healthcare: Stethoscope,
  subscriptions: Mail,
  education: GraduationCap,
  other: Box,
};

export function SpendingBreakdown() {
  const { transactions } = useTransactionStore();
  const { currency } = useUIStore();

  const data = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [transactions]);

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card 
      title="Top Spending Categories" 
      subtitle="Highest expenses by category"
      glass
      className="col-span-1 lg:col-span-1 h-[320px] lg:h-[380px] animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
      contentClassName="flex flex-col lg:flex-row items-center overflow-hidden lg:gap-2 px-4 pb-2"
      style={{ animationDelay: '300ms' }}
    >
      <div className="w-full lg:w-1/2 h-32 lg:h-full shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={60}
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS.other} 
                  className="cursor-pointer outline-none transition-all duration-300"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-bg-elevated)', 
                borderColor: 'var(--color-border-default)',
                borderRadius: '8px',
                color: 'var(--color-text-primary)'
              }}
              formatter={(value: any, name: any) => [formatCurrency(value as number, currency), capitalize(name as string)]}
              labelStyle={{ display: 'none' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex-1 w-full flex flex-col justify-center gap-0.5">
        {data.map((item) => {
          const Icon = CATEGORY_ICONS[item.name] || Box;
          const color = CATEGORY_COLORS[item.name] || CATEGORY_COLORS.other;
          return (
            <div 
              key={item.name} 
              className="flex items-center justify-between py-1.5 border-b border-border-default last:border-0 hover:bg-bg-elevated/40 px-2 rounded-lg transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border border-border-default/50 shadow-sm group-hover:scale-110 transition-transform" 
                  style={{ backgroundColor: `${color}20`, color: color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-text-primary capitalize block leading-none">{item.name}</span>
                  <span className="text-[10px] text-text-muted leading-tight">{((item.value / total) * 100).toFixed(0)}% of total</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-text-primary leading-none">{formatCurrency(item.value, currency)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
