import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PenjualanComponent } from './pages/penjualan/penjualan.component';
import { GudangComponent } from './pages/gudang/gudang.component';
import { TargetCsComponent } from './pages/target-cs/target-cs.component';
import { SegeraHadirComponent } from './pages/segera-hadir/segera-hadir.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'penjualan', component: PenjualanComponent },
  { path: 'gudang', component: GudangComponent },
  { path: 'target-cs', component: TargetCsComponent },
  { path: 'segera-hadir', component: SegeraHadirComponent },
  { path: '**', redirectTo: 'dashboard' }
];
