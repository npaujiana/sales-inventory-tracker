import { Component, ElementRef, ViewChild, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { AppStateService } from '../../services/app-state.service';
import { formatRupiah, formatDateIndonesian, getStatusBadgeClasses } from '../../utils/formatters';
import { Product, Channel, PaymentChannel, TransactionStatus, Transaction } from '../../models/app.models';

@Component({
  selector: 'app-penjualan',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  template: `
    <div class="min-h-screen bg-brand-bg pb-12">
      <app-header title="Penjualan Marketplace" subtitle="Input Transaksi & Manajemen Siklus Status"></app-header>

      <main class="p-6 max-w-7xl mx-auto space-y-6">
        <!-- TOAST NOTIFICATION -->
        <div *ngIf="toastMessage()" 
             class="fixed top-20 right-6 z-50 bg-emerald-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 transition-all animate-bounce">
          <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span class="text-xs font-semibold">{{ toastMessage() }}</span>
        </div>

        <!-- CARD 1: INPUT FORM PENJUALAN MARKETPLACE -->
        <div class="bg-white rounded-xl border border-brand-border shadow-xs p-6">
          <div class="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
            <div class="flex items-center space-x-2">
              <div class="p-2 bg-brand-tealLight text-brand-teal rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-bold text-brand-text">Form Input Penjualan Baru</h3>
                <p class="text-xs text-gray-500">Fast input: pencarian produk autocomplete & qty terpisah</p>
              </div>
            </div>

            <span class="text-xs text-brand-teal bg-brand-tealLight font-medium px-3 py-1 rounded-full">
              Status awal: Belum bayar
            </span>
          </div>

          <form (ngSubmit)="saveTransaction()" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- LEFT 2 COLUMNS: FORM FIELDS -->
            <div class="lg:col-span-2 space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <!-- Order Date -->
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Tanggal Order *</label>
                  <input
                    type="date"
                    [(ngModel)]="formDate"
                    name="formDate"
                    required
                    class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:outline-none"
                  />
                </div>

                <!-- Channel -->
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Channel Toko *</label>
                  <select
                    [(ngModel)]="formChannel"
                    name="formChannel"
                    class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:outline-none bg-white"
                  >
                    <option value="Shopee">Shopee</option>
                    <option value="Tokopedia / TikTok">Tokopedia / TikTok</option>
                    <option value="Website">Website</option>
                  </select>
                </div>

                <!-- CS (Auto for CS Role / Selectable for Owner) -->
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Customer Service *</label>
                  <select
                    *ngIf="state.currentRole() !== 'cs_bayu'"
                    [(ngModel)]="formCsId"
                    name="formCsId"
                    class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:outline-none bg-white"
                  >
                    <option *ngFor="let cs of state.csList()" [value]="cs.id">{{ cs.name }}</option>
                  </select>
                  <input
                    *ngIf="state.currentRole() === 'cs_bayu'"
                    type="text"
                    value="Bayu Prasetyo"
                    readonly
                    class="w-full px-3 py-2 text-xs border border-gray-200 bg-gray-50 text-gray-700 rounded-lg cursor-not-allowed"
                  />
                </div>
              </div>

              <!-- Product Autocomplete -->
              <div class="relative">
                <label class="block text-xs font-semibold text-gray-700 mb-1">Produk (Ketik nama / SKU) *</label>
                <div class="relative">
                  <input
                    #productInput
                    type="text"
                    [(ngModel)]="productSearchText"
                    name="productSearchText"
                    (input)="onProductSearchInput()"
                    (keydown)="onProductKeyDown($event)"
                    placeholder="Ketik minimal 2 huruf... (mis. Knalpot, Speaker, Smartfren)"
                    class="w-full px-3 py-2 pr-8 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:outline-none font-medium"
                    autocomplete="off"
                  />
                  <span *ngIf="selectedProduct" class="absolute right-3 top-2.5 text-emerald-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </span>
                </div>

                <!-- Autocomplete Dropdown List -->
                <div *ngIf="showAutocomplete && filteredProductsList().length > 0" 
                     class="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-30 max-h-48 overflow-y-auto divide-y divide-gray-100">
                  <div
                    *ngFor="let p of filteredProductsList(); let i = index"
                    (click)="selectProductItem(p)"
                    [class]="i === activeAutocompleteIndex ? 'bg-brand-tealLight text-brand-teal' : 'hover:bg-gray-50'"
                    class="px-3 py-2 text-xs cursor-pointer flex justify-between items-center transition-colors"
                  >
                    <div>
                      <span class="font-bold text-gray-800">{{ p.name }}</span>
                      <span class="ml-2 text-[10px] text-gray-500 font-mono">SKU: {{ p.sku }}</span>
                    </div>
                    <div class="text-right text-[11px] text-gray-600 num-tabular">
                      Jual: {{ formatRupiah(p.sellPriceRef) }} · Beli: {{ formatRupiah(p.buyPriceRef) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Qty & Prices -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <!-- Qty (Separate Numeric Input!) -->
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">
                    Qty (Unit Terpisah) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    [(ngModel)]="formQty"
                    name="formQty"
                    (change)="recalculateTotalPrices()"
                    (keyup)="recalculateTotalPrices()"
                    required
                    class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:outline-none font-bold text-brand-text num-tabular"
                  />
                </div>

                <!-- Total Sell Price -->
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Harga Jual Total (Rp) *</label>
                  <input
                    type="number"
                    [(ngModel)]="formTotalSellPrice"
                    name="formTotalSellPrice"
                    required
                    class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:outline-none font-semibold text-emerald-800 num-tabular"
                  />
                </div>

                <!-- Total Buy Price -->
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Harga Beli Total (Rp) *</label>
                  <input
                    type="number"
                    [(ngModel)]="formTotalBuyPrice"
                    name="formTotalBuyPrice"
                    required
                    class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:outline-none font-semibold text-red-700 num-tabular"
                  />
                </div>
              </div>

              <!-- Payment Channel & Flip Code & Notes -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Kanal Pembayaran *</label>
                  <select
                    [(ngModel)]="formPayChannel"
                    name="formPayChannel"
                    class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:outline-none bg-white"
                  >
                    <option value="BCA">BCA</option>
                    <option value="Flip">Flip</option>
                    <option value="Transfer Owner">Transfer Owner</option>
                  </select>
                </div>

                <div *ngIf="formPayChannel === 'Flip'">
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Kode Flip (Opsional)</label>
                  <input
                    type="text"
                    [(ngModel)]="formFlipCode"
                    name="formFlipCode"
                    placeholder="Contoh: FLP-8891"
                    class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:outline-none uppercase font-mono"
                  />
                </div>

                <div [class]="formPayChannel === 'Flip' ? 'sm:col-span-1' : 'sm:col-span-2'">
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Catatan Bebas (Opsional)</label>
                  <input
                    type="text"
                    [(ngModel)]="formNotes"
                    name="formNotes"
                    placeholder="Nomor resi / catatan khusus dropship..."
                    class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <!-- RIGHT COLUMN: LIVE SUMMARY PANEL -->
            <div class="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Ringkasan Live Penjualan</h4>
                
                <div class="space-y-2.5 text-xs">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Harga Jual Total:</span>
                    <span class="font-bold text-gray-900 num-tabular">{{ formatRupiah(formTotalSellPrice) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Harga Beli Total:</span>
                    <span class="font-bold text-red-600 num-tabular">-{{ formatRupiah(formTotalBuyPrice) }}</span>
                  </div>
                  
                  <div class="pt-2 border-t border-gray-200 flex justify-between items-baseline">
                    <span class="font-semibold text-gray-700">Profit Estimasi:</span>
                    <span class="text-base font-extrabold text-brand-teal num-tabular">
                      {{ formatRupiah(liveProfitEstimate()) }}
                    </span>
                  </div>
                </div>

                <div class="mt-4 p-3 bg-emerald-50/80 border border-emerald-100 rounded-lg text-[11px] text-emerald-900">
                  <span class="font-semibold">Info Sistem:</span> Profit realisasi dihitung secara otomatis saat Anda mencatat pencairan dana marketplace nanti.
                </div>
              </div>

              <button
                type="submit"
                [disabled]="!selectedProduct"
                class="w-full py-2.5 bg-brand-teal hover:bg-brand-tealHover disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-xs rounded-lg transition-colors shadow-xs flex items-center justify-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>Simpan Penjualan</span>
              </button>
            </div>
          </form>
        </div>

        <!-- CARD 2: TRANSAKSI TABLE -->
        <div class="bg-white rounded-xl border border-brand-border shadow-xs">
          <!-- Table Toolbar (Filters & Search) -->
          <div class="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-center space-x-2">
              <h3 class="text-sm font-bold text-brand-text">Daftar Transaksi Penjualan</h3>
              <span class="text-xs bg-gray-100 text-gray-600 font-semibold px-2.5 py-0.5 rounded-full">
                {{ filteredTransactions().length }} transaksi
              </span>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap items-center gap-3 text-xs">
              <!-- Search Box -->
              <div class="relative">
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  placeholder="Cari order, produk, SKU, CS..."
                  class="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-teal focus:outline-none w-48 sm:w-64"
                />
                <svg class="w-4 h-4 text-gray-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>

              <!-- Filter Status -->
              <select
                [(ngModel)]="filterStatus"
                class="px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-teal focus:outline-none bg-white font-medium"
              >
                <option value="ALL">Semua Status</option>
                <option value="Belum bayar">Belum bayar</option>
                <option value="Dibayar">Dibayar</option>
                <option value="Cair">Cair</option>
                <option value="Batal - perlu refund">Batal - perlu refund</option>
                <option value="Gagal kirim - jadi stok">Gagal kirim - jadi stok</option>
                <option value="Retur - jadi stok">Retur - jadi stok</option>
                <option value="Komplain">Komplain</option>
              </select>
            </div>
          </div>

          <!-- Table Container -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th class="py-3 px-3">Tgl Order</th>
                  <th class="py-3 px-3">CS</th>
                  <th class="py-3 px-3">Produk & Qty</th>
                  <th class="py-3 px-3">Channel</th>
                  <th class="py-3 px-3 text-right">Harga Jual</th>
                  <th class="py-3 px-3 text-right">Harga Beli</th>
                  <th class="py-3 px-3 text-right">Est. Profit</th>
                  <th class="py-3 px-3 text-right">Real. Profit</th>
                  <th class="py-3 px-3 text-center">Status</th>
                  <th class="py-3 px-3">Bayar / Cair</th>
                  <th class="py-3 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-brand-text">
                <tr *ngFor="let t of paginatedTransactions()" class="hover:bg-gray-50/80 transition-colors">
                  <!-- Order Date -->
                  <td class="py-3 px-3 whitespace-nowrap font-medium text-gray-700">
                    <div>#{{ t.orderNo }}</div>
                    <div class="text-[11px] text-gray-400">{{ formatDateIndonesian(t.orderDate) }}</div>
                  </td>

                  <!-- CS -->
                  <td class="py-3 px-3 whitespace-nowrap font-semibold">
                    {{ t.csName }}
                  </td>

                  <!-- Product + Qty badge -->
                  <td class="py-3 px-3 max-w-xs">
                    <div class="font-bold text-gray-900 line-clamp-1" [title]="t.productName">
                      {{ t.productName }}
                    </div>
                    <div class="flex items-center space-x-2 mt-0.5">
                      <span class="text-[10px] font-mono text-gray-500">SKU: {{ t.sku }}</span>
                      <span class="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.2 rounded-full">
                        {{ t.qty }}x unit
                      </span>
                    </div>
                  </td>

                  <!-- Channel -->
                  <td class="py-3 px-3 whitespace-nowrap text-gray-600 font-medium">
                    {{ t.channel }}
                  </td>

                  <!-- Total Sell Price -->
                  <td class="py-3 px-3 whitespace-nowrap text-right font-bold num-tabular">
                    {{ formatRupiah(t.totalSellPrice) }}
                  </td>

                  <!-- Total Buy Price (Red minus) -->
                  <td class="py-3 px-3 whitespace-nowrap text-right font-semibold text-red-600 num-tabular">
                    -{{ formatRupiah(t.totalBuyPrice) }}
                  </td>

                  <!-- Profit Estimate (Grey) -->
                  <td class="py-3 px-3 whitespace-nowrap text-right font-semibold text-gray-500 num-tabular">
                    {{ formatRupiah(t.profitEstimate) }}
                  </td>

                  <!-- Profit Realized (Teal / Red / Emdash) -->
                  <td class="py-3 px-3 whitespace-nowrap text-right font-extrabold num-tabular"
                      [class]="t.profitRealized === undefined ? 'text-gray-400' : t.profitRealized >= 0 ? 'text-brand-teal' : 'text-red-600'">
                    {{ t.profitRealized !== undefined ? formatRupiah(t.profitRealized) : 'Belum Cair' }}
                  </td>

                  <!-- Status Badge -->
                  <td class="py-3 px-3 whitespace-nowrap text-center">
                    <span [class]="getStatusBadgeClasses(t.status) + ' px-2.5 py-1 rounded-full text-[11px] font-bold border inline-block'">
                      {{ t.status }}
                    </span>
                  </td>

                  <!-- Payment Channel / Disbursement Date -->
                  <td class="py-3 px-3 whitespace-nowrap text-gray-600">
                    <div>{{ t.paymentChannel }} <span *ngIf="t.flipCode" class="text-[10px] font-mono text-gray-400">({{ t.flipCode }})</span></div>
                    <div class="text-[10px] text-gray-400" *ngIf="t.disbursementDate">
                      Cair: {{ formatDateIndonesian(t.disbursementDate) }}
                    </div>
                  </td>

                  <!-- Action Button Dropdown -->
                  <td class="py-3 px-3 whitespace-nowrap text-center relative">
                    <button
                      (click)="openActionMenu(t, $event)"
                      class="p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Menu Aksi Status"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                      </svg>
                    </button>
                  </td>
                </tr>

                <!-- Empty State -->
                <tr *ngIf="filteredTransactions().length === 0">
                  <td colspan="11" class="py-8 text-center text-gray-500">
                    Tidak ada transaksi yang cocok dengan filter. Cobalah ubah filter status atau kata kunci pencarian.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Table Footer Summary -->
          <div class="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-semibold gap-2">
            <div class="text-gray-500">
              Total {{ filteredTransactions().length }} transaksi terpilih
            </div>
            <div class="flex flex-wrap items-center gap-4 text-brand-text num-tabular">
              <span>Total Jual: <strong>{{ formatRupiah(tableTotals().totalSell) }}</strong></span>
              <span>Total Beli: <strong class="text-red-600">-{{ formatRupiah(tableTotals().totalBuy) }}</strong></span>
              <span>Est. Profit: <strong class="text-gray-600">{{ formatRupiah(tableTotals().totalEstimate) }}</strong></span>
              <span>Real. Profit: <strong class="text-brand-teal text-sm">{{ formatRupiah(tableTotals().totalRealized) }}</strong></span>
            </div>
          </div>
        </div>

        <!-- CS ROLE NOTICE -->
        <div *ngIf="state.currentRole() === 'cs_bayu'" class="text-center text-xs text-gray-500 py-2">
          Perhatian: Sebagai CS, Anda hanya dapat melihat dan menginput transaksi sendiri. Hubungi Owner jika ada kesalahan data untuk koreksi/penghapusan.
        </div>
      </main>

      <!-- ACTION MENU DROPDOWN MODAL / POPUP -->
      <div *ngIf="activeMenuTrx" class="fixed inset-0 z-40 bg-black/20" (click)="closeActionMenu()">
        <div 
          class="absolute bg-white border border-gray-200 rounded-xl shadow-2xl p-2 w-64 z-50 text-xs divide-y divide-gray-100"
          [style.top.px]="menuPosition.y"
          [style.left.px]="menuPosition.x"
          (click)="$event.stopPropagation()"
        >
          <div class="px-3 py-2 font-bold text-gray-700 bg-gray-50 rounded-t-lg flex justify-between items-center">
            <span>Aksi #{{ activeMenuTrx.orderNo }}</span>
            <span class="text-[10px] font-semibold px-2 py-0.5 bg-gray-200 rounded text-gray-600">
              {{ activeMenuTrx.status }}
            </span>
          </div>

          <div class="py-1">
            <!-- Catat Pencairan -->
            <button
              *ngIf="activeMenuTrx.status === 'Dibayar' || activeMenuTrx.status === 'Belum bayar'"
              (click)="openDisbursementModal(activeMenuTrx)"
              class="w-full px-3 py-2 text-left hover:bg-emerald-50 text-emerald-800 font-semibold flex items-center space-x-2 transition-colors"
            >
              <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Catat Pencairan Marketplace</span>
            </button>

            <!-- Tandai Dibayar -->
            <button
              *ngIf="activeMenuTrx.status === 'Belum bayar'"
              (click)="markAsPaid(activeMenuTrx)"
              class="w-full px-3 py-2 text-left hover:bg-blue-50 text-blue-800 font-medium flex items-center space-x-2 transition-colors"
            >
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>Tandai Dibayar</span>
            </button>

            <!-- Tandai Gagal Kirim -> Jadi Stok -->
            <button
              (click)="openStockModal(activeMenuTrx, 'Gagal kirim - jadi stok')"
              class="w-full px-3 py-2 text-left hover:bg-purple-50 text-purple-800 font-medium flex items-center space-x-2 transition-colors"
            >
              <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              <span>Gagal Kirim → Masuk Stok</span>
            </button>

            <!-- Tandai Retur -> Jadi Stok -->
            <button
              (click)="openStockModal(activeMenuTrx, 'Retur - jadi stok')"
              class="w-full px-3 py-2 text-left hover:bg-purple-50 text-purple-800 font-medium flex items-center space-x-2 transition-colors"
            >
              <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <span>Retur → Masuk Stok</span>
            </button>

            <!-- Tandai Batal -->
            <button
              (click)="markAsCancelled(activeMenuTrx)"
              class="w-full px-3 py-2 text-left hover:bg-red-50 text-red-700 font-medium flex items-center space-x-2 transition-colors"
            >
              <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              <span>Tandai Batal (Refund)</span>
            </button>
          </div>

          <!-- Owner Actions -->
          <div *ngIf="state.currentRole() === 'owner'" class="py-1 bg-gray-50/50">
            <button
              (click)="confirmDeleteTrx(activeMenuTrx)"
              class="w-full px-3 py-2 text-left hover:bg-red-100 text-red-800 font-semibold flex items-center space-x-2 transition-colors"
            >
              <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              <span>Hapus Transaksi (Owner)</span>
            </button>
          </div>
        </div>
      </div>

      <!-- MODAL CATAT PENCAIRAN -->
      <div *ngIf="disbursementModalTrx" class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
          <div class="flex justify-between items-center pb-3 border-b border-gray-100">
            <h3 class="text-sm font-bold text-brand-text">Catat Pencairan Marketplace</h3>
            <button (click)="disbursementModalTrx = null" class="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <div class="text-xs text-gray-600 space-y-1 bg-gray-50 p-3 rounded-lg">
            <div>Order: <strong>#{{ disbursementModalTrx.orderNo }}</strong> : {{ disbursementModalTrx.productName }}</div>
            <div>Harga Jual: <strong class="num-tabular">{{ formatRupiah(disbursementModalTrx.totalSellPrice) }}</strong></div>
            <div>Harga Beli: <strong class="text-red-600 num-tabular">-{{ formatRupiah(disbursementModalTrx.totalBuyPrice) }}</strong></div>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Tanggal Pencairan *</label>
              <input
                type="date"
                [(ngModel)]="disbursementDateInput"
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Besaran Pencairan Masuk (Rp) *</label>
              <input
                type="number"
                [(ngModel)]="disbursementAmountInput"
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:outline-none font-bold text-brand-teal num-tabular"
              />
              <p class="text-[11px] text-gray-400 mt-1">Nilai bersih yang ditransfer marketplace ke rekening setelah dipotong biaya.</p>
            </div>
          </div>

          <!-- Preview Realized Profit -->
          <div class="p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex justify-between items-center text-xs">
            <span class="font-semibold text-emerald-900">Profit Realisasi Terhitung:</span>
            <span class="text-base font-extrabold text-brand-teal num-tabular">
              {{ formatRupiah(disbursementAmountInput - disbursementModalTrx.totalBuyPrice) }}
            </span>
          </div>

          <div class="flex justify-end space-x-2 pt-2">
            <button
              (click)="disbursementModalTrx = null"
              class="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Batal
            </button>
            <button
              (click)="saveDisbursement()"
              class="px-4 py-2 text-xs font-bold bg-brand-teal hover:bg-brand-tealHover text-white rounded-lg shadow-xs"
            >
              Simpan Pencairan
            </button>
          </div>
        </div>
      </div>

      <!-- MODAL PILIH GUDANG STOK -->
      <div *ngIf="stockModalTrx" class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
          <div class="flex justify-between items-center pb-3 border-b border-gray-100">
            <h3 class="text-sm font-bold text-brand-text">Simpan ke Stok Gudang</h3>
            <button (click)="stockModalTrx = null" class="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <div class="text-xs text-gray-600 bg-purple-50 p-3 rounded-lg border border-purple-100 space-y-1">
            <div class="font-bold text-purple-900">{{ stockModalStatus }}</div>
            <div>Order: <strong>#{{ stockModalTrx.orderNo }}</strong> : {{ stockModalTrx.productName }} ({{ stockModalTrx.qty }} unit)</div>
            <div class="text-[11px] text-purple-700 mt-1">Barang yang terlanjur dibeli dari supplier akan disimpan di gudang untuk dijual ulang.</div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Pilih Gudang Penyimpanan *</label>
            <select
              [(ngModel)]="selectedStockWarehouseId"
              class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:outline-none bg-white font-medium"
            >
              <option *ngFor="let wh of state.warehouses()" [value]="wh.id">
                {{ wh.name }} ({{ wh.city }})
              </option>
            </select>
          </div>

          <div class="flex justify-end space-x-2 pt-2">
            <button
              (click)="stockModalTrx = null"
              class="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Batal
            </button>
            <button
              (click)="saveStockConversion()"
              class="px-4 py-2 text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white rounded-lg shadow-xs"
            >
              Simpan & Tambah Stok
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PenjualanComponent {
  @ViewChild('productInput') productInputRef!: ElementRef<HTMLInputElement>;

  readonly state = inject(AppStateService);
  readonly formatRupiah = formatRupiah;
  readonly formatDateIndonesian = formatDateIndonesian;
  readonly getStatusBadgeClasses = getStatusBadgeClasses;

  // Form State
  formDate = new Date().toISOString().split('T')[0];
  formChannel: Channel = 'Shopee';
  formCsId = 'cs_bayu';
  productSearchText = '';
  selectedProduct: Product | null = null;
  showAutocomplete = false;
  activeAutocompleteIndex = 0;

  formQty = 1;
  formTotalSellPrice = 0;
  formTotalBuyPrice = 0;
  formPayChannel: PaymentChannel = 'BCA';
  formFlipCode = '';
  formNotes = '';

  // Toast
  toastMessage = signal<string | null>(null);

  // Filters & Search
  filterStatus = 'ALL';
  searchQuery = '';

  // Action Menu Popover
  activeMenuTrx: Transaction | null = null;
  menuPosition = { x: 0, y: 0 };

  // Disbursement Modal
  disbursementModalTrx: Transaction | null = null;
  disbursementDateInput = new Date().toISOString().split('T')[0];
  disbursementAmountInput = 0;

  // Stock Modal
  stockModalTrx: Transaction | null = null;
  stockModalStatus: 'Gagal kirim - jadi stok' | 'Retur - jadi stok' = 'Gagal kirim - jadi stok';
  selectedStockWarehouseId = 'wh_magelang';

  // Computed Autocomplete List
  filteredProductsList = computed(() => {
    const query = this.productSearchText.toLowerCase().trim();
    if (query.length < 2) return [];
    return this.state.products().filter(
      p => p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query)
    );
  });

  // Computed Live Profit Estimate
  liveProfitEstimate = computed(() => {
    return this.formTotalSellPrice - this.formTotalBuyPrice;
  });

  // Filtered Transactions List
  filteredTransactions = computed(() => {
    const month = this.state.selectedMonth();
    const status = this.filterStatus;
    const query = this.searchQuery.toLowerCase().trim();
    const visibleTrxs = this.state.roleVisibleTransactions();

    return visibleTrxs.filter(t => {
      // Month match (either order date or disbursement date)
      const matchesMonth = t.orderDate.substring(0, 7) === month;
      if (!matchesMonth) return false;

      // Status match
      if (status !== 'ALL' && t.status !== status) return false;

      // Search match
      if (query.length > 0) {
        const text = `${t.orderNo} ${t.productName} ${t.sku} ${t.csName} ${t.channel}`.toLowerCase();
        if (!text.includes(query)) return false;
      }

      return true;
    });
  });

  paginatedTransactions = computed(() => {
    return this.filteredTransactions();
  });

  tableTotals = computed(() => {
    const trxs = this.filteredTransactions();
    const totalSell = trxs.reduce((sum, t) => sum + t.totalSellPrice, 0);
    const totalBuy = trxs.reduce((sum, t) => sum + t.totalBuyPrice, 0);
    const totalEstimate = trxs.reduce((sum, t) => sum + t.profitEstimate, 0);
    const totalRealized = trxs
      .filter(t => t.status === 'Cair')
      .reduce((sum, t) => sum + (t.profitRealized || 0), 0);

    return { totalSell, totalBuy, totalEstimate, totalRealized };
  });

  onProductSearchInput() {
    this.selectedProduct = null;
    this.showAutocomplete = this.productSearchText.trim().length >= 2;
    this.activeAutocompleteIndex = 0;
  }

  onProductKeyDown(event: KeyboardEvent) {
    const list = this.filteredProductsList();
    if (!this.showAutocomplete || list.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeAutocompleteIndex = (this.activeAutocompleteIndex + 1) % list.length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeAutocompleteIndex = (this.activeAutocompleteIndex - 1 + list.length) % list.length;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (list[this.activeAutocompleteIndex]) {
        this.selectProductItem(list[this.activeAutocompleteIndex]);
      }
    } else if (event.key === 'Escape') {
      this.showAutocomplete = false;
    }
  }

  selectProductItem(product: Product) {
    this.selectedProduct = product;
    this.productSearchText = `${product.name} (${product.sku})`;
    this.showAutocomplete = false;
    this.recalculateTotalPrices();
  }

  recalculateTotalPrices() {
    if (this.selectedProduct) {
      const qty = Math.max(1, this.formQty);
      this.formTotalSellPrice = this.selectedProduct.sellPriceRef * qty;
      this.formTotalBuyPrice = this.selectedProduct.buyPriceRef * qty;
    }
  }

  saveTransaction() {
    if (!this.selectedProduct) return;

    const csId = this.state.currentRole() === 'cs_bayu' ? 'cs_bayu' : this.formCsId;
    const csObj = this.state.csList().find(c => c.id === csId);

    this.state.addTransaction({
      orderDate: this.formDate,
      csId: csId,
      csName: csObj ? csObj.name : 'Bayu Prasetyo',
      channel: this.formChannel,
      productId: this.selectedProduct.id,
      productName: this.selectedProduct.name,
      sku: this.selectedProduct.sku,
      qty: Math.max(1, this.formQty),
      totalSellPrice: this.formTotalSellPrice,
      totalBuyPrice: this.formTotalBuyPrice,
      paymentChannel: this.formPayChannel,
      flipCode: this.formPayChannel === 'Flip' ? this.formFlipCode : undefined,
      status: 'Belum bayar',
      notes: this.formNotes || undefined
    });

    // Reset Form
    this.productSearchText = '';
    this.selectedProduct = null;
    this.formQty = 1;
    this.formTotalSellPrice = 0;
    this.formTotalBuyPrice = 0;
    this.formFlipCode = '';
    this.formNotes = '';

    this.showToast('Penjualan tersimpan! Status: Belum bayar');

    // Refocus product input
    if (this.productInputRef) {
      this.productInputRef.nativeElement.focus();
    }
  }

  openActionMenu(trx: Transaction, event: MouseEvent) {
    event.stopPropagation();
    this.activeMenuTrx = trx;
    
    // Calculate popover coordinates safely
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.menuPosition = {
      x: Math.min(window.innerWidth - 270, rect.left - 200),
      y: Math.min(window.innerHeight - 300, rect.bottom + 4)
    };
  }

  closeActionMenu() {
    this.activeMenuTrx = null;
  }

  markAsPaid(trx: Transaction) {
    this.state.updateTransactionStatus(trx.id, 'Dibayar');
    this.closeActionMenu();
    this.showToast(`Order #${trx.orderNo} ditandai Dibayar!`);
  }

  markAsCancelled(trx: Transaction) {
    this.state.updateTransactionStatus(trx.id, 'Batal - perlu refund');
    this.closeActionMenu();
    this.showToast(`Order #${trx.orderNo} ditandai Batal (perlu refund)!`);
  }

  openDisbursementModal(trx: Transaction) {
    this.disbursementModalTrx = trx;
    this.disbursementDateInput = new Date().toISOString().split('T')[0];
    // Default disbursement amount 92% of sell price
    this.disbursementAmountInput = Math.round(trx.totalSellPrice * 0.92);
    this.closeActionMenu();
  }

  saveDisbursement() {
    if (!this.disbursementModalTrx) return;
    this.state.recordDisbursement(
      this.disbursementModalTrx.id,
      this.disbursementDateInput,
      this.disbursementAmountInput
    );
    this.showToast(`Pencairan Order #${this.disbursementModalTrx.orderNo} berhasil dicatat!`);
    this.disbursementModalTrx = null;
  }

  openStockModal(trx: Transaction, status: 'Gagal kirim - jadi stok' | 'Retur - jadi stok') {
    this.stockModalTrx = trx;
    this.stockModalStatus = status;
    this.selectedStockWarehouseId = 'wh_magelang';
    this.closeActionMenu();
  }

  saveStockConversion() {
    if (!this.stockModalTrx) return;
    this.state.markFailedOrReturnedToStock(
      this.stockModalTrx.id,
      this.stockModalStatus,
      this.selectedStockWarehouseId
    );
    this.showToast(`Order #${this.stockModalTrx.orderNo} berhasil diubah jadi stok gudang!`);
    this.stockModalTrx = null;
  }

  confirmDeleteTrx(trx: Transaction) {
    if (confirm(`Apakah Anda yakin ingin menghapus transaksi #${trx.orderNo}?`)) {
      this.state.deleteTransaction(trx.id);
      this.showToast(`Transaksi #${trx.orderNo} berhasil dihapus.`);
    }
    this.closeActionMenu();
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 3000);
  }
}
