import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { AppStateService } from '../../services/app-state.service';
import { WarehouseStockItem } from '../../models/app.models';
import { formatDateIndonesian } from '../../utils/formatters';

@Component({
  selector: 'app-gudang',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  template: `
    <div class="min-h-screen bg-brand-bg pb-12">
      <app-header title="Gudang & Stok" subtitle="Inventaris Barang Hasil Orderan Batal & Retur"></app-header>

      <main class="p-6 max-w-7xl mx-auto space-y-6">
        <!-- TOAST NOTIFICATION -->
        <div *ngIf="toastMessage()" 
             class="fixed top-20 right-6 z-50 bg-emerald-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 transition-all animate-bounce">
          <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span class="text-xs font-semibold">{{ toastMessage() }}</span>
        </div>

        <!-- ROW 1: 2 WAREHOUSE SUMMARY CARDS + MUTASI ACTION -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Warehouse 1: Magelang -->
          <div class="bg-white rounded-xl p-5 border border-brand-border shadow-xs flex justify-between items-start">
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
                <h3 class="text-sm font-bold text-brand-text">Gudang Utama Magelang</h3>
                <span class="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Gudang Utama</span>
              </div>
              <p class="text-xs text-gray-500">Admin: Bambang Setyo (0812-3456-7890)</p>

              <div class="flex items-center space-x-4 pt-2 text-xs">
                <div>Total Unit: <strong class="text-brand-text text-sm font-bold num-tabular">{{ magelangTotals().totalUnits }}</strong></div>
                <div>SKU Aktif: <strong class="text-gray-700 font-bold num-tabular">{{ magelangTotals().skuCount }}</strong></div>
              </div>
            </div>

            <span *ngIf="magelangTotals().lowStockCount > 0" 
                  class="bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full">
              {{ magelangTotals().lowStockCount }} SKU Menipis
            </span>
          </div>

          <!-- Warehouse 2: Semarang -->
          <div class="bg-white rounded-xl p-5 border border-brand-border shadow-xs flex justify-between items-start">
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <span class="w-3 h-3 rounded-full bg-blue-500"></span>
                <h3 class="text-sm font-bold text-brand-text">Gudang Semarang</h3>
                <span class="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Cabang</span>
              </div>
              <p class="text-xs text-gray-500">Admin: Supriyanto (0819-8765-4321)</p>

              <div class="flex items-center space-x-4 pt-2 text-xs">
                <div>Total Unit: <strong class="text-brand-text text-sm font-bold num-tabular">{{ semarangTotals().totalUnits }}</strong></div>
                <div>SKU Aktif: <strong class="text-gray-700 font-bold num-tabular">{{ semarangTotals().skuCount }}</strong></div>
              </div>
            </div>

            <span *ngIf="semarangTotals().lowStockCount > 0" 
                  class="bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full">
              {{ semarangTotals().lowStockCount }} SKU Menipis
            </span>
          </div>
        </div>

        <!-- CONTEXTUAL EXPLANATION BANNER -->
        <div class="bg-purple-50 border border-purple-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div class="flex items-center space-x-3 text-purple-950 font-medium">
            <div class="p-2 bg-purple-100 rounded-lg text-purple-700 flex-shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span>Stok berasal dari order gagal kirim atau retur yang barangnya disimpan untuk dijual ulang.</span>
          </div>

          <button
            (click)="showMutationModal = true"
            class="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-lg transition-colors shadow-xs flex items-center justify-center space-x-1.5 flex-shrink-0"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
            <span>Mutasi Antar Gudang</span>
          </button>
        </div>

        <!-- STOK TABLE -->
        <div class="bg-white rounded-xl border border-brand-border shadow-xs overflow-hidden">
          <div class="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-sm font-bold text-brand-text">Daftar Stok Produk Gudang</h3>
            <span class="text-xs text-gray-500">Real-time sync dengan transaksi gagal/retur</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th class="py-3 px-4">SKU</th>
                  <th class="py-3 px-4">Nama Produk & Kategori</th>
                  <th class="py-3 px-4 text-center">Magelang</th>
                  <th class="py-3 px-4 text-center">Semarang</th>
                  <th class="py-3 px-4">Asal Stok (Order Asal)</th>
                  <th class="py-3 px-4 text-center">Total Unit</th>
                  <th class="py-3 px-4 text-center">Aksi Penjualan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-brand-text">
                <tr
                  *ngFor="let item of state.warehouseStockList()"
                  [class]="(item.magelangUnits + item.semarangUnits) <= item.minStock ? 'bg-amber-50/60 hover:bg-amber-50' : 'hover:bg-gray-50/80'"
                  class="transition-colors"
                >
                  <!-- SKU -->
                  <td class="py-3.5 px-4 font-mono font-bold text-gray-700 whitespace-nowrap">
                    {{ item.sku }}
                  </td>

                  <!-- Product Name & Category -->
                  <td class="py-3.5 px-4 max-w-sm">
                    <div class="font-bold text-gray-900 line-clamp-1" [title]="item.productName">
                      {{ item.productName }}
                    </div>
                    <div class="text-[10px] text-gray-500 font-medium">{{ item.category }}</div>
                  </td>

                  <!-- Magelang Units -->
                  <td class="py-3.5 px-4 text-center font-semibold text-gray-800 num-tabular">
                    {{ item.magelangUnits }}
                  </td>

                  <!-- Semarang Units -->
                  <td class="py-3.5 px-4 text-center font-semibold text-gray-800 num-tabular">
                    {{ item.semarangUnits }}
                  </td>

                  <!-- Asal Stok Chips -->
                  <td class="py-3.5 px-4">
                    <div class="flex flex-wrap gap-1.5">
                      <ng-container *ngFor="let origin of item.origins">
                        <span
                          [title]="'Transaksi tanggal: ' + formatDatesList(origin.transactionDates)"
                          class="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-purple-100 text-purple-900 border-purple-200 cursor-help"
                        >
                          {{ origin.status === 'Gagal kirim - jadi stok' ? 'Gagal Kirim' : 'Retur' }} ({{ origin.count }})
                        </span>
                      </ng-container>
                      <span *ngIf="item.origins.length === 0" class="text-gray-400 text-[11px] italic">
                        Stok awal acuan
                      </span>
                    </div>
                  </td>

                  <!-- Total Unit -->
                  <td class="py-3.5 px-4 text-center whitespace-nowrap">
                    <span [class]="(item.magelangUnits + item.semarangUnits) <= item.minStock ? 'bg-amber-200 text-amber-900 font-extrabold px-2.5 py-1 rounded-full' : 'font-extrabold text-gray-900'">
                      {{ item.magelangUnits + item.semarangUnits }} unit
                    </span>
                  </td>

                  <!-- Action Button -->
                  <td class="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      (click)="onSellFromStock(item)"
                      class="px-3 py-1.5 bg-brand-teal hover:bg-brand-tealHover text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                    >
                      Jual dari Stok
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <!-- MODAL MUTASI ANTAK GUDANG -->
      <div *ngIf="showMutationModal" class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
          <div class="flex justify-between items-center pb-3 border-b border-gray-100">
            <h3 class="text-sm font-bold text-brand-text">Mutasi Stok Antar Gudang</h3>
            <button (click)="showMutationModal = false" class="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Pilih Produk *</label>
              <select
                [(ngModel)]="mutationProductId"
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:outline-none bg-white font-medium"
              >
                <option *ngFor="let p of state.products()" [value]="p.id">
                  {{ p.name }} ({{ p.sku }})
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Gudang Asal *</label>
                <select
                  [(ngModel)]="mutationFromWh"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:outline-none bg-white"
                >
                  <option value="wh_magelang">Magelang</option>
                  <option value="wh_semarang">Semarang</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Gudang Tujuan *</label>
                <select
                  [(ngModel)]="mutationToWh"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:outline-none bg-white"
                >
                  <option value="wh_semarang">Semarang</option>
                  <option value="wh_magelang">Magelang</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Jumlah Unit Mutasi *</label>
              <input
                type="number"
                min="1"
                [(ngModel)]="mutationQty"
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:outline-none font-bold num-tabular"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-2 pt-2">
            <button
              (click)="showMutationModal = false"
              class="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Batal
            </button>
            <button
              (click)="submitMutation()"
              class="px-4 py-2 text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white rounded-lg shadow-xs"
            >
              Catat Mutasi (Demo)
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class GudangComponent {
  readonly state = inject(AppStateService);

  toastMessage = signal<string | null>(null);

  // Mutation Modal State
  showMutationModal = false;
  mutationProductId = 'prd_1';
  mutationFromWh = 'wh_magelang';
  mutationToWh = 'wh_semarang';
  mutationQty = 1;

  magelangTotals = computed(() => {
    const list = this.state.warehouseStockList();
    const totalUnits = list.reduce((sum, item) => sum + item.magelangUnits, 0);
    const skuCount = list.filter(item => item.magelangUnits > 0).length;
    const lowStockCount = list.filter(item => item.magelangUnits > 0 && item.magelangUnits <= item.minStock).length;
    return { totalUnits, skuCount, lowStockCount };
  });

  semarangTotals = computed(() => {
    const list = this.state.warehouseStockList();
    const totalUnits = list.reduce((sum, item) => sum + item.semarangUnits, 0);
    const skuCount = list.filter(item => item.semarangUnits > 0).length;
    const lowStockCount = list.filter(item => item.semarangUnits > 0 && item.semarangUnits <= item.minStock).length;
    return { totalUnits, skuCount, lowStockCount };
  });

  formatDatesList(dates: string[]): string {
    return dates.map(d => formatDateIndonesian(d)).join(', ');
  }

  onSellFromStock(item: WarehouseStockItem) {
    this.showToast(`Tercatat sebagai Penjualan Gudang & Stok (menu terkunci - tahap berikutnya).`);
  }

  submitMutation() {
    this.showMutationModal = false;
    this.showToast(`Mutasi ${this.mutationQty} unit berhasil dicatat (demo).`);
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 3500);
  }
}
