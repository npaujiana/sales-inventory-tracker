export type TransactionStatus =
  | 'Belum bayar'
  | 'Dibayar'
  | 'Cair'
  | 'Batal - perlu refund'
  | 'Gagal kirim - jadi stok'
  | 'Retur - jadi stok'
  | 'Komplain';

export type UserRole = 'owner' | 'supervisor' | 'cs_bayu';

export type Channel = 'Shopee' | 'Tokopedia / TikTok' | 'Website';

export type PaymentChannel = 'BCA' | 'Flip' | 'Transfer Owner';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  buyPriceRef: number;
  sellPriceRef: number;
}

export interface Warehouse {
  id: string;
  name: string;
  city: string;
  adminName: string;
  adminWa: string;
}

export interface WarehouseStockItem {
  productId: string;
  sku: string;
  productName: string;
  category: string;
  magelangUnits: number;
  semarangUnits: number;
  minStock: number;
  origins: {
    status: 'Gagal kirim - jadi stok' | 'Retur - jadi stok';
    count: number;
    transactionDates: string[];
  }[];
}

export interface CustomerService {
  id: string;
  name: string;
  code: 'bayu' | 'sari' | 'dimas';
  currentMonthNo: number;
  bonusPercent: number;
  targetAmount: number; // 0 if no target
  schemeLabel: string;
}

export interface BonusSchemeInfo {
  csId: string;
  csName: string;
  monthNo: number;
  percent: number;
  target: number; // 0 if no target
  description: string;
}

export interface Expense {
  id: string;
  csId: string;
  month: string; // 'YYYY-MM'
  category: 'Gudang' | 'Iklan' | 'Kode Flip' | 'Admin BCA';
  amount: number;
}

export interface Transaction {
  id: string;
  orderNo: number;
  orderDate: string; // 'YYYY-MM-DD'
  csId: string;
  csName: string;
  channel: Channel;
  productId: string;
  productName: string;
  sku: string;
  qty: number; // Separate field!
  totalSellPrice: number;
  totalBuyPrice: number;
  profitEstimate: number;
  paymentChannel: PaymentChannel;
  flipCode?: string;
  paymentDate?: string;
  disbursementDate?: string; // 'YYYY-MM-DD'
  disbursementAmount?: number;
  profitRealized?: number;
  status: TransactionStatus;
  warehouseId?: string;
  notes?: string;
}

export interface BonusTransferRecord {
  csId: string;
  month: string; // 'YYYY-MM'
  transferredAt: string; // 'YYYY-MM-DD'
  amount: number;
}
