import { useMemo } from 'react';
import { useTransactionStore } from '../../store/useTransactionStore';
import { useUIStore } from '../../store/useUIStore';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDate, capitalize } from '../../utils/formatters';
import { Edit2, Trash2, ArrowDownCircle, ArrowUpCircle, AlertCircle, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Transaction } from '../../types';

interface TransactionTableProps {
  onEdit: (id: string) => void;
}

export function TransactionTable({ onEdit }: TransactionTableProps) {
  const { transactions, filters, sortConfig, setSort, pagination, setPage, deleteTransaction } = useTransactionStore();
  const { role, currency } = useUIStore();

  const filteredAndSorted = useMemo(() => {
    let result = transactions.filter(t => {
      if (filters.search && !t.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.type !== 'all' && t.type !== filters.type) return false;
      if (filters.categories && filters.categories.length > 0) {
        if (!filters.categories.includes(t.category)) return false;
      }
      if (filters.dateRange.from) {
        if (new Date(t.date) < new Date(filters.dateRange.from)) return false;
      }
      if (filters.dateRange.to) {
        const toDate = new Date(filters.dateRange.to);
        toDate.setDate(toDate.getDate() + 1);
        if (new Date(t.date) >= toDate) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

    return result;
  }, [transactions, filters, sortConfig]);

  const totalPages = Math.ceil(filteredAndSorted.length / pagination.pageSize);
  const paginatedData = filteredAndSorted.slice(
    (pagination.page - 1) * pagination.pageSize,
    pagination.page * pagination.pageSize
  );

  const handleSort = (key: keyof Omit<Transaction, 'id'>) => {
    setSort(key);
  };

  const SortIcon = ({ column }: { column: keyof Transaction }) => {
    if (sortConfig.key !== column) return <ChevronDown className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
  };

  if (filteredAndSorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-bg-surface border border-border-default rounded-xl">
        <AlertCircle className="h-12 w-12 text-text-muted mb-4" />
        <h3 className="text-lg font-medium text-text-primary">No transactions found</h3>
        <p className="text-text-secondary mt-1">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="bg-bg-surface border border-border-default rounded-xl overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-elevated border-b border-border-default text-xs uppercase tracking-wider text-text-secondary">
              <th className="px-6 py-4 font-medium min-w-[120px] cursor-pointer group" onClick={() => handleSort('date')}>
                <div className="flex items-center gap-1">Date <SortIcon column="date" /></div>
              </th>
              <th className="px-6 py-4 font-medium min-w-[200px] cursor-pointer group" onClick={() => handleSort('description')}>
                <div className="flex items-center gap-1">Description <SortIcon column="description" /></div>
              </th>
              <th className="px-6 py-4 font-medium cursor-pointer group" onClick={() => handleSort('category')}>
                <div className="flex items-center gap-1">Category <SortIcon column="category" /></div>
              </th>
              <th className="px-6 py-4 font-medium cursor-pointer group" onClick={() => handleSort('amount')}>
                <div className="flex items-center gap-1 justify-end">Amount <SortIcon column="amount" /></div>
              </th>
              {role === 'admin' && <th className="px-6 py-4 font-medium text-right w-24">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {paginatedData.map((txn, idx) => (
              <tr 
                key={txn.id} 
                className="hover:bg-bg-elevated/40 transition-colors animate-in fade-in fill-mode-both"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  {formatDate(txn.date)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${txn.type === 'income' ? 'bg-color-success/10 text-color-success' : 'bg-bg-elevated text-text-secondary'}`}>
                      {txn.type === 'income' ? <ArrowUpCircle className="h-4 w-4" /> : <ArrowDownCircle className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-text-primary text-sm">{txn.description}</p>
                      {txn.status === 'pending' && <span className="text-[10px] text-color-warning uppercase tracking-wider font-semibold">Pending</span>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="neutral">{capitalize(txn.category)}</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className={`font-mono font-medium ${txn.type === 'income' ? 'text-color-success' : 'text-text-primary'}`}>
                    {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount, currency)}
                  </span>
                </td>
                {role === 'admin' && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onEdit(txn.id)} className="p-1.5 text-text-muted hover:text-accent-primary hover:bg-bg-elevated rounded transition-colors" title="Edit">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm('Delete this transaction?')) deleteTransaction(txn.id);
                        }} 
                        className="p-1.5 text-text-muted hover:text-color-error hover:bg-color-error/10 rounded transition-colors" 
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="p-4 border-t border-border-default flex items-center justify-between bg-bg-elevated/30">
          <p className="text-sm text-text-secondary">
            Showing <span className="font-medium text-text-primary">{(pagination.page - 1) * pagination.pageSize + 1}</span> to <span className="font-medium text-text-primary">{Math.min(pagination.page * pagination.pageSize, filteredAndSorted.length)}</span> of <span className="font-medium text-text-primary">{filteredAndSorted.length}</span> results
          </p>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => setPage(pagination.page - 1)} 
              disabled={pagination.page === 1}
              icon={<ChevronLeft className="h-4 w-4" />}
            >
              Prev
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => setPage(pagination.page + 1)} 
              disabled={pagination.page === totalPages}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
