import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUIStore } from '../../store/useUIStore';
import { useTransactionStore } from '../../store/useTransactionStore';
import { TransactionTable } from './TransactionTable';
import { TransactionFilters } from './TransactionFilters';
import { TransactionForm } from './TransactionForm';
import { Button } from '../../components/ui/Button';
import { Plus, Download } from 'lucide-react';
import { exportToCSV, exportToJSON } from '../../utils/exportData';

export function TransactionsPage() {
  const { role } = useUIStore();
  const { transactions } = useTransactionStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Allow routing here with ?add=true to pop the modal
  useEffect(() => {
    if (searchParams.get('add') === 'true' && role === 'admin') {
      setIsFormOpen(true);
      setSearchParams({});
    }
  }, [searchParams, role, setSearchParams]);

  const handleEdit = (id: string) => {
    setEditId(id);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditId(null);
  };

  const handleExport = (format: 'csv' | 'json') => {
    // In a real app we'd export the filtered list. I'll export all for simplicity here.
    if (format === 'csv') exportToCSV(transactions);
    else exportToJSON(transactions);
  };

  return (
    <div className="space-y-6 pb-12">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500 fill-mode-both">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Transactions</h1>
          <p className="text-text-secondary mt-1">View, search, and manage your financial activity.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative group inline-block">
            <Button variant="secondary" icon={<Download className="h-4 w-4" />}>
              Export
            </Button>
            {/* Simple dropdown for export options via hover */}
            <div className="absolute right-0 mt-2 w-40 bg-bg-surface border border-border-default rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <button onClick={() => handleExport('csv')} className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-bg-elevated first:rounded-t-lg">Export as CSV</button>
              <button onClick={() => handleExport('json')} className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-bg-elevated last:rounded-b-lg">Export as JSON</button>
            </div>
          </div>

          {role === 'admin' && (
            <Button onClick={() => setIsFormOpen(true)} className="animate-in fade-in duration-700">
              <Plus className="h-4 w-4" /> Add New
            </Button>
          )}
        </div>
      </header>
      
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '100ms' }}>
        <TransactionFilters />
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '200ms' }}>
        <TransactionTable onEdit={handleEdit} />
      </div>

      {isFormOpen && <TransactionForm onClose={handleCloseForm} editId={editId} />}
    </div>
  );
}
