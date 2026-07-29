import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../services/app-state.service';
import { UserRole } from '../../models/app.models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="bg-white border-b border-brand-border sticky top-0 z-20 shadow-xs">
      <!-- Top Header Row -->
      <div class="h-16 px-6 flex items-center justify-between">
        <!-- Page Title -->
        <div class="flex items-center space-x-3">
          <h2 class="text-lg font-bold text-brand-text tracking-tight">{{ title }}</h2>
          <span *ngIf="subtitle" class="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
            {{ subtitle }}
          </span>
        </div>

        <!-- Right Side: Month Picker & Role Switcher -->
        <div class="flex items-center space-x-4">
          <!-- Month Selector -->
          <div class="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span class="text-gray-500 font-medium">Periode:</span>
            <input
              type="month"
              [value]="state.selectedMonth()"
              (change)="onMonthChange($event)"
              class="bg-transparent border-0 text-xs font-semibold text-brand-text focus:outline-none cursor-pointer"
            />
          </div>

          <!-- Role Switcher Segmented Buttons -->
          <div class="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
            <span class="text-[11px] font-semibold text-gray-400 px-2 uppercase tracking-wider hidden sm:inline">
              Role Demo:
            </span>
            
            <button
              (click)="selectRole('owner')"
              [class]="state.currentRole() === 'owner' 
                ? 'bg-brand-teal text-white shadow-xs font-semibold' 
                : 'text-gray-600 hover:text-gray-900 font-medium'"
              class="px-2.5 py-1 text-xs rounded-md transition-all flex items-center space-x-1"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              <span>Owner</span>
            </button>

            <button
              (click)="selectRole('supervisor')"
              [class]="state.currentRole() === 'supervisor' 
                ? 'bg-brand-teal text-white shadow-xs font-semibold' 
                : 'text-gray-600 hover:text-gray-900 font-medium'"
              class="px-2.5 py-1 text-xs rounded-md transition-all flex items-center space-x-1"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <span>Supervisor</span>
            </button>

            <button
              (click)="selectRole('cs_bayu')"
              [class]="state.currentRole() === 'cs_bayu' 
                ? 'bg-brand-teal text-white shadow-xs font-semibold' 
                : 'text-gray-600 hover:text-gray-900 font-medium'"
              class="px-2.5 py-1 text-xs rounded-md transition-all flex items-center space-x-1"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span>CS (Bayu)</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Role Notification Banner -->
      <div [class]="getBannerBgClass()" class="px-6 py-2 border-t border-b text-xs flex items-center justify-between font-medium transition-colors">
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>{{ state.roleBannerText() }}</span>
        </div>
        <span class="text-[11px] opacity-75 hidden md:inline">Klik role di atas untuk mengubah simulasi akses</span>
      </div>
    </header>
  `
})
export class HeaderComponent {
  @Input() title: string = 'Dashboard Utama';
  @Input() subtitle?: string;

  readonly state = inject(AppStateService);

  selectRole(role: UserRole) {
    this.state.setRole(role);
  }

  onMonthChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      this.state.setSelectedMonth(input.value);
    }
  }

  getBannerBgClass(): string {
    const role = this.state.currentRole();
    if (role === 'owner') return 'bg-emerald-50 text-emerald-900 border-emerald-200';
    if (role === 'supervisor') return 'bg-blue-50 text-blue-900 border-blue-200';
    return 'bg-amber-50 text-amber-900 border-amber-200';
  }
}
