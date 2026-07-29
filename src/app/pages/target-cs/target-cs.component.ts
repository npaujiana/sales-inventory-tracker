import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { AppStateService } from '../../services/app-state.service';
import { formatRupiah, formatDateIndonesian } from '../../utils/formatters';

@Component({
  selector: 'app-target-cs',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  template: `
    <div class="min-h-screen bg-brand-bg pb-12">
      <app-header title="Target & Bagi Hasil CS" subtitle="Kalkulasi Laba Bersih & Profit Sharing per CS"></app-header>

      <main class="p-6 max-w-7xl mx-auto space-y-6">
        <!-- TOAST NOTIFICATION -->
        <div *ngIf="toastMessage()" 
             class="fixed top-20 right-6 z-50 bg-emerald-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 transition-all animate-bounce">
          <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span class="text-xs font-semibold">{{ toastMessage() }}</span>
        </div>

        <!-- HEADER BANNER & DISCLAIMER CARD -->
        <div class="bg-emerald-900 text-white rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-1">
            <h3 class="text-base font-bold">Ringkasan Perhitungan Bagi Hasil CS</h3>
            <p class="text-xs text-emerald-200">
              Seluruh angka dihitung murni dari <strong>Profit Realisasi (Pencairan)</strong> bulan berjalan, bukan profit estimasi order.
            </p>
          </div>

          <!-- Mandatory Disclaimer Card -->
          <div class="bg-emerald-800/80 border border-emerald-700 rounded-lg p-3 text-[11px] text-emerald-100 max-w-md">
            <div class="font-bold text-white flex items-center space-x-1 mb-1">
              <svg class="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Ketentuan Transfer Bagi Hasil:</span>
            </div>
            <span>Perhitungan bagi hasil bersifat rekomendasi dan berlaku setelah dikonfirmasi & ditransfer oleh Owner.</span>
          </div>
        </div>

        <!-- CARDS PER CS (SORTED BY PROFIT REALISASI) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            *ngFor="let calc of visibleCsCalculations()"
            class="bg-white rounded-xl border border-brand-border shadow-xs p-6 flex flex-col justify-between space-y-4"
          >
            <!-- CS Header & Scheme Badge -->
            <div>
              <div class="flex items-center justify-between pb-3 border-b border-gray-100">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 rounded-full bg-brand-tealLight text-brand-teal font-bold flex items-center justify-center text-xs">
                    {{ calc.cs.name.substring(0, 2).toUpperCase() }}
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-brand-text">{{ calc.cs.name }}</h4>
                    <p class="text-[11px] text-gray-500">{{ calc.trxCount }} transaksi dicairkan</p>
                  </div>
                </div>
              </div>

              <div class="mt-3">
                <span class="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                  {{ calc.cs.schemeLabel }}
                </span>
              </div>

              <!-- Financial Breakdown -->
              <div class="mt-4 space-y-2 text-xs divide-y divide-gray-100">
                <!-- Profit Realisasi -->
                <div class="pt-2 flex justify-between items-center font-semibold">
                  <span class="text-gray-700">Profit Realisasi (Pencairan):</span>
                  <span class="text-brand-teal num-tabular font-bold text-sm">{{ formatRupiah(calc.profitRealized) }}</span>
                </div>

                <!-- Expenses Breakdown (Red Minus) -->
                <div class="pt-2 space-y-1">
                  <div class="text-[11px] font-bold text-red-700 uppercase tracking-wider">Rincian Pengeluaran CS:</div>
                  <div class="flex justify-between text-red-600 pl-2">
                    <span>- Biaya Gudang:</span>
                    <span class="num-tabular">-{{ formatRupiah(calc.expenseBreakdown.gudang) }}</span>
                  </div>
                  <div class="flex justify-between text-red-600 pl-2">
                    <span>- Biaya Iklan:</span>
                    <span class="num-tabular">-{{ formatRupiah(calc.expenseBreakdown.iklan) }}</span>
                  </div>
                  <div class="flex justify-between text-red-600 pl-2">
                    <span>- Kode Flip:</span>
                    <span class="num-tabular">-{{ formatRupiah(calc.expenseBreakdown.flip) }}</span>
                  </div>
                  <div class="flex justify-between text-red-600 pl-2">
                    <span>- Admin BCA:</span>
                    <span class="num-tabular">-{{ formatRupiah(calc.expenseBreakdown.bca) }}</span>
                  </div>
                  <div class="flex justify-between font-bold text-red-700 pt-1">
                    <span>Total Pengeluaran:</span>
                    <span class="num-tabular">-{{ formatRupiah(calc.totalExpenses) }}</span>
                  </div>
                </div>

                <!-- Net Profit -->
                <div class="pt-2 flex justify-between items-center font-bold text-gray-900">
                  <span>Laba Bersih CS:</span>
                  <span class="num-tabular text-sm">{{ formatRupiah(calc.netProfit) }}</span>
                </div>

                <!-- Target & Calculation -->
                <div class="pt-2 text-gray-600 space-y-1" *ngIf="calc.target > 0">
                  <div class="flex justify-between">
                    <span>Target Laba:</span>
                    <span class="num-tabular font-semibold">{{ formatRupiah(calc.target) }}</span>
                  </div>
                  <!-- Progress Bar -->
                  <div class="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-1">
                    <div class="bg-brand-teal h-full transition-all" [style.width.%]="calc.progressPercent"></div>
                  </div>
                  <div class="text-[10px] text-right text-gray-500 font-medium">
                    {{ calc.progressPercent }}% dari target
                  </div>
                </div>

                <!-- Bagi Hasil Final (BIG TEAL TEXT) -->
                <div class="pt-3 border-t border-gray-200 bg-emerald-50/60 -mx-6 px-6 py-3 mt-3 flex justify-between items-center">
                  <div>
                    <span class="text-xs font-bold text-emerald-950 uppercase tracking-wider block">Hak Bagi Hasil</span>
                    <span class="text-[10px] text-emerald-700 font-medium">Skema {{ calc.bonusPercent }}%</span>
                  </div>
                  <div class="text-xl font-extrabold text-brand-teal num-tabular">
                    {{ formatRupiah(calc.bonusAmount) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Transfer Status Footer -->
            <div class="pt-3 border-t border-gray-100">
              <div *ngIf="calc.isTransferred" class="bg-emerald-100 text-emerald-900 border border-emerald-200 px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between">
                <span class="flex items-center space-x-1">
                  <svg class="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Sudah Ditransfer</span>
                </span>
                <span class="text-[10px] font-semibold text-emerald-800">{{ formatDateIndonesian(calc.transferredAt) }}</span>
              </div>

              <!-- Owner Action Button -->
              <button
                *ngIf="!calc.isTransferred && state.currentRole() === 'owner'"
                (click)="openTransferModal(calc)"
                class="w-full py-2 bg-brand-teal hover:bg-brand-tealHover text-white font-bold text-xs rounded-lg transition-colors shadow-xs flex items-center justify-center space-x-1"
              >
                <span>Tandai Sudah Ditransfer</span>
              </button>

              <div *ngIf="!calc.isTransferred && state.currentRole() !== 'owner'" class="text-center text-xs text-amber-800 bg-amber-50 py-2 rounded-lg border border-amber-200 font-medium">
                Menunggu Konfirmasi & Transfer Owner
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION: TABEL PENCAIRAN LINTAS BULAN -->
        <div class="bg-white rounded-xl border border-brand-border shadow-xs p-6">
          <div class="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <div>
              <h3 class="text-sm font-bold text-brand-text">Pencairan Lintas Bulan (Order Bulan Lalu Cair Bulan Ini)</h3>
              <p class="text-xs text-gray-500">
                Meniru lembar "Orderan X Cair Gabung Bulan Y" (transaksi ini dihitung ke bagi hasil bulan pencairan)
              </p>
            </div>
            <span class="text-xs bg-purple-100 text-purple-900 font-bold px-3 py-1 rounded-full">
              {{ state.crossMonthDisbursements().length }} Orderan Lintas Bulan
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th class="py-3 px-3">Tgl Order (Bulan Lalu)</th>
                  <th class="py-3 px-3">Tgl Cair (Bulan Ini)</th>
                  <th class="py-3 px-3">CS</th>
                  <th class="py-3 px-3">Produk</th>
                  <th class="py-3 px-3 text-right">Harga Jual</th>
                  <th class="py-3 px-3 text-right">Harga Beli</th>
                  <th class="py-3 px-3 text-right">Besaran Pencairan</th>
                  <th class="py-3 px-3 text-right">Profit Realisasi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-brand-text">
                <tr *ngFor="let t of state.crossMonthDisbursements()" class="hover:bg-gray-50/80">
                  <td class="py-3 px-3 font-medium text-gray-600 whitespace-nowrap">
                    #{{ t.orderNo }} ({{ formatDateIndonesian(t.orderDate) }})
                  </td>
                  <td class="py-3 px-3 font-bold text-emerald-800 whitespace-nowrap">
                    {{ formatDateIndonesian(t.disbursementDate) }}
                  </td>
                  <td class="py-3 px-3 font-semibold">{{ t.csName }}</td>
                  <td class="py-3 px-3 max-w-xs truncate">{{ t.productName }}</td>
                  <td class="py-3 px-3 text-right font-semibold num-tabular">{{ formatRupiah(t.totalSellPrice) }}</td>
                  <td class="py-3 px-3 text-right text-red-600 font-semibold num-tabular">-{{ formatRupiah(t.totalBuyPrice) }}</td>
                  <td class="py-3 px-3 text-right font-bold text-gray-900 num-tabular">{{ formatRupiah(t.disbursementAmount) }}</td>
                  <td class="py-3 px-3 text-right font-extrabold text-brand-teal num-tabular">{{ formatRupiah(t.profitRealized) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- SECTION: TABEL SKEMA BAGI HASIL CS (COLLAPSIBLE) -->
        <div class="bg-white rounded-xl border border-brand-border shadow-xs overflow-hidden">
          <button
            (click)="showSchemesTable = !showSchemesTable"
            class="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-left"
          >
            <div class="flex items-center space-x-2">
              <span class="text-sm font-bold text-brand-text">Master Skema Bagi Hasil Customer Service</span>
              <span class="text-xs text-gray-500 font-normal">(Klik untuk melihat aturan persentase & target per CS)</span>
            </div>
            <span class="text-xs text-gray-500 font-bold">
              {{ showSchemesTable ? 'Sembunyikan ▲' : 'Tampilkan Detail ▼' }}
            </span>
          </button>

          <div *ngIf="showSchemesTable" class="p-6 border-t border-gray-200 space-y-4">
            <div class="flex justify-between items-center">
              <p class="text-xs text-gray-500">Skema bertahap 3 bulan pertama (target naik) dan skema permanen bulan ke-4 dst.</p>
              <button
                *ngIf="state.currentRole() === 'owner'"
                (click)="showEditSchemeModal = true"
                class="px-3 py-1.5 bg-gray-800 text-white font-semibold text-xs rounded-lg hover:bg-gray-900 transition-colors"
              >
                Ubah Skema CS (Owner)
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th class="py-2.5 px-3">Nama CS</th>
                    <th class="py-2.5 px-3">Tahap / Bulan Ke-</th>
                    <th class="py-2.5 px-3 text-center">Persentase (%)</th>
                    <th class="py-2.5 px-3 text-right">Target Laba</th>
                    <th class="py-2.5 px-3">Keterangan Skema</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr *ngFor="let scheme of state.bonusSchemes()" class="hover:bg-gray-50">
                    <td class="py-2.5 px-3 font-bold text-brand-text">{{ scheme.csName }}</td>
                    <td class="py-2.5 px-3 font-semibold text-gray-700">Bulan Ke-{{ scheme.monthNo }}</td>
                    <td class="py-2.5 px-3 text-center font-bold text-brand-teal num-tabular">{{ scheme.percent }}%</td>
                    <td class="py-2.5 px-3 text-right font-semibold num-tabular">
                      {{ scheme.target > 0 ? formatRupiah(scheme.target) : 'Tanpa Target (100% Laba)' }}
                    </td>
                    <td class="py-2.5 px-3 text-gray-500 italic">{{ scheme.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <!-- MODAL TANDAI TRANSFER BAGI HASIL -->
      <div *ngIf="transferModalCalc" class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
          <div class="flex justify-between items-center pb-3 border-b border-gray-100">
            <h3 class="text-sm font-bold text-brand-text">Tandai Transfer Bagi Hasil</h3>
            <button (click)="transferModalCalc = null" class="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <div class="text-xs text-gray-700 bg-emerald-50 p-3 rounded-lg border border-emerald-100 space-y-1">
            <div>CS Penerima: <strong>{{ transferModalCalc.cs.name }}</strong></div>
            <div>Bagi Hasil Bulan Ini: <strong class="text-brand-teal text-sm num-tabular">{{ formatRupiah(transferModalCalc.bonusAmount) }}</strong></div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Tanggal Transfer Rekening *</label>
            <input
              type="date"
              [(ngModel)]="transferDateInput"
              class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:outline-none"
            />
          </div>

          <div class="flex justify-end space-x-2 pt-2">
            <button
              (click)="transferModalCalc = null"
              class="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Batal
            </button>
            <button
              (click)="confirmTransfer()"
              class="px-4 py-2 text-xs font-bold bg-brand-teal hover:bg-brand-tealHover text-white rounded-lg shadow-xs"
            >
              Konfirmasi Transfer (Owner)
            </button>
          </div>
        </div>
      </div>

      <!-- MODAL DUMMY UBAH SKEMA (OWNER) -->
      <div *ngIf="showEditSchemeModal" class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
          <div class="flex justify-between items-center pb-3 border-b border-gray-100">
            <h3 class="text-sm font-bold text-brand-text">Ubah Skema Bagi Hasil CS</h3>
            <button (click)="showEditSchemeModal = false" class="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <p class="text-xs text-gray-600">
            Fitur ubah skema memungkinkan Owner mengatur persentase dan target bulanan CS secara fleksibel langsung dari aplikasi tanpa perlu mengubah source code.
          </p>

          <div class="flex justify-end space-x-2 pt-2">
            <button
              (click)="showEditSchemeModal = false"
              class="px-4 py-2 text-xs font-bold bg-brand-teal text-white rounded-lg"
            >
              Tutup (Demo Mode)
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TargetCsComponent {
  readonly state = inject(AppStateService);
  readonly formatRupiah = formatRupiah;
  readonly formatDateIndonesian = formatDateIndonesian;

  toastMessage = signal<string | null>(null);

  showSchemesTable = true;
  showEditSchemeModal = false;

  // Transfer Modal
  transferModalCalc: any = null;
  transferDateInput = new Date().toISOString().split('T')[0];

  visibleCsCalculations = computed(() => {
    const list = this.state.csBonusCalculations();
    const role = this.state.currentRole();
    if (role === 'cs_bayu') {
      return list.filter(c => c.cs.id === 'cs_bayu');
    }
    return list;
  });

  openTransferModal(calc: any) {
    this.transferModalCalc = calc;
    this.transferDateInput = new Date().toISOString().split('T')[0];
  }

  confirmTransfer() {
    if (!this.transferModalCalc) return;
    this.state.markBonusTransferred(
      this.transferModalCalc.cs.id,
      this.state.selectedMonth(),
      this.transferDateInput,
      this.transferModalCalc.bonusAmount
    );
    this.showToast(`Transfer bagi hasil untuk ${this.transferModalCalc.cs.name} berhasil ditandai!`);
    this.transferModalCalc = null;
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 3500);
  }
}
