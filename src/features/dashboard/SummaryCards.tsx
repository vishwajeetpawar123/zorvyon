import { useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { useTransactionStore } from '../../store/useTransactionStore';
import { useUIStore } from '../../store/useUIStore';
import { formatCurrency } from '../../utils/formatters';
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber';
import { ArrowDownRight, ArrowUpRight, DollarSign, Wallet } from 'lucide-react';

export function SummaryCards() {
  const { transactions } = useTransactionStore();
  const { currency } = useUIStore();

  const totals = useMemo(() => {
    let income = 0;
    let expenses = 0;

    transactions.forEach(t => {
      if (t.type === 'income') income += t.amount;
      else expenses += t.amount;
    });

    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  const animBalance = useAnimatedNumber(totals.balance);
  const animIncome = useAnimatedNumber(totals.income);
  const animExpenses = useAnimatedNumber(totals.expenses);
  const animSavings = useAnimatedNumber(totals.income > 0 ? ((totals.income - totals.expenses) / totals.income) * 100 : 0);

  const cards = [
    {
      title: 'Total Balance',
      value: formatCurrency(animBalance, currency),
      icon: Wallet,
      color: 'text-accent-primary',
      bgBase: 'bg-accent-primary/10',
      borderClass: 'border-l-4 border-l-accent-primary',
    },
    {
      title: 'Total Income',
      value: formatCurrency(animIncome, currency),
      icon: ArrowUpRight,
      color: 'text-color-success',
      bgBase: 'bg-color-success/10',
      borderClass: 'border-l-4 border-l-color-success',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(animExpenses, currency),
      icon: ArrowDownRight,
      color: 'text-color-error',
      bgBase: 'bg-color-error/10',
      borderClass: 'border-l-4 border-l-color-error',
    },
    {
      title: 'Savings Rate',
      value: `${animSavings.toFixed(1)}%`,
      icon: DollarSign,
      color: 'text-color-info',
      bgBase: 'bg-color-info/10',
      borderClass: 'border-l-4 border-l-color-info',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card, idx) => (
        <Card 
          key={card.title} 
          glass 
          className={`${card.borderClass} animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`}
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-text-secondary">{card.title}</p>
              <h3 className="text-2xl font-bold text-text-primary mt-2 font-mono tracking-tight">
                {card.value}
              </h3>
            </div>
            <div className={`p-3 rounded-lg ${card.bgBase} ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
