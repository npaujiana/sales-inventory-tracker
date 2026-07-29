import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-segera-hadir',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  template: `
    <div class="min-h-screen bg-brand-bg pb-12">
      <app-header title="Segera Hadir" subtitle="Modul Dalam Tahap Pengembangan Selanjutnya"></app-header>

      <main class="p-6 max-w-4xl mx-auto text-center py-16 space-y-6">
        <div class="w-20 h-20 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>

        <div class="space-y-2">
          <h2 class="text-xl font-bold text-brand-text">Modul Ini Disediakan pada Tahap Berikutnya</h2>
          <p class="text-xs text-gray-500 max-w-md mx-auto">
            Menu ini telah masuk ke dalam roadmap pengembangan sistem Pembukuan & Gudang V2. Saat ini 4 layar utama telah aktif dan siap digunakan untuk demo & operasional harian.
          </p>
        </div>

        <div class="pt-4">
          <a
            routerLink="/dashboard"
            class="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-teal hover:bg-brand-tealHover text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span>Kembali ke Dashboard Utama</span>
          </a>
        </div>
      </main>
    </div>
  `
})
export class SegeraHadirComponent {}
