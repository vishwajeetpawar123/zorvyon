import React from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { useTransactionStore } from '../../store/useTransactionStore';
import { Search, FilterX } from 'lucide-react';

export function TransactionFilters() {
  const { filters, setFilter, resetFilters } = useTransactionStore();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setFilter('search', e.target.value);
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => setFilter('type', e.target.value as any);
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'all') setFilter('categories', []);
    else setFilter('categories', [val]);
  };
  
  const handleDateFrom = (e: React.ChangeEvent<HTMLInputElement>) => setFilter('dateRange', { ...filters.dateRange, from: e.target.value || null });
  const handleDateTo = (e: React.ChangeEvent<HTMLInputElement>) => setFilter('dateRange', { ...filters.dateRange, to: e.target.value || null });

  const hasFilters = filters.search !== '' || filters.type !== 'all' || filters.categories.length > 0 || filters.dateRange.from !== null || filters.dateRange.to !== null;

  return (
    <Card glass className="mb-6 overflow-visible">
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <Input 
            label="Search" 
            placeholder="Search by description..." 
            value={filters.search}
            onChange={handleSearch}
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        
        <div className="w-full md:w-48">
          <Select 
            label="Type"
            value={filters.type}
            onChange={handleTypeChange}
            options={[
              { label: 'All Types', value: 'all' },
              { label: 'Income Only', value: 'income' },
              { label: 'Expense Only', value: 'expense' },
            ]}
          />
        </div>

        <div className="w-full md:w-40">
          <Select 
            label="Category"
            value={filters.categories.length > 0 ? filters.categories[0] : 'all'}
            onChange={handleCategoryChange}
            options={[
              { label: 'All Categories', value: 'all' },
              { label: 'Housing', value: 'housing' },
              { label: 'Groceries', value: 'groceries' },
              { label: 'Transportation', value: 'transportation' },
              { label: 'Entertainment', value: 'entertainment' },
              { label: 'Dining', value: 'dining' },
              { label: 'Shopping', value: 'shopping' },
              { label: 'Utilities', value: 'utilities' },
              { label: 'Salary', value: 'salary' },
              { label: 'Freelance', value: 'freelance' }
            ]}
          />
        </div>

        <div className="w-full md:w-40">
          <Input 
            label="From Date" 
            type="date"
            value={filters.dateRange.from || ''}
            onChange={handleDateFrom}
          />
        </div>

        <div className="w-full md:w-40">
          <Input 
            label="To Date" 
            type="date"
            value={filters.dateRange.to || ''}
            onChange={handleDateTo}
            min={filters.dateRange.from || undefined}
          />
        </div>

        {hasFilters && (
          <Button variant="ghost" onClick={resetFilters} className="h-9 mb-0.5" icon={<FilterX className="h-4 w-4" />}>
            Reset
          </Button>
        )}
      </div>
    </Card>
  );
}
