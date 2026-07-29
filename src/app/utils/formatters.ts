import { TransactionStatus } from '../models/app.models';

export function formatRupiah(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return 'Belum Cair';
  
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(absVal);

  return isNegative ? `-Rp ${formatted}` : `Rp ${formatted}`;
}

export function formatDateIndonesian(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function getStatusBadgeClasses(status: TransactionStatus): string {
  switch (status) {
    case 'Belum bayar':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'Dibayar':
      return 'bg-blue-50 text-blue-800 border-blue-200';
    case 'Cair':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'Batal - perlu refund':
      return 'bg-red-50 text-red-800 border-red-200';
    case 'Gagal kirim - jadi stok':
    case 'Retur - jadi stok':
      return 'bg-purple-50 text-purple-800 border-purple-200';
    case 'Komplain':
      return 'bg-red-50 text-red-800 border-red-200';
    default:
      return 'bg-gray-50 text-gray-800 border-gray-200';
  }
}
