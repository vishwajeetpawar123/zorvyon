import { Transaction } from '../types';
import { format } from 'date-fns';

export function exportToCSV(transactions: Transaction[], filename?: string) {
  if (!transactions.length) return;

  const headers = ['ID', 'Date', 'Description', 'Category', 'Type', 'Amount', 'Status'];
  const rows = transactions.map(t => [
    t.id,
    t.date,
    `"${t.description.replace(/"/g, '""')}"`,
    t.category,
    t.type,
    t.amount.toString(),
    t.status
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename || `transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`);
}

export function exportToJSON(transactions: Transaction[], filename?: string) {
  if (!transactions.length) return;

  const jsonContent = JSON.stringify(transactions, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  downloadBlob(blob, filename || `transactions_${format(new Date(), 'yyyy-MM-dd')}.json`);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
