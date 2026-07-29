import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { AppStateService } from '../../services/app-state.service';
import { formatRupiah } from '../../utils/formatters';

import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  template: `
    <div class="min-h-screen bg-brand-bg pb-12">
      <app-header title="Dashboard Utama" subtitle="Ikhtisar Omzet & Pencairan Realisasi"></app-header>

      <main class="p-6 max-w-7xl mx-auto space-y-6">
        <!-- ROW 1: 4 KPI CARDS -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <!-- Card 1: Omzet Bulan Ini -->
          <div class="bg-white rounded-xl p-5 border border-brand-border shadow-xs flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-brand-muted uppercase tracking-wider">Omzet Order (Bulan Ini)</span>
              <div class="p-2 rounded-lg bg-blue-50 text-blue-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <div class="mt-4">
              <div class="text-2xl font-bold text-brand-text num-tabular">
                {{ formatRupiah(metrics().omzetMonth) }}
              </div>
              <div class="mt-2 flex items-center text-xs font-medium"
                   [class]="metrics().omzetGrowth >= 0 ? 'text-emerald-700' : 'text-red-600'">
                <svg *ngIf="metrics().omzetGrowth >= 0" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
                <svg *ngIf="metrics().omzetGrowth < 0" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"/>
                </svg>
                <span>{{ metrics().omzetGrowth >= 0 ? '+' : '' }}{{ metrics().omzetGrowth }}% vs bulan lalu</span>
              </div>
            </div>
          </div>

          <!-- Card 2: Profit Realisasi Bulan Ini (KARTU UTAMA) -->
          <div class="bg-gradient-to-br from-emerald-900 to-brand-teal text-white rounded-xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div class="absolute -right-4 -bottom-4 opacity-10">
              <svg class="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
            </div>
            <div class="flex items-center justify-between relative z-10">
              <span class="text-xs font-semibold text-emerald-200 uppercase tracking-wider">Profit Realisasi (Saat Cair)</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-800 text-emerald-100 border border-emerald-700">
                Utama
              </span>
            </div>
            <div class="mt-4 relative z-10">
              <div class="text-2xl font-extrabold text-white num-tabular">
                {{ formatRupiah(metrics().profitRealizedMonth) }}
              </div>
              <div class="mt-2 text-xs text-emerald-100 font-medium">
                Profit Estimasi: <span class="num-tabular font-semibold text-white">{{ formatRupiah(metrics().profitEstimateMonth) }}</span>
              </div>
            </div>
          </div>

          <!-- Card 3: Dana Belum Cair -->
          <div class="bg-white rounded-xl p-5 border border-brand-border shadow-xs flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-brand-muted uppercase tracking-wider">Dana Belum Cair</span>
              <div class="p-2 rounded-lg bg-amber-50 text-amber-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <div class="mt-4">
              <div class="text-2xl font-bold text-amber-800 num-tabular">
                {{ formatRupiah(metrics().undisbursedAmount) }}
              </div>
              <div class="mt-2 text-xs text-gray-500 font-medium">
                {{ metrics().undisbursedCount }} transaksi menunggu pencairan
              </div>
            </div>
          </div>

          <!-- Card 4: Perlu Perhatian -->
          <div class="bg-white rounded-xl p-5 border border-brand-border shadow-xs flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-brand-muted uppercase tracking-wider">Perlu Perhatian</span>
              <div class="p-2 rounded-lg bg-red-50 text-red-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
            </div>
            <div class="mt-4">
              <div class="text-2xl font-bold text-red-700 num-tabular">
                {{ metrics().attentionCount }} <span class="text-sm font-normal text-gray-500">Order</span>
              </div>
              <div class="mt-2 text-xs text-red-600 font-medium">
                Refund tertunda: <span class="num-tabular font-semibold">{{ formatRupiah(metrics().refundPendingAmount) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ROW 2: LINE CHART (30 DAYS) -->
        <div class="bg-white rounded-xl p-6 border border-brand-border shadow-xs">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
            <div>
              <h3 class="text-sm font-bold text-brand-text">Tren Harian 30 Hari Terakhir</h3>
              <p class="text-xs text-gray-500">Memvisualkan jeda pencairan marketplace (Omzet Order vs Pencairan Realisasi Masuk)</p>
            </div>
            <!-- Legend indicators -->
            <div class="flex items-center space-x-4 text-xs font-medium">
              <div class="flex items-center space-x-1.5">
                <span class="w-3 h-3 rounded-full bg-blue-500"></span>
                <span class="text-gray-700">Omzet Order</span>
              </div>
              <div class="flex items-center space-x-1.5">
                <span class="w-3 h-3 rounded-full bg-brand-teal"></span>
                <span class="text-gray-700">Pencairan Realisasi</span>
              </div>
            </div>
          </div>

          <div class="mt-4 h-72 relative">
            <canvas #chartCanvas></canvas>
          </div>
        </div>

        <!-- ROW 3: TWO COLUMNS (Top Products & CS Summary) -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Column 1: Top 5 Produk Terlaris -->
          <div class="bg-white rounded-xl border border-brand-border shadow-xs p-6 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 class="text-sm font-bold text-brand-text">5 Produk Terlaris Bulan Ini</h3>
                <span class="text-xs text-gray-400">Berdasarkan volume omzet</span>
              </div>
              <div class="divide-y divide-gray-100 mt-2">
                <div *ngFor="let item of state.topProductsMonth(); let i = index" class="py-3 flex items-center justify-between">
                  <div class="flex items-center space-x-3 pr-4">
                    <span class="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center">
                      {{ i + 1 }}
                    </span>
                    <div>
                      <div class="text-xs font-semibold text-brand-text line-clamp-1" [title]="item.product.name">
                        {{ item.product.name }}
                      </div>
                      <div class="text-[11px] text-gray-500">SKU: {{ item.product.sku }} · {{ item.qty }} unit terjual</div>
                    </div>
                  </div>
                  <div class="text-right flex-shrink-0">
                    <div class="text-xs font-bold text-brand-text num-tabular">
                      {{ formatRupiah(item.omzet) }}
                    </div>
                    <div class="text-[11px] text-brand-teal font-medium num-tabular">
                      Profit: {{ formatRupiah(item.profitRealized) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Column 2: Ringkasan per CS Bulan Ini -->
          <div class="bg-white rounded-xl border border-brand-border shadow-xs p-6 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 class="text-sm font-bold text-brand-text">Ringkasan Customer Service Bulan Ini</h3>
                <span class="text-xs text-gray-400">Pencairan & Progress Target</span>
              </div>
              
              <div class="space-y-4 mt-4">
                <div *ngFor="let csCalc of state.csBonusCalculations()" class="p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                  <div class="flex items-center justify-between">
                    <div>
                      <span class="text-xs font-bold text-brand-text">{{ csCalc.cs.name }}</span>
                      <span class="ml-2 text-[10px] font-medium bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                        {{ csCalc.trxCount }} order
                      </span>
                    </div>
                    <div class="text-xs font-bold text-brand-teal num-tabular">
                      {{ formatRupiah(csCalc.profitRealized) }}
                    </div>
                  </div>

                  <!-- Progress Bar to Target -->
                  <div class="mt-2" *ngIf="csCalc.target > 0">
                    <div class="flex justify-between text-[11px] text-gray-500 mb-1">
                      <span>Progress Target ({{ formatRupiah(csCalc.target) }})</span>
                      <span class="font-semibold text-gray-700">{{ csCalc.progressPercent }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        class="bg-brand-teal h-full transition-all"
                        [style.width.%]="csCalc.progressPercent"
                      ></div>
                    </div>
                  </div>

                  <div class="mt-2 flex justify-between text-[11px] text-gray-500">
                    <span>Belum Cair: <strong class="text-amber-700 num-tabular">{{ formatRupiah(csCalc.pendingFunds) }}</strong></span>
                    <span>Bagi Hasil: <strong class="text-brand-teal num-tabular font-bold">{{ formatRupiah(csCalc.bonusAmount) }}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chartInstance?: Chart;

  readonly state = inject(AppStateService);
  readonly metrics = this.state.dashboardMetrics;
  readonly formatRupiah = formatRupiah;

  constructor() {
    // Re-render chart when daily data updates
    effect(() => {
      const data = this.state.dailyChartData();
      if (this.chartInstance) {
        this.updateChart(data);
      }
    });
  }

  ngAfterViewInit() {
    this.initChart(this.state.dailyChartData());
  }

  ngOnDestroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  initChart(data: { dateLabel: string; orderRevenue: number; disbursementReceived: number }[]) {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const labels = data.map(d => d.dateLabel);
    const orderRevenues = data.map(d => d.orderRevenue);
    const disbursements = data.map(d => d.disbursementReceived);

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Omzet Order (Rp)',
            data: orderRevenues,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            pointRadius: 2,
            pointHoverRadius: 5
          },
          {
            label: 'Pencairan Realisasi (Rp)',
            data: disbursements,
            borderColor: '#0F6E56',
            backgroundColor: 'rgba(15, 110, 86, 0.08)',
            borderWidth: 2.5,
            tension: 0.3,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const val = context.parsed.y || 0;
                return `${label}: ${formatRupiah(val)}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 11
              },
              color: '#6B7280'
            }
          },
          y: {
            grid: {
              color: '#F3F4F6'
            },
            ticks: {
              font: {
                size: 11
              },
              color: '#6B7280',
              callback: (value) => {
                const num = Number(value);
                if (num >= 1000000) return `${(num / 1000000).toFixed(1)}Jt`;
                if (num >= 1000) return `${(num / 1000).toFixed(0)}rb`;
                return `${num}`;
              }
            }
          }
        }
      }
    });
  }

  updateChart(data: { dateLabel: string; orderRevenue: number; disbursementReceived: number }[]) {
    if (!this.chartInstance) return;
    this.chartInstance.data.labels = data.map(d => d.dateLabel);
    this.chartInstance.data.datasets[0].data = data.map(d => d.orderRevenue);
    this.chartInstance.data.datasets[1].data = data.map(d => d.disbursementReceived);
    this.chartInstance.update();
  }
}
