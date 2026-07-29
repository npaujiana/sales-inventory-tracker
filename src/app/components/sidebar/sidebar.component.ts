import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  label: string;
  route: string;
  active: boolean;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="w-64 bg-[#0F172A] text-slate-200 flex flex-col h-screen fixed left-0 top-0 z-30 shadow-2xl border-r border-slate-800 font-sans">
      <!-- App Header / Logo -->
      <div class="h-16 flex items-center px-5 border-b border-slate-800 bg-[#090D16]">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0F6E56] to-emerald-500 flex items-center justify-center text-white font-black text-base shadow-md mr-3 border border-emerald-400/30">
          PG
        </div>
        <div>
          <h1 class="text-sm font-bold text-white tracking-wide">Pembukuan & Gudang</h1>
          <p class="text-[11px] text-emerald-400 font-medium flex items-center space-x-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>V2.0 (Dropship Multichannel)</span>
          </p>
        </div>
      </div>

      <!-- Navigation Menu -->
      <div class="flex-1 overflow-y-auto py-5 px-3 space-y-1.5">
        <div class="px-3 pb-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex justify-between items-center">
          <span>Navigasi Aplikasi</span>
          <span class="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">12 Menu</span>
        </div>

        <ng-container *ngFor="let item of menuItems">
          <!-- Active Menu Item (Layar Aktif) -->
          <a
            *ngIf="item.active"
            [routerLink]="item.route"
            routerLinkActive="bg-[#0F6E56] text-white font-bold shadow-md shadow-emerald-950/40 border-l-4 border-emerald-300"
            class="flex items-center px-3.5 py-3 text-xs rounded-xl transition-all text-slate-200 hover:bg-slate-800 hover:text-white group font-medium"
          >
            <span class="mr-3 text-base flex-shrink-0 text-slate-300 group-hover:text-white transition-colors" [innerHTML]="item.icon"></span>
            <span class="truncate flex-1 tracking-tight">{{ item.label }}</span>
            <span class="w-2 h-2 rounded-full bg-emerald-400 opacity-0 group-[.font-bold]:opacity-100 transition-opacity"></span>
          </a>

          <!-- Locked Menu Item (Menu Terkunci - Tahap Next) -->
          <a
            *ngIf="!item.active"
            [routerLink]="item.route"
            class="flex items-center px-3.5 py-2.5 text-xs rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all group relative border border-transparent hover:border-slate-700/50"
            title="Fitur dalam tahap pengembangan selanjutnya"
          >
            <span class="mr-3 text-base flex-shrink-0 opacity-70 group-hover:opacity-100" [innerHTML]="item.icon"></span>
            <span class="truncate flex-1 font-normal">{{ item.label }}</span>
            
            <!-- Lock Icon & Badge -->
            <span class="ml-2 flex-shrink-0 flex items-center space-x-1 bg-slate-800/90 group-hover:bg-amber-950/60 border border-slate-700 group-hover:border-amber-700/60 text-slate-400 group-hover:text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-medium transition-all">
              <svg class="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </span>
          </a>
        </ng-container>
      </div>

      <!-- Footer Info -->
      <div class="p-4 border-t border-slate-800 bg-[#090D16] text-[11px] text-slate-400 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="font-medium text-slate-300">Sync Spreadsheet Active</span>
        </div>
        <span class="text-[10px] text-slate-500 font-mono">v2.0</span>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    {
      label: '1. Dashboard Utama',
      route: '/dashboard',
      active: true,
      icon: '<svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>'
    },
    {
      label: '2. Target Customer Service',
      route: '/target-cs',
      active: true,
      icon: '<svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>'
    },
    {
      label: '3. Produk Dropship & Gudang',
      route: '/segera-hadir',
      active: false,
      icon: '<svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>'
    },
    {
      label: '4. Gudang & Stok',
      route: '/gudang',
      active: true,
      icon: '<svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>'
    },
    {
      label: '5. Daftar Supplier',
      route: '/segera-hadir',
      active: false,
      icon: '<svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>'
    },
    {
      label: '6. Penjualan Marketplace',
      route: '/penjualan',
      active: true,
      icon: '<svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>'
    },
    {
      label: '7. Penjualan Gudang & Stok',
      route: '/segera-hadir',
      active: false,
      icon: '<svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>'
    },
    {
      label: '8. Mutasi Stok',
      route: '/segera-hadir',
      active: false,
      icon: '<svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>'
    },
    {
      label: '9. Pembukuan',
      route: '/segera-hadir',
      active: false,
      icon: '<svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>'
    },
    {
      label: '10. Hutang/Piutang',
      route: '/segera-hadir',
      active: false,
      icon: '<svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>'
    },
    {
      label: '11. Laba Rugi',
      route: '/segera-hadir',
      active: false,
      icon: '<svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>'
    },
    {
      label: '12. Laporan',
      route: '/segera-hadir',
      active: false,
      icon: '<svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>'
    }
  ];
}
