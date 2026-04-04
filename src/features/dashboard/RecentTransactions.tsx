import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useTransactionStore } from '../../store/useTransactionStore';
import { useUIStore } from '../../store/useUIStore';
import { formatCurrency, formatDateShort, capitalize } from '../../utils/formatters';
import { ArrowDownRight, ArrowUpRight, ArrowRight } from 'lucide-react';

export function RecentTransactions() {
  const { transactions } = useTransactionStore();
  const { currency } = useUIStore();
  const navigate = useNavigate();

  const recentTxns = transactions.slice(0, 5);

  return (
    <Card 
      glass
      className="col-span-1 lg:col-span-3 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
      style={{ animationDelay: '400ms' }}
    >
      <div className="px-6 py-4 border-b border-border-default flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Recent Transactions</h3>
          <p className="text-sm text-text-secondary mt-1">Your latest financial activity</p>
        </div>
        <button 
          onClick={() => navigate('/transactions')}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-accent-primary hover:underline underline-offset-2 transition-colors"
        >
          View All <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="p-0">
        <ul className="divide-y divide-border-default">
          {recentTxns.map((txn, idx) => (
            <li 
              key={txn.id} 
              className={`p-4 sm:px-6 hover:bg-bg-elevated/50 transition-colors flex items-center justify-between animate-in fade-in slide-in-from-right-4 fill-mode-both`}
              style={{ animationDelay: `${500 + idx * 50}ms` }}
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center shrink-0 ${txn.type === 'income' ? 'bg-color-success/10 text-color-success' : 'bg-bg-elevated text-text-secondary'}`}>
                  {txn.type === 'income' ? <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" /> : <ArrowDownRight className="h-4 w-4 sm:h-5 sm:w-5" />}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-text-primary text-sm truncate">{txn.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-text-muted">{formatDateShort(txn.date)}</span>
                    <span className="text-text-muted text-xs hidden sm:inline">•</span>
                    <Badge variant="neutral" className="text-[10px] py-0 hidden sm:inline-flex">{capitalize(txn.category)}</Badge>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 pl-3">
                <p className={`font-semibold font-mono text-sm ${txn.type === 'income' ? 'text-color-success' : 'text-text-primary'}`}>
                  {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount, currency)}
                </p>
                {txn.status === 'pending' && <p className="text-xs text-color-warning mt-1">Pending</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
