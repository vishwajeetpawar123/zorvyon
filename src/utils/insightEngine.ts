import { Transaction, CategoryStat, MonthlyData, Insight, Currency } from '../types';
import { formatCurrency, capitalize } from './formatters';

export function getTopCategories(transactions: Transaction[]): CategoryStat[] {
  const expenses = transactions.filter(t => t.type === 'expense');
  const totals = expenses.reduce((acc, t) => {
    if (!acc[t.category]) {
      acc[t.category] = { category: t.category, total: 0, count: 0, percentage: 0, color: '' };
    }
    acc[t.category].total += t.amount;
    acc[t.category].count += 1;
    return acc;
  }, {} as Record<string, CategoryStat>);

  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

  return Object.values(totals)
    .sort((a, b) => b.total - a.total)
    .map(stat => ({
      ...stat,
      percentage: totalExpense > 0 ? (stat.total / totalExpense) * 100 : 0
    }));
}

export function getMonthlyComparison(transactions: Transaction[]): MonthlyData[] {
  const monthsData = transactions.reduce((acc, t) => {
    // get YYYY-MM
    const month = t.date.substring(0, 7);
    if (!acc[month]) {
      acc[month] = { month, income: 0, expenses: 0, savings: 0 };
    }
    if (t.type === 'income') acc[month].income += t.amount;
    else acc[month].expenses += t.amount;
    return acc;
  }, {} as Record<string, MonthlyData>);

  const sorted = Object.values(monthsData).sort((a, b) => a.month.localeCompare(b.month));
  
  return sorted.map(m => ({
    ...m,
    savings: m.income - m.expenses
  }));
}

export function getAiInsights(transactions: Transaction[], currency: Currency = 'USD'): Insight[] {
  if (transactions.length === 0) return [];

  const insights: Insight[] = [];
  const topCategories = getTopCategories(transactions);
  const monthlyData = getMonthlyComparison(transactions);

  // 1. Highest Spending Category
  if (topCategories.length > 0) {
    const highest = topCategories[0];
    insights.push({
      id: 'high-spend',
      title: 'Highest Spending Category',
      description: `You've spent the most on ${capitalize(highest.category)} overall (${highest.percentage.toFixed(0)}% of all expenses).`,
      type: highest.percentage > 30 ? 'warning' : 'neutral',
      value: formatCurrency(highest.total, currency),
      icon: 'pie-chart'
    });
  }

  // 2. Savings Rate Hero
  if (monthlyData.length >= 2) {
    const bestMonth = [...monthlyData].sort((a, b) => b.savings - a.savings)[0];
    if (bestMonth.savings > 0) {
      const parsedMonth = new Date(bestMonth.month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' });
      insights.push({
        id: 'best-saving',
        title: 'Best Saving Month',
        description: `${parsedMonth} was your most efficient month, driven by high income retention.`,
        type: 'positive',
        value: formatCurrency(bestMonth.savings, currency),
        icon: 'trending-up'
      });
    }
  }

  // 3. Average Daily Spend
  const expenses = transactions.filter(t => t.type === 'expense');
  if (expenses.length > 0) {
    // calculate days difference between first and last txn
    const sortedDates = expenses.map(t => new Date(t.date).getTime()).sort((a, b) => a - b);
    const earliest = sortedDates[0];
    const latest = sortedDates[sortedDates.length - 1];
    const diffDays = Math.max(1, Math.ceil((latest - earliest) / (1000 * 60 * 60 * 24)));
    
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const dailyAvg = totalExpenses / diffDays;

    insights.push({
      id: 'daily-avg',
      title: 'Average Daily Spend',
      description: 'Your average outflow per day. Keeping this below $50 accelerates savings.',
      type: dailyAvg > 100 ? 'warning' : 'neutral',
      value: formatCurrency(dailyAvg, currency),
      icon: 'calendar'
    });
  }

  // 4. Monthly Trend Alert
  if (monthlyData.length >= 2) {
    const currentM = monthlyData[monthlyData.length - 1];
    const prevM = monthlyData[monthlyData.length - 2];
    
    if (currentM.expenses > prevM.expenses * 1.1) {
      insights.push({
        id: 'spending-alert',
        title: 'Spending Acceleration',
        description: 'Your expenses this month are tracking higher than last month.',
        type: 'negative',
        value: `+${(((currentM.expenses - prevM.expenses) / prevM.expenses) * 100).toFixed(0)}%`,
        icon: 'alert'
      });
    }
  }

  return insights;
}
