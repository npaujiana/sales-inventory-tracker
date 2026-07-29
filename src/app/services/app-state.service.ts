import { Injectable, signal, computed } from '@angular/core';
import {
  UserRole,
  Transaction,
  Product,
  Warehouse,
  CustomerService,
  BonusSchemeInfo,
  Expense,
  BonusTransferRecord,
  TransactionStatus,
  WarehouseStockItem
} from '../models/app.models';
import {
  INITIAL_PRODUCTS,
  INITIAL_WAREHOUSES,
  INITIAL_CS_LIST,
  BONUS_SCHEMES_LIST,
  generateMockTransactions,
  generateMockExpenses
} from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  // Current user role
  readonly currentRole = signal<UserRole>('owner');

  // Currently selected month YYYY-MM
  readonly selectedMonth = signal<string>(new Date().toISOString().substring(0, 7));

  // Base datasets
  readonly products = signal<Product[]>(INITIAL_PRODUCTS);
  readonly warehouses = signal<Warehouse[]>(INITIAL_WAREHOUSES);
  readonly csList = signal<CustomerService[]>(INITIAL_CS_LIST);
  readonly bonusSchemes = signal<BonusSchemeInfo[]>(BONUS_SCHEMES_LIST);
  readonly transactions = signal<Transaction[]>(generateMockTransactions());
  readonly expenses = signal<Expense[]>(generateMockExpenses());
  readonly bonusTransfers = signal<BonusTransferRecord[]>([]);

  // Role banner text
  readonly roleBannerText = computed(() => {
    const role = this.currentRole();
    if (role === 'owner') return 'Anda melihat aplikasi sebagai: Owner (Akses Penuh - Edit, Hapus & Transfer Bagi Hasil)';
    if (role === 'supervisor') return 'Anda melihat aplikasi sebagai: Supervisor (Lihat Semua CS - Mode Pengawasan Tanpa Aksi Edit)';
    return 'Anda melihat aplikasi sebagai: Customer Service (Bayu Prasetyo - Terbatas Data & Transaksi Milik Sendiri)';
  });

  // Filtered transactions visible to current role
  readonly roleVisibleTransactions = computed(() => {
    const role = this.currentRole();
    const trxs = this.transactions();
    if (role === 'cs_bayu') {
      return trxs.filter(t => t.csId === 'cs_bayu');
    }
    return trxs;
  });

  // Dashboard Metrics Computed
  readonly dashboardMetrics = computed(() => {
    const month = this.selectedMonth();
    const visibleTrxs = this.roleVisibleTransactions();

    // Previous month string
    const [year, m] = month.split('-').map(Number);
    const prevDate = new Date(year, m - 2, 1);
    const prevMonth = prevDate.toISOString().substring(0, 7);

    // Month orders
    const monthOrders = visibleTrxs.filter(t => t.orderDate.substring(0, 7) === month);
    const prevMonthOrders = visibleTrxs.filter(t => t.orderDate.substring(0, 7) === prevMonth);

    const omzetMonth = monthOrders.reduce((sum, t) => sum + t.totalSellPrice, 0);
    const omzetPrevMonth = prevMonthOrders.reduce((sum, t) => sum + t.totalSellPrice, 0);

    let omzetGrowth = 0;
    if (omzetPrevMonth > 0) {
      omzetGrowth = Math.round(((omzetMonth - omzetPrevMonth) / omzetPrevMonth) * 100);
    }

    // Profit Realized Month (Disbursed in selectedMonth!)
    const monthDisbursed = visibleTrxs.filter(
      t => t.status === 'Cair' && t.disbursementDate && t.disbursementDate.substring(0, 7) === month
    );

    const profitRealizedMonth = monthDisbursed.reduce((sum, t) => sum + (t.profitRealized || 0), 0);
    const profitEstimateMonth = monthOrders.reduce((sum, t) => sum + t.profitEstimate, 0);

    // Undisbursed funds ('Dibayar' but not 'Cair')
    const undisbursedTrxs = visibleTrxs.filter(t => t.status === 'Dibayar');
    const undisbursedAmount = undisbursedTrxs.reduce((sum, t) => sum + t.totalSellPrice, 0);
    const undisbursedCount = undisbursedTrxs.length;

    // Perlu perhatian (Batal - perlu refund + Komplain)
    const attentionTrxs = visibleTrxs.filter(
      t => t.status === 'Batal - perlu refund' || t.status === 'Komplain'
    );
    const attentionCount = attentionTrxs.length;
    const refundPendingAmount = visibleTrxs
      .filter(t => t.status === 'Batal - perlu refund')
      .reduce((sum, t) => sum + t.totalBuyPrice, 0);

    return {
      omzetMonth,
      omzetPrevMonth,
      omzetGrowth,
      profitRealizedMonth,
      profitEstimateMonth,
      undisbursedAmount,
      undisbursedCount,
      attentionCount,
      refundPendingAmount
    };
  });

  // Daily Chart Data 30 Days (Order Revenue vs Disbursement Received)
  readonly dailyChartData = computed(() => {
    const visibleTrxs = this.roleVisibleTransactions();
    const now = new Date();
    const result: { dateLabel: string; dateStr: string; orderRevenue: number; disbursementReceived: number }[] = [];

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dateLabel = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

      // Orders placed on dateStr
      const dayOrders = visibleTrxs.filter(t => t.orderDate === dateStr);
      const orderRevenue = dayOrders.reduce((sum, t) => sum + t.totalSellPrice, 0);

      // Disbursements received on dateStr
      const dayDisbursed = visibleTrxs.filter(t => t.status === 'Cair' && t.disbursementDate === dateStr);
      const disbursementReceived = dayDisbursed.reduce((sum, t) => sum + (t.disbursementAmount || 0), 0);

      result.push({
        dateLabel,
        dateStr,
        orderRevenue,
        disbursementReceived
      });
    }

    return result;
  });

  // Top 5 Products Month
  readonly topProductsMonth = computed(() => {
    const month = this.selectedMonth();
    const visibleTrxs = this.roleVisibleTransactions().filter(t => t.orderDate.substring(0, 7) === month);

    const map = new Map<string, { product: Product; qty: number; omzet: number; profitRealized: number }>();

    for (const t of visibleTrxs) {
      const existing = map.get(t.productId);
      const p = this.products().find(item => item.id === t.productId);
      if (!p) continue;

      if (!existing) {
        map.set(t.productId, {
          product: p,
          qty: t.qty,
          omzet: t.totalSellPrice,
          profitRealized: t.status === 'Cair' ? (t.profitRealized || 0) : 0
        });
      } else {
        existing.qty += t.qty;
        existing.omzet += t.totalSellPrice;
        if (t.status === 'Cair') {
          existing.profitRealized += (t.profitRealized || 0);
        }
      }
    }

    return Array.from(map.values())
      .sort((a, b) => b.omzet - a.omzet)
      .slice(0, 5);
  });

  // Dynamic Warehouse Stock (computed from transactions with failed delivery or return status)
  readonly warehouseStockList = computed<WarehouseStockItem[]>(() => {
    const trxs = this.transactions();
    const products = this.products();

    return products.map(p => {
      // Find transactions for this product that were converted to stock
      const stockTrxs = trxs.filter(
        t => t.productId === p.id && (t.status === 'Gagal kirim - jadi stok' || t.status === 'Retur - jadi stok')
      );

      let magelangUnits = 0;
      let semarangUnits = 0;

      const failedDates: string[] = [];
      const returnDates: string[] = [];

      stockTrxs.forEach(t => {
        const units = t.qty;
        if (t.warehouseId === 'wh_semarang') {
          semarangUnits += units;
        } else {
          // Default to magelang
          magelangUnits += units;
        }

        if (t.status === 'Gagal kirim - jadi stok') {
          failedDates.push(t.orderDate);
        } else {
          returnDates.push(t.orderDate);
        }
      });

      // Inject small default stock numbers for 2 products to ensure realistic low stock cards
      if (p.sku === 'KNP-SPR-125') {
        magelangUnits += 2;
        semarangUnits += 1;
      }
      if (p.sku === 'SPK-PLT-9527') {
        magelangUnits += 1;
      }

      const origins: WarehouseStockItem['origins'] = [];
      if (failedDates.length > 0) {
        origins.push({
          status: 'Gagal kirim - jadi stok',
          count: failedDates.length,
          transactionDates: failedDates
        });
      }
      if (returnDates.length > 0) {
        origins.push({
          status: 'Retur - jadi stok',
          count: returnDates.length,
          transactionDates: returnDates
        });
      }

      return {
        productId: p.id,
        sku: p.sku,
        productName: p.name,
        category: p.category,
        magelangUnits,
        semarangUnits,
        minStock: 3,
        origins
      };
    });
  });

  // CS Bagi Hasil Calculations Computed
  readonly csBonusCalculations = computed(() => {
    const month = this.selectedMonth();
    const trxs = this.transactions();
    const csList = this.csList();
    const expenses = this.expenses();
    const transfers = this.bonusTransfers();

    return csList.map(cs => {
      // Disbursed transactions for this CS in selectedMonth
      const csDisbursedTrxs = trxs.filter(
        t => t.csId === cs.id && t.status === 'Cair' && t.disbursementDate && t.disbursementDate.substring(0, 7) === month
      );

      const profitRealized = csDisbursedTrxs.reduce((sum, t) => sum + (t.profitRealized || 0), 0);
      const trxCount = trxs.filter(t => t.csId === cs.id && t.orderDate.substring(0, 7) === month).length;

      // Pending undisbursed funds for CS
      const pendingFunds = trxs
        .filter(t => t.csId === cs.id && t.status === 'Dibayar')
        .reduce((sum, t) => sum + t.totalSellPrice, 0);

      // Expenses for CS in month
      const csExpenses = expenses.filter(e => e.csId === cs.id && e.month === month);
      const expenseBreakdown = {
        gudang: csExpenses.filter(e => e.category === 'Gudang').reduce((s, e) => s + e.amount, 0),
        iklan: csExpenses.filter(e => e.category === 'Iklan').reduce((s, e) => s + e.amount, 0),
        flip: csExpenses.filter(e => e.category === 'Kode Flip').reduce((s, e) => s + e.amount, 0),
        bca: csExpenses.filter(e => e.category === 'Admin BCA').reduce((s, e) => s + e.amount, 0)
      };

      const totalExpenses =
        expenseBreakdown.gudang + expenseBreakdown.iklan + expenseBreakdown.flip + expenseBreakdown.bca;

      const netProfit = profitRealized - totalExpenses;

      // Bonus scheme
      const percent = cs.bonusPercent;
      const target = cs.targetAmount;
      const eligibleProfit = target > 0 ? Math.max(0, netProfit - target) : Math.max(0, netProfit);
      const bonusAmount = Math.round((eligibleProfit * percent) / 100);

      // Progress percentage
      let progressPercent = 100;
      if (target > 0) {
        progressPercent = Math.min(100, Math.round((netProfit / target) * 100));
      }

      // Check transfer status
      const transferRecord = transfers.find(tr => tr.csId === cs.id && tr.month === month);

      return {
        cs,
        profitRealized,
        trxCount,
        pendingFunds,
        expenseBreakdown,
        totalExpenses,
        netProfit,
        target,
        bonusPercent: percent,
        bonusAmount,
        progressPercent,
        isTransferred: !!transferRecord,
        transferredAt: transferRecord?.transferredAt
      };
    });
  });

  // Cross Month Disbursements Table Data
  readonly crossMonthDisbursements = computed(() => {
    const month = this.selectedMonth();
    const visibleTrxs = this.roleVisibleTransactions();

    // Find transactions ordered in previous month but disbursed in selectedMonth
    const [year, m] = month.split('-').map(Number);
    const prevDate = new Date(year, m - 2, 1);
    const prevMonth = prevDate.toISOString().substring(0, 7);

    return visibleTrxs.filter(
      t =>
        t.orderDate.substring(0, 7) === prevMonth &&
        t.status === 'Cair' &&
        t.disbursementDate &&
        t.disbursementDate.substring(0, 7) === month
    );
  });

  // Actions / State Mutations

  setRole(role: UserRole) {
    this.currentRole.set(role);
  }

  setSelectedMonth(month: string) {
    this.selectedMonth.set(month);
  }

  addTransaction(newTrx: Omit<Transaction, 'id' | 'orderNo' | 'profitEstimate'>) {
    const currentTrxs = this.transactions();
    const maxOrderNo = currentTrxs.reduce((max, t) => Math.max(max, t.orderNo), 1000);
    const orderNo = maxOrderNo + 1;

    const profitEstimate = newTrx.totalSellPrice - newTrx.totalBuyPrice;

    const fullTrx: Transaction = {
      ...newTrx,
      id: `trx_${orderNo}`,
      orderNo,
      profitEstimate
    };

    this.transactions.update(list => [fullTrx, ...list]);
  }

  updateTransactionStatus(trxId: string, newStatus: TransactionStatus) {
    this.transactions.update(list =>
      list.map(t => {
        if (t.id === trxId) {
          const updated = { ...t, status: newStatus };
          if (newStatus === 'Dibayar' && !t.paymentDate) {
            updated.paymentDate = new Date().toISOString().split('T')[0];
          }
          return updated;
        }
        return t;
      })
    );
  }

  recordDisbursement(trxId: string, disbursementDate: string, disbursementAmount: number) {
    this.transactions.update(list =>
      list.map(t => {
        if (t.id === trxId) {
          const profitRealized = disbursementAmount - t.totalBuyPrice;
          return {
            ...t,
            status: 'Cair',
            disbursementDate,
            disbursementAmount,
            profitRealized,
            paymentDate: t.paymentDate || new Date().toISOString().split('T')[0]
          };
        }
        return t;
      })
    );
  }

  markFailedOrReturnedToStock(
    trxId: string,
    status: 'Gagal kirim - jadi stok' | 'Retur - jadi stok',
    warehouseId: string
  ) {
    this.transactions.update(list =>
      list.map(t => {
        if (t.id === trxId) {
          return {
            ...t,
            status,
            warehouseId
          };
        }
        return t;
      })
    );
  }

  deleteTransaction(trxId: string) {
    this.transactions.update(list => list.filter(t => t.id !== trxId));
  }

  markBonusTransferred(csId: string, month: string, transferredAt: string, amount: number) {
    this.bonusTransfers.update(list => {
      const existing = list.findIndex(r => r.csId === csId && r.month === month);
      if (existing >= 0) {
        const copy = [...list];
        copy[existing] = { csId, month, transferredAt, amount };
        return copy;
      } else {
        return [...list, { csId, month, transferredAt, amount }];
      }
    });
  }
}
