import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { useTransactionStore } from '../../store/useTransactionStore';
import { Transaction, Category } from '../../types';
import { X } from 'lucide-react';

interface TransactionFormProps {
  onClose: () => void;
  editId?: string | null;
}

const CATEGORY_OPTIONS: {label: string, value: Category}[] = [
  { label: 'Housing', value: 'housing' },
  { label: 'Groceries', value: 'groceries' },
  { label: 'Utilities', value: 'utilities' },
  { label: 'Transportation', value: 'transportation' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Dining', value: 'dining' },
  { label: 'Shopping', value: 'shopping' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Subscriptions', value: 'subscriptions' },
  { label: 'Education', value: 'education' },
  { label: 'Salary', value: 'salary' },
  { label: 'Freelance', value: 'freelance' },
  { label: 'Investment', value: 'investment' },
  { label: 'Other', value: 'other' },
];

export function TransactionForm({ onClose, editId }: TransactionFormProps) {
  const { transactions, addTransaction, updateTransaction } = useTransactionStore();
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense' as 'income' | 'expense',
    category: 'other' as Category,
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (editId) {
      const txn = transactions.find(t => t.id === editId);
      if (txn) {
        setFormData({
          description: txn.description,
          amount: txn.amount.toString(),
          date: txn.date.split('T')[0],
          type: txn.type,
          category: txn.category,
        });
      }
    }
  }, [editId, transactions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.description) return setError('Description is required');
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      return setError('Please enter a valid positive amount');
    }
    if (!formData.date) return setError('Date is required');

    const newTxn: Omit<Transaction, 'id'> = {
      description: formData.description,
      amount: Number(formData.amount),
      date: new Date(formData.date).toISOString(),
      type: formData.type,
      category: formData.category,
      status: 'completed',
    };

    if (editId) {
      updateTransaction(editId, newTxn);
    } else {
      addTransaction(newTxn);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-base/80 backdrop-blur-sm">
      <Card glass className="w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-text-secondary hover:text-text-primary bg-bg-elevated rounded-full"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="text-xl font-bold mb-6 text-text-primary">
          {editId ? 'Edit Transaction' : 'Add New Transaction'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Description" 
            placeholder="e.g., Whole Foods Grocery" 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            autoFocus
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Amount" 
              type="number" 
              step="0.01" 
              placeholder="0.00" 
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
            />
            
            <Input 
              label="Date" 
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value as any})}
              options={[
                { label: 'Expense', value: 'expense' },
                { label: 'Income', value: 'income' },
              ]}
            />
            
            <Select 
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value as any})}
              options={CATEGORY_OPTIONS}
            />
          </div>

          {error && <div className="p-3 bg-color-error/10 border border-color-error/20 text-color-error text-sm rounded-lg">{error}</div>}

          <div className="flex justify-end gap-3 pt-4 border-t border-border-default mt-6">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">{editId ? 'Save Changes' : 'Add Transaction'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
