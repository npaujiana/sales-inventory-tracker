import {
  Product,
  Warehouse,
  CustomerService,
  BonusSchemeInfo,
  Expense,
  Transaction,
  Channel,
  PaymentChannel,
  TransactionStatus,
  WarehouseStockItem
} from '../models/app.models';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prd_1',
    sku: 'KNP-SPR-125',
    name: 'Knalpot Standar Ori Supra X 125 Chrome Series',
    category: 'Sparepart Motor',
    buyPriceRef: 185000,
    sellPriceRef: 290000
  },
  {
    id: 'prd_2',
    sku: 'SPK-PLT-9527',
    name: 'Polytron Multimedia Speaker PMA 9527 Bazzoke',
    category: 'Audio & Speaker',
    buyPriceRef: 680000,
    sellPriceRef: 950000
  },
  {
    id: 'prd_3',
    sku: 'RTR-SMF-UNL',
    name: 'Router Modem WiFi 4G + SIM Smartfren Unlimited',
    category: 'Router & Internet',
    buyPriceRef: 320000,
    sellPriceRef: 460000
  },
  {
    id: 'prd_4',
    sku: 'KRB-MIO-5TL',
    name: 'Karburator Mio 5TL Original Genuine Part',
    category: 'Sparepart Motor',
    buyPriceRef: 210000,
    sellPriceRef: 335000
  },
  {
    id: 'prd_5',
    sku: 'CVR-INV-RBN',
    name: 'Cover Jok Innova Reborn Premium Microfiber',
    category: 'Aksesoris Mobil',
    buyPriceRef: 450000,
    sellPriceRef: 720000
  },
  {
    id: 'prd_6',
    sku: 'PRK-AMP-PRO',
    name: 'Ampere Meter Digital Multitester Auto Range Pro',
    category: 'Perkakas & Alat',
    buyPriceRef: 125000,
    sellPriceRef: 210000
  },
  {
    id: 'prd_7',
    sku: 'AKS-HLM-V6P',
    name: 'Intercom Helm Bluetooth Ejeas V6 Pro 1200M',
    category: 'Aksesoris Motor',
    buyPriceRef: 390000,
    sellPriceRef: 590000
  },
  {
    id: 'prd_8',
    sku: 'DSH-CAM-FHD',
    name: 'Dashcam Mobil Dual Lens Full HD 1080P Night Vision',
    category: 'Aksesoris Mobil',
    buyPriceRef: 275000,
    sellPriceRef: 425000
  },
  {
    id: 'prd_9',
    sku: 'SHK-NMX-YSS',
    name: 'Shockbreaker Belakang NMAX YSS G-Sport Smooth',
    category: 'Sparepart Motor',
    buyPriceRef: 1450000,
    sellPriceRef: 2100000
  },
  {
    id: 'prd_10',
    sku: 'PMP-ELE-DIG',
    name: 'Pompa Ban Elektrik Portable Digital Auto Shutoff',
    category: 'Perkakas & Alat',
    buyPriceRef: 195000,
    sellPriceRef: 315000
  },
  {
    id: 'prd_11',
    sku: 'MDM-WFI-4GL',
    name: 'Modern Modem WiFi 4G LTE Portable All Operator',
    category: 'Router & Internet',
    buyPriceRef: 280000,
    sellPriceRef: 410000
  },
  {
    id: 'prd_12',
    sku: 'SPK-PLT-551',
    name: 'Speaker Soundbar TV Polytron PHT 551 Surround',
    category: 'Audio & Speaker',
    buyPriceRef: 820000,
    sellPriceRef: 1190000
  },
  {
    id: 'prd_13',
    sku: 'PRK-KNC-46P',
    name: 'Paket Kunci Shock Set 46 Pcs Chrome Vanadium Heavy Duty',
    category: 'Perkakas & Alat',
    buyPriceRef: 140000,
    sellPriceRef: 235000
  },
  {
    id: 'prd_14',
    sku: 'LMP-LED-H4T',
    name: 'Lampu LED Utama Motor H4 Turbo Fan 6000K Super Bright',
    category: 'Aksesoris Motor',
    buyPriceRef: 95000,
    sellPriceRef: 165000
  },
  {
    id: 'prd_15',
    sku: 'CHG-AKI-12V',
    name: 'Charger Aki Mobil Motor Automatic 12V 6A Smart Pulse',
    category: 'Perkakas & Alat',
    buyPriceRef: 115000,
    sellPriceRef: 185000
  },
  {
    id: 'prd_16',
    sku: 'HND-GRD-CNC',
    name: 'Handguard Motor Universal CNC Alumunium Guard Pro',
    category: 'Aksesoris Motor',
    buyPriceRef: 85000,
    sellPriceRef: 145000
  }
];

export const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: 'wh_magelang',
    name: 'Gudang Utama Magelang',
    city: 'Magelang',
    adminName: 'Bambang Setyo',
    adminWa: '0812-3456-7890'
  },
  {
    id: 'wh_semarang',
    name: 'Gudang Semarang',
    city: 'Semarang',
    adminName: 'Supriyanto',
    adminWa: '0819-8765-4321'
  }
];

export const INITIAL_CS_LIST: CustomerService[] = [
  {
    id: 'cs_bayu',
    name: 'Bayu Prasetyo',
    code: 'bayu',
    currentMonthNo: 2,
    bonusPercent: 10,
    targetAmount: 4000000,
    schemeLabel: 'Bulan ke-2 · 10% di atas target Rp 4.000.000'
  },
  {
    id: 'cs_sari',
    name: 'Sari Wulandari',
    code: 'sari',
    currentMonthNo: 4,
    bonusPercent: 30,
    targetAmount: 0,
    schemeLabel: 'Bulan ke-4 · 30% dari laba bersih (tanpa target)'
  },
  {
    id: 'cs_dimas',
    name: 'Dimas Kurniawan',
    code: 'dimas',
    currentMonthNo: 1,
    bonusPercent: 10,
    targetAmount: 3000000,
    schemeLabel: 'Bulan ke-1 · 10% di atas target Rp 3.000.000'
  }
];

export const BONUS_SCHEMES_LIST: BonusSchemeInfo[] = [
  {
    csId: 'cs_bayu',
    csName: 'Bayu Prasetyo',
    monthNo: 1,
    percent: 10,
    target: 3000000,
    description: 'Skema awal 3 bulan pertama (Tahap 1)'
  },
  {
    csId: 'cs_bayu',
    csName: 'Bayu Prasetyo',
    monthNo: 2,
    percent: 10,
    target: 4000000,
    description: 'Skema aktif bulan ini (Tahap 2)'
  },
  {
    csId: 'cs_bayu',
    csName: 'Bayu Prasetyo',
    monthNo: 3,
    percent: 10,
    target: 5000000,
    description: 'Skema bulan depan (Tahap 3)'
  },
  {
    csId: 'cs_bayu',
    csName: 'Bayu Prasetyo',
    monthNo: 4,
    percent: 30,
    target: 0,
    description: 'Skema permanen bulan ke-4 dst'
  },
  {
    csId: 'cs_sari',
    csName: 'Sari Wulandari',
    monthNo: 4,
    percent: 30,
    target: 0,
    description: 'Skema permanen bulan ke-4 dst'
  },
  {
    csId: 'cs_dimas',
    csName: 'Dimas Kurniawan',
    monthNo: 1,
    percent: 10,
    target: 3000000,
    description: 'Skema awal 3 bulan pertama (Tahap 1)'
  }
];

// Generate 350 realistic transactions spanning 90 days
export function generateMockTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const channels: Channel[] = ['Shopee', 'Tokopedia / TikTok', 'Website'];
  const paymentChannels: PaymentChannel[] = ['BCA', 'Flip', 'Transfer Owner'];
  const csList = INITIAL_CS_LIST;
  const products = INITIAL_PRODUCTS;

  // Base date relative to runtime (current date as 2026-07-30)
  const now = new Date();
  
  let orderCounter = 1001;

  for (let i = 89; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const monthStr = dateStr.substring(0, 7);

    // 3 to 6 orders per day
    const dailyCount = Math.floor(Math.random() * 4) + 3;

    for (let j = 0; j < dailyCount; j++) {
      const cs = csList[Math.floor(Math.random() * csList.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      const channel = channels[Math.floor(Math.random() * channels.length)];
      const payChannel = paymentChannels[Math.floor(Math.random() * paymentChannels.length)];
      const qty = Math.floor(Math.random() * 3) + 1; // 1 to 3 items

      const totalBuyPrice = product.buyPriceRef * qty;
      const totalSellPrice = product.sellPriceRef * qty;
      const profitEstimate = totalSellPrice - totalBuyPrice;

      // Status distribution based on how old the order is
      let status: TransactionStatus = 'Cair';
      if (i < 3) {
        // very recent (0-2 days ago)
        const rand = Math.random();
        if (rand < 0.4) status = 'Belum bayar';
        else if (rand < 0.8) status = 'Dibayar';
        else status = 'Cair';
      } else if (i < 10) {
        // 3-9 days ago
        const rand = Math.random();
        if (rand < 0.25) status = 'Dibayar';
        else if (rand < 0.8) status = 'Cair';
        else if (rand < 0.88) status = 'Batal - perlu refund';
        else if (rand < 0.94) status = 'Gagal kirim - jadi stok';
        else status = 'Retur - jadi stok';
      } else {
        // older orders (10+ days ago)
        const rand = Math.random();
        if (rand < 0.85) status = 'Cair';
        else if (rand < 0.89) status = 'Batal - perlu refund';
        else if (rand < 0.94) status = 'Gagal kirim - jadi stok';
        else if (rand < 0.98) status = 'Retur - jadi stok';
        else status = 'Komplain';
      }

      let paymentDate: string | undefined = undefined;
      let disbursementDate: string | undefined = undefined;
      let disbursementAmount: number | undefined = undefined;
      let profitRealized: number | undefined = undefined;
      let warehouseId: string | undefined = undefined;

      if (status !== 'Belum bayar') {
        paymentDate = dateStr;
      }

      if (status === 'Cair') {
        // Disbursement usually 2-5 days after order
        const disDate = new Date(d);
        disDate.setDate(disDate.getDate() + Math.floor(Math.random() * 4) + 2);
        disbursementDate = disDate.toISOString().split('T')[0];

        // Normal disbursement is 88% - 97% of sell price
        let ratio = 0.88 + Math.random() * 0.09;

        // Force 3 specific orders to have NEGATIVE profit realized!
        if (orderCounter === 1042 || orderCounter === 1150 || orderCounter === 1288) {
          // Disbursement is low, e.g. 50% due to dispute deduction or excessive promo fee
          ratio = 0.55;
        }

        disbursementAmount = Math.round(totalSellPrice * ratio);
        profitRealized = disbursementAmount - totalBuyPrice;
      }

      if (status === 'Gagal kirim - jadi stok' || status === 'Retur - jadi stok') {
        warehouseId = Math.random() > 0.4 ? 'wh_magelang' : 'wh_semarang';
      }

      transactions.push({
        id: `trx_${orderCounter}`,
        orderNo: orderCounter,
        orderDate: dateStr,
        csId: cs.id,
        csName: cs.name,
        channel: channel,
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        qty: qty,
        totalSellPrice,
        totalBuyPrice,
        profitEstimate,
        paymentChannel: payChannel,
        flipCode: payChannel === 'Flip' ? `FLP-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
        paymentDate,
        disbursementDate,
        disbursementAmount,
        profitRealized,
        status,
        warehouseId,
        notes: status === 'Komplain' ? 'Barang cacat pabrik / pembeli minta retur ganti baru' : undefined
      });

      orderCounter++;
    }
  }

  // Explicitly ensure ~10 orders from previous month disbursed in current month (cross-month disbursement)
  const currentMonthStr = now.toISOString().substring(0, 7);
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 25);
  const prevMonthStr = prevMonthDate.toISOString().substring(0, 7);

  let crossCount = 0;
  for (const t of transactions) {
    if (t.orderDate.substring(0, 7) === prevMonthStr && t.status === 'Cair' && crossCount < 10) {
      t.disbursementDate = `${currentMonthStr}-0${(crossCount % 5) + 2}`;
      crossCount++;
    }
  }

  return transactions;
}

export function generateMockExpenses(): Expense[] {
  const expenses: Expense[] = [];
  const csList = INITIAL_CS_LIST;
  const categories: ('Gudang' | 'Iklan' | 'Kode Flip' | 'Admin BCA')[] = ['Gudang', 'Iklan', 'Kode Flip', 'Admin BCA'];

  const now = new Date();
  const currentMonthStr = now.toISOString().substring(0, 7);
  
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthStr = prevDate.toISOString().substring(0, 7);

  const months = [currentMonthStr, prevMonthStr];

  let idCounter = 1;
  for (const m of months) {
    for (const cs of csList) {
      // 4 expenses per CS per month
      const amounts = {
        'Gudang': cs.id === 'cs_bayu' ? 150000 : 120000,
        'Iklan': cs.id === 'cs_bayu' ? 1200000 : cs.id === 'cs_sari' ? 1800000 : 900000,
        'Kode Flip': 45000,
        'Admin BCA': 25000
      };

      for (const cat of categories) {
        expenses.push({
          id: `exp_${idCounter++}`,
          csId: cs.id,
          month: m,
          category: cat,
          amount: amounts[cat]
        });
      }
    }
  }

  return expenses;
}
